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

  // ── AUTOMATIC DELIVERY OF THE BUYER GUIDE ──────────────────────────────────
  // When someone asks for the guide, they get it in seconds without Justus
  // touching anything. That is the whole promise of the form, and a give that
  // arrives two days later is not a give.
  //
  // SET THIS UP:
  //  1. Export the guide from Google Docs as a PDF and put the PDF in Drive.
  //  2. Open it, Share -> General access -> "Anyone with the link" -> Viewer.
  //     Without this the attachment still works, but any link in the email
  //     would not.
  //  3. Copy the file ID out of the URL. In
  //       https://drive.google.com/file/d/1AbC.../view
  //     the ID is the 1AbC... part.
  //  4. Paste it below and save. Nothing else changes.
  //
  // Leave it empty and the site behaves exactly as it does today: the lead is
  // recorded and Justus is notified, and nobody is promised a document that
  // does not arrive.
  GUIDE_FILE_ID: '',

  // Which forms trigger it, matched against the lead's source tag.
  GUIDE_SOURCES: ['Buyer Guide'],

  // The reply-to on the guide email. Replies should reach a person.
  GUIDE_REPLY_TO: 'justus@agentkidd.com',
  GUIDE_FROM_NAME: 'Justus Kidd',
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

    // The guide goes out AFTER the row is written and inside its own try, so a
    // problem with the attachment can never cost us the lead itself. Losing the
    // record is unrecoverable; a guide that did not send is one click to fix.
    var guideSent = false;
    try {
      guideSent = maybeSendGuide_(lead);
    } catch (guideErr) {
      console.error('guide send failed for ' + (lead.id || '?') + ': ' + guideErr);
    }

    return json_({ ok: true, id: lead.id || null, guideSent: guideSent });
  } catch (err) {
    // Log loudly and still return 200. The website treats a non-200 here as a
    // failed persist and writes the whole payload to its own logs, so a thrown
    // error would double-report. Executions -> this run has the detail.
    console.error('lead append failed: ' + err + ' :: ' + (e && e.postData ? e.postData.contents : ''));
    return json_({ ok: false, error: String(err) });
  }
}

/**
 * Send the buyer guide to the person who asked for it.
 *
 * Returns true only if an email actually went out, so the caller is never told
 * something happened that did not.
 */
function maybeSendGuide_(lead) {
  if (!CONFIG.GUIDE_FILE_ID) return false;
  if (!lead.email) return false;

  var source = String(lead.source || '');
  var wanted = false;
  for (var i = 0; i < CONFIG.GUIDE_SOURCES.length; i++) {
    if (source.indexOf(CONFIG.GUIDE_SOURCES[i]) !== -1) { wanted = true; break; }
  }
  if (!wanted) return false;

  // Do not send the same person the same guide twice in one day. People double
  // submit forms constantly, and two identical emails reads as broken.
  var cache = CacheService.getScriptCache();
  var key = 'guide:' + lead.email.toLowerCase();
  if (cache.get(key)) return false;

  var file = DriveApp.getFileById(CONFIG.GUIDE_FILE_ID);
  var first = String(lead.name || '').split(' ')[0] || 'there';

  var body =
    first + ',\n\n' +
    'Here is the guide, attached. It is the whole process start to finish, what it\n' +
    'actually costs, and the checklist I use when I walk a house.\n\n' +
    'Read it, mark it up, and send me your questions. There is no obligation and I\n' +
    'am not going to chase you.\n\n' +
    'If you would rather just talk it through, call or text me on (316) 390-2120.\n\n' +
    'Justus Kidd\n' +
    'Agent Kidd  ·  Real Broker, LLC  ·  Kansas licence 251163\n' +
    '(316) 390-2120  ·  justus@agentkidd.com';

  MailApp.sendEmail({
    to: lead.email,
    subject: 'Your Wichita homebuyer guide',
    body: body,
    name: CONFIG.GUIDE_FROM_NAME,
    replyTo: CONFIG.GUIDE_REPLY_TO,
    attachments: [file.getAs(MimeType.PDF)],
  });

  cache.put(key, '1', 86400);
  return true;
}

/**
 * Run this once from the editor to prove the guide delivery works before a real
 * visitor depends on it. Put your own address in.
 */
function TEST_sendGuideToMe() {
  var to = 'CHANGE_ME@example.com';
  var sent = maybeSendGuide_({ email: to, name: 'Test Person', source: 'Agent Kidd - Buyer Guide', id: 'test' });
  console.log(sent ? 'Sent to ' + to : 'Not sent. Check GUIDE_FILE_ID is set and the source matched.');
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
