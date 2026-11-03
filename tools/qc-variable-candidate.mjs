import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ffmpeg = process.env.FFMPEG_PATH || path.join(process.env.LOCALAPPDATA || "", "CapCut", "Apps", "8.5.0.3590", "ffmpeg.exe");
const video = path.join(root, "renders", "episode-01-yunus-variable-candidate.mp4");
const audio = path.join(root, "assets", "audio", "voiceover-variable-candidate.wav");
const srt = path.join(root, "episode-01-yunus", "subtitles-variable-candidate.srt");

for (const file of [video, audio, srt]) {
  if (!fs.existsSync(file)) throw new Error("Missing: " + file);
}

const stat = fs.statSync(video);
const probe = spawnSync(ffmpeg, ["-hide_banner", "-i", video, "-f", "null", "NUL"], {
  encoding: "utf8",
  windowsHide: true
});
const log = (probe.stderr || "") + (probe.stdout || "");
const details = log.split(/\r?\n/).filter(line => /Duration:|Video:|Audio:|Subtitle:/.test(line));
const ok = probe.status === 0 && stat.size > 1_000_000 &&
  /Video:/.test(log) && /Audio:/.test(log) && /Subtitle:/.test(log);

const report = [
  "# Variable-Duration Candidate — Technical QC",
  "",
  "- Result: " + (ok ? "PASS" : "FAIL"),
  "- File: renders/episode-01-yunus-variable-candidate.mp4",
  "- Size: " + (stat.size / 1_048_576).toFixed(2) + " MiB",
  "- Candidate audio: assets/audio/voiceover-variable-candidate.wav",
  "- Candidate subtitles: episode-01-yunus/subtitles-variable-candidate.srt",
  "- Checks: file exists; size above 1 MB; FFmpeg can decode full file; video, audio and subtitle streams detected.",
  "",
  "## Stream details",
  ...details.map(line => "- " + line.trim()),
  "",
  "## Release status",
  "",
  "NOT APPROVED. This is a technical candidate only. Full human listening, Arabic pronunciation review, subtitle readability review, visual review and qualified religious review remain required. No upload or public channel changes were made.",
  ""
].join("\n");

const output = path.join(root, "review", "QC-VARIABLE-CANDIDATE.md");
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, report, "utf8");
console.log(report);
if (!ok) process.exit(1);
