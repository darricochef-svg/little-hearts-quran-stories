import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srtPath = path.join(root, "episode-01-yunus", "subtitles-variable-candidate.srt");
const source = fs.readFileSync(srtPath, "utf8").replace(/^\uFEFF/, "").trim();
const blocks = source.split(/\r?\n\s*\r?\n/);
const failures = [];
const parsed = [];

function timestampToMs(value) {
  const match = /^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/.exec(value);
  if (!match) return null;
  const [, hh, mm, ss, ms] = match.map(Number);
  if (mm > 59 || ss > 59) return null;
  return (((hh * 60 + mm) * 60 + ss) * 1000) + ms;
}

for (let i = 0; i < blocks.length; i += 1) {
  const lines = blocks[i].split(/\r?\n/);
  const expectedIndex = String(i + 1);
  if (lines[0]?.trim() !== expectedIndex) {
    failures.push(`Cue ${i + 1}: expected sequential index ${expectedIndex}`);
    continue;
  }
  const timing = /^(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})$/.exec(lines[1]?.trim() ?? "");
  if (!timing) {
    failures.push(`Cue ${i + 1}: invalid SRT timestamp line`);
    continue;
  }
  const startMs = timestampToMs(timing[1]);
  const endMs = timestampToMs(timing[2]);
  const text = lines.slice(2).join("\n").trim();
  if (startMs === null || endMs === null || endMs <= startMs) {
    failures.push(`Cue ${i + 1}: invalid or non-positive time range`);
    continue;
  }
  if (!text) failures.push(`Cue ${i + 1}: empty subtitle text`);
  if (!/[\u0600-\u06FF]/u.test(text)) failures.push(`Cue ${i + 1}: Arabic text missing`);
  if (!/[A-Za-z]/u.test(text)) failures.push(`Cue ${i + 1}: English text missing`);
  parsed.push({ index: i + 1, startMs, endMs });
}

if (parsed.length !== 6) failures.push(`Expected 6 subtitle cues; parsed ${parsed.length}`);
for (let i = 1; i < parsed.length; i += 1) {
  if (parsed[i].startMs < parsed[i - 1].endMs) {
    failures.push(`Cue ${parsed[i].index}: overlaps cue ${parsed[i - 1].index}`);
  }
  if (parsed[i].startMs < parsed[i - 1].startMs) {
    failures.push(`Cue ${parsed[i].index}: starts before previous cue`);
  }
}
if (parsed.length === 6 && parsed[5].endMs !== 63130) {
  failures.push(`Final cue must end at 00:01:03,130 for the current 63.13s candidate; got ${parsed[5].endMs}ms`);
}

if (failures.length) {
  console.error("SUBTITLE VALIDATION FAILED");
  for (const failure of failures) console.error("- " + failure);
  process.exit(1);
}

console.log("SUBTITLE VALIDATION PASSED");
console.log("- 6 sequential cues");
console.log("- All cues contain Arabic and English text");
console.log("- All timestamps are valid and durations positive");
console.log("- No cue overlap");
console.log("- Final cue ends at 63.13 seconds");
