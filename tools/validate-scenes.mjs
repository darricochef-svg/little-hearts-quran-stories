import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'assets', 'scenes');
const errors = [], pass = [];
for (let i = 1; i <= 6; i++) {
  const name = 'scene-' + String(i).padStart(2, '0') + '.ppm';
  const file = path.join(dir, name);
  if (!fs.existsSync(file)) { errors.push(name + ': missing'); continue; }
  const bytes = fs.readFileSync(file);
  const header = bytes.subarray(0, 128).toString('ascii');
  const match = header.match(/^P6\s+(?:#[^\r\n]*\s+)*(\d+)\s+(\d+)\s+255\s/);
  if (!match) { errors.push(name + ': invalid binary PPM header'); continue; }
  const width = Number(match[1]), height = Number(match[2]);
  const headerBytes = Buffer.byteLength(match[0], 'ascii');
  const payloadBytes = bytes.length - headerBytes;
  if (width !== 960 || height !== 540) errors.push(name + ': expected 960x540, found ' + width + 'x' + height);
  else if (payloadBytes !== width * height * 3) errors.push(name + ': incorrect RGB payload length');
  else pass.push(name + ': valid 960x540 RGB PPM');
}
for (const name of ['scene-03.svg', 'scene-04.svg', 'scene-05.svg']) {
  const file = path.join(dir, name);
  if (!fs.existsSync(file)) { errors.push(name + ': missing SVG preview'); continue; }
  const svg = fs.readFileSync(file, 'utf8');
  if (/<text\b|whale|swallow|prophet/i.test(svg)) errors.push(name + ': stale text or event depiction in SVG preview');
  else pass.push(name + ': neutral SVG preview');
}
console.log('SCENE ASSET QC');
for (const item of pass) console.log('PASS:', item);
for (const item of errors) console.error('FAIL:', item);
console.log('Result: ' + (errors.length ? 'FAIL' : 'PASS') + ' — ' + pass.length + ' passed, ' + errors.length + ' failed.');
if (errors.length) process.exit(1);
console.log('Technical validation only; human religious, child-suitability and visual review remains mandatory.');
