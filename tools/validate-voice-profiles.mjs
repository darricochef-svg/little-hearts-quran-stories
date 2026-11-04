import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'brand', 'voice-profiles.json');

let data;
try {
  data = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (error) {
  console.error('VOICE PROFILE CHECK: NOT READY');
  console.error('Unable to read brand/voice-profiles.json:', error.message);
  process.exit(2);
}

const errors = [];
if (!Array.isArray(data.profiles)) errors.push('profiles must be an array.');
for (const required of ['narrator', 'nour', 'zuzu']) {
  const p = Array.isArray(data.profiles) ? data.profiles.find(x => x.id === required) : null;
  if (!p) errors.push('Missing profile: ' + required);
  else {
    if (typeof p.locale !== 'string' || !p.locale.toLowerCase().startsWith('ar-')) errors.push(required + ' must use a regional Arabic locale such as ar-SA.');
    if (!p.provider) errors.push(required + ' has no configured provider.');
    if (!p.voiceId) errors.push(required + ' has no verified provider voice ID.');
  }
}
const configured = Array.isArray(data.profiles) ? data.profiles.filter(p => p.provider && p.voiceId) : [];
const ids = configured.map(p => p.provider + ':' + p.voiceId);
if (new Set(ids).size !== ids.length) errors.push('Two character profiles share the same provider voice ID.');
for (const [clip, profile] of Object.entries(data.clipAssignments || {})) {
  if (!data.profiles.some(p => p.id === profile)) errors.push('Clip ' + clip + ' maps to missing profile ' + profile + '.');
}
if (errors.length) {
  console.log('VOICE PROFILE CHECK: NOT READY');
  for (const error of errors) console.log('- ' + error);
  process.exitCode = 2;
} else {
  console.log('VOICE PROFILE CHECK: PASS — all profiles configured with distinct Arabic voices.');
}
