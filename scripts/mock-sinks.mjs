// Stand-in Google Sheet / CRM / GHL so every delivery path can be tested end to
// end without the client's real credentials. Each records what it received; the
// CRM can be told to fail on demand.
import { createServer } from 'node:http';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';

const LOG = 'shots/sink-log.json';
const log = existsSync(LOG) ? JSON.parse(readFileSync(LOG, 'utf8')) : { sheet: [], crm: [], ghl: [] };
let crmFails = false;

createServer((req, res) => {
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    const which = req.url.replace('/', '') || 'sheet';
    if (which === 'crm-fail') { crmFails = true; res.end('{"ok":true}'); return; }
    if (which === 'crm-ok') { crmFails = false; res.end('{"ok":true}'); return; }
    if (which === 'dump') { res.setHeader('content-type','application/json'); res.end(JSON.stringify(log)); return; }
    if (which === 'reset') { log.sheet = []; log.crm = []; log.ghl = []; writeFileSync(LOG, JSON.stringify(log)); res.end('{"ok":true}'); return; }

    let parsed; try { parsed = JSON.parse(body); } catch { parsed = { raw: body }; }
    if (which === 'crm' && crmFails) {
      log.crm.push({ FAILED: true, source: parsed.source });
      writeFileSync(LOG, JSON.stringify(log, null, 1));
      res.writeHead(503, { 'content-type': 'application/json' });
      res.end('{"error":"CRM is down"}');
      return;
    }
    (log[which] = log[which] || []).push(parsed);
    writeFileSync(LOG, JSON.stringify(log, null, 1));
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true, id: '9007199254740993' })); // 64-bit id, on purpose
  });
}).listen(4001, () => console.log('mock sinks on :4001'));
