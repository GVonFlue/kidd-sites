/**
 * Google Apps Script — lead sink for agentkidd.com and cornerstonemgmt.co
 *
 * This is what turns the "Website Leads" spreadsheet into the endpoint the site
 * posts to. It is the SOURCE OF TRUTH for every form on both brands
 * (Build Standard §8), so it does two jobs:
 *
 *   1. Append the lead to the sheet, which is the durable record.
 *   2. Email a notification, because a spreadsheet nobody opens is not a lead.
 *
 * That second job matters more than usual on this account. Justus's stated
 * problem is missed calls he cannot account for. A lead that lands silently in a
 * spreadsheet reproduces exactly the failure the site was built to fix.
 *
 * ── HOW TO DEPLOY ────────────────────────────────────────────────────────────
 *  1. Open the "Website Leads — Agent Kidd + Cornerstone" spreadsheet in Drive.
 *  2. Extensions -> Apps Script.
 *  3. Delete whatever is in Code.gs and paste this file in its place.
 *  4. Edit the CONFIG block below: set NOTIFY_TO.
 *  5. Deploy -> New deployment -> type "Web app".
 *       Execute as:        Me
 *       Who has access:    Anyone
 *     "Anyone" is required because the website's server calls this without a
 *     Google login. The URL is unguessable and the script only ever appends;
 *     it never reads the sheet back out.
 *  6. Authorise when prompted. Google will warn that the script is unverified;
 *     that is expected for a script you wrote yourself.
 *  7. Copy the deployment URL. It looks like:
 *       https://script.google.com/macros/s/AKfycb.../exec
 *  8. Paste it into Vercel as the environment variable SHEETS_WEBHOOK_URL.
 *     It is a secret. It never goes in the repository.
 *  9. Test it with the TEST_appendSampleLead function below (Run -> select it),
 *     then check the sheet and your inbox.
 *
 * ── IF YOU CHANGE THIS SCRIPT LATER ──────────────────────────────────────────
 * Deploy -> Manage deployments -> edit the existing one -> New version.
 * Creating a brand new deployment gives you a NEW URL and the old one keeps
 * working, which is how you end up with leads landing in two places.
 */

// ── CONFIG ───────────────────────────────────────────────────────────────────
var CONFIG = {
  SHEET_NAME: 'Leads',

  // Who gets told when a lead arrives. Comma-separated for more than one.
  NOTIFY_TO: 'justus@agentkidd.com',

  // Set this to also copy someone at ProyTech during the first weeks after
  // launch, so a delivery problem is noticed by us rather than by the client.
  NOTIFY_CC: '',

  // Turn off if the notifications become noise. The sheet still records
  // everything either way.
  SEND_EMAIL: true,
};

var HEADERS = [
  'Received (UTC)', 'Brand', 'Source (which form)', 'Name', 'Email', 'Phone',
  'Message', 'Property address', 'Units', 'Association', 'Unit count', 'Role',
  'Square feet', 'Move in', 'Lead ID', 'User agent',
];

function doPost(e) {
  try {
    var lead = JSON.parse(e.postData.contents);
    var sheet = getSheet_();
    var meta = lead.meta || {};

    sheet.appendRow([
      lead.receivedAt || new Date().toISOString(),
      lead.brand || '',
      lead.source || '',
      lead.name || '',
      lead.email || '',
      lead.phone || '',
      lead.message || '',
      meta.address || '',
      meta.units || '',
      meta.associationName || '',
      meta.unitCount || '',
      meta.role || '',
      meta.squareFeet || '',
      meta.moveIn || '',
      lead.id || '',
      lead.userAgent || '',
    ]);

    if (CONFIG.SEND_EMAIL && CONFIG.NOTIFY_TO) notify_(lead, meta);

    return json_({ ok: true, id: lead.id || null });
  } catch (err) {
    // Log loudly and still return 200. The website treats a non-200 here as a
    // failed persist and writes the whole payload to its own logs, so a thrown
    // error would double-report. Executions -> this run has the detail.
    console.error('lead append failed: ' + err + ' :: ' + (e && e.postData ? e.postData.contents : ''));
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, note: 'Lead sink is live. POST only.' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.getSheets()[0];
    sheet.setName(CONFIG.SHEET_NAME);
  }
  // Write the header row once, and freeze it so the sheet stays readable as it grows.
  if (sheet.getLastRow() === 0 || !sheet.getRange(1, 1).getValue()) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 165);
    sheet.setColumnWidth(3, 230);
    sheet.setColumnWidth(7, 320);
  }
  return sheet;
}

function notify_(lead, meta) {
  var isCornerstone = lead.brand === 'cornerstone';
  var phoneBack = isCornerstone ? '(316) 390-1009' : '(316) 390-2120';

  var lines = [
    lead.source,
    '',
    'Name:   ' + (lead.name || ''),
    'Email:  ' + (lead.email || ''),
    'Phone:  ' + (lead.phone || 'not given'),
  ];
  if (meta.address) lines.push('Address: ' + meta.address);
  if (meta.associationName) lines.push('Association: ' + meta.associationName + (meta.unitCount ? ' (' + meta.unitCount + ' units)' : ''));
  if (meta.role) lines.push('Role: ' + meta.role);
  if (meta.squareFeet) lines.push('Space needed: ' + meta.squareFeet);
  if (meta.moveIn) lines.push('Move in: ' + meta.moveIn);
  if (lead.message) lines.push('', 'They wrote:', lead.message);
  lines.push('', 'Received ' + (lead.receivedAt || ''), 'Lead ID ' + (lead.id || ''));
  lines.push('', 'Reply to this person directly at ' + (lead.email || '') + ', or call them back.');
  lines.push('Your line for this brand is ' + phoneBack + '.');

  var opts = { name: 'Website leads' };
  if (lead.email) opts.replyTo = lead.email;   // reply goes straight to the lead
  if (CONFIG.NOTIFY_CC) opts.cc = CONFIG.NOTIFY_CC;

  MailApp.sendEmail(
    CONFIG.NOTIFY_TO,
    'New lead: ' + (lead.name || 'someone') + ' — ' + (lead.source || 'website'),
    lines.join('\n'),
    opts
  );
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// ── Run this from the editor to check the whole path end to end. ─────────────
function TEST_appendSampleLead() {
  var sample = {
    id: 'test-' + Date.now(),
    brand: 'cornerstone',
    source: 'Cornerstone - Rent Analysis',
    name: 'Test Lead',
    email: 'test@example.com',
    phone: '3165550123',
    message: 'This is a test from the Apps Script editor. Safe to delete the row.',
    meta: { address: '123 Test Street, Wichita' },
    receivedAt: new Date().toISOString(),
    userAgent: 'Apps Script test',
  };
  var res = doPost({ postData: { contents: JSON.stringify(sample) } });
  Logger.log(res.getContent());
  Logger.log('Check the sheet for a "Test Lead" row, and check ' + CONFIG.NOTIFY_TO + ' for the email.');
}
