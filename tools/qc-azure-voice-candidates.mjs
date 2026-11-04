import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const dir = path.join(root, 'assets', 'audio', 'azure-candidates');
const manifestPath = path.join(dir, 'manifest.json');
const expected = {
  '01': 'ar-SA-HamedNeural',
  '02a': 'ar-JO-TaimNeural',
  '02b': 'ar-SA-ZariyahNeural',
  '03': 'ar-SA-HamedNeural',
  '04a': 'ar-SA-HamedNeural',
  '04b': 'ar-SA-HamedNeural',
  '05': 'ar-SA-HamedNeural',
  '06a': 'ar-SA-ZariyahNeural',
  '06b': 'ar-JO-TaimNeural',
  '06c': 'ar-SA-ZariyahNeural'
};
const fail = [];
const pass = [];
const check = (ok, message) => (ok ? pass : fail).push(message);

if (!fs.existsSync(manifestPath)) {
  console.error('FAIL: Azure candidate manifest is missing. Generate candidates first.');
  process.exit(1);
}
let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
} catch {
  console.error('FAIL: manifest.json is not valid JSON.');
  process.exit(1);
}

const entries = Array.isArray(manifest) ? manifest : (manifest.clips ?? manifest.files ?? []);
check(Array.isArray(entries), 'Manifest clips must be an array.');
check(entries.length === Object.keys(expected).length,
  'Manifest contains ' + entries.length + ' entries (expected ' + Object.keys(expected).length + ').');

const seenHashes = new Set();
const probeCommand = process.env.FFPROBE_PATH || 'ffprobe';
const probeVersion = spawnSync(probeCommand, ['-version'], { encoding: 'utf8', windowsHide: true });
const probeAvailable = probeVersion.status === 0;
if (probeAvailable) pass.push('ffprobe executable is available.');
else fail.push('ffprobe is unavailable. Install FFmpeg and add ffprobe to PATH, or set FFPROBE_PATH.');

for (const [clip, voice] of Object.entries(expected)) {
  const item = entries.find(x => String(x.clip ?? x.id ?? x.clipId ?? '').replace(/^voice-/, '') === clip);
  if (!item) {
    fail.push('Clip ' + clip + ': manifest entry missing.');
    continue;
  }
  check(item.voiceId === voice, 'Clip ' + clip + ': expected ' + voice + ', got ' + (item.voiceId ?? 'missing') + '.');
  if (item.locale) check(item.locale.startsWith('ar-'), 'Clip ' + clip + ': locale ' + item.locale + ' is Arabic.');

  const file = item.file ? path.resolve(root, item.file) : path.join(dir, 'voice-' + clip + '.mp3');
  if (!fs.existsSync(file)) {
    fail.push('Clip ' + clip + ': audio file missing at ' + file + '.');
    continue;
  }

  const stat = fs.statSync(file);
  check(stat.size > 1000, 'Clip ' + clip + ': file size ' + stat.size + ' bytes.');
  if (item.bytes != null) check(stat.size === Number(item.bytes), 'Clip ' + clip + ': file size matches manifest.');

  const fileHash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  check(!seenHashes.has(fileHash), 'Clip ' + clip + ': audio file hash is unique.');
  seenHashes.add(fileHash);

  if (item.sourceText != null && item.sha256) {
    const textHash = crypto.createHash('sha256').update(item.sourceText).digest('hex');
    check(textHash === item.sha256, 'Clip ' + clip + ': source-text SHA-256 matches manifest.');
  } else {
    fail.push('Clip ' + clip + ': sourceText or its SHA-256 is missing from manifest.');
  }

  if (probeAvailable) {
    const probe = spawnSync(probeCommand, [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      file
    ], { encoding: 'utf8', windowsHide: true });
    const seconds = Number((probe.stdout || '').trim());
    check(probe.status === 0 && Number.isFinite(seconds) && seconds > 0.5 && seconds < 90,
      'Clip ' + clip + ': duration ' + (Number.isFinite(seconds) ? seconds.toFixed(2) : 'unreadable') + 's.');
  }
}

console.log('AZURE CANDIDATE QC');
for (const item of pass) console.log('PASS:', item);
for (const item of fail) console.error('FAIL:', item);
console.log('Result: ' + (fail.length ? 'FAIL' : 'PASS') + ' — ' + pass.length + ' checks passed, ' + fail.length + ' failed.');
if (fail.length) process.exit(1);
console.log('NOTE: Technical QC cannot assess voice quality, Arabic pronunciation, or religious accuracy. Human listening and Arabic review remain mandatory.');
