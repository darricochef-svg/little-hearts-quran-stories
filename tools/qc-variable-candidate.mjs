import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ffmpeg = process.env.FFMPEG_PATH || path.join(process.env.LOCALAPPDATA || "", "CapCut", "Apps", "8.5.0.3590", "ffmpeg.exe");
const video = path.join(root, "renders", "episode-01-yunus-variable-candidate-compressed.mp4");
const audio = path.join(root, "assets", "audio", "voiceover-variable-candidate.wav");
const subtitles = path.join(root, "episode-01-yunus", "subtitles-variable-candidate.srt");
for (const file of [video, audio, subtitles]) if (!fs.existsSync(file)) throw new Error("Missing: " + file);

const stat = fs.statSync(video);
const maxBytes = 500 * 1024 * 1024;
let probeLog = "";
let decoded = false;
if (stat.size <= maxBytes) {
  const probe = spawnSync(ffmpeg, ["-hide_banner", "-i", video, "-f", "null", "NUL"], { encoding: "utf8", windowsHide: true });
  probeLog = (probe.stderr || "") + (probe.stdout || "");
  decoded = probe.status === 0;
}
const details = probeLog.split(/\r?\n/).filter(line => /Duration:|Video:|Audio:|Subtitle:/.test(line));
const checks = [
  ["Video file exists", true],
  ["Video size <= 500 MB", stat.size <= maxBytes],
  ["FFmpeg full decode", decoded],
  ["Video stream", /Video:/.test(probeLog)],
  ["Audio stream", /Audio:/.test(probeLog)],
  ["Subtitle stream", /Subtitle:/.test(probeLog)]
];
const ok = checks.every(([, pass]) => pass);
const report = [
  "# Variable-Duration Candidate — Technical QC",
  "",
  ...checks.map(([name, pass]) => "- " + (pass ? "PASS" : "FAIL") + " — " + name),
  "- File size: " + (stat.size / 1048576).toFixed(2) + " MiB",
  "",
  "## Stream details",
  ...details.map(line => "- " + line.trim()),
  "",
  "## Release status",
  "",
  "NOT APPROVED. Technical checks do not establish correct Arabic pronunciation, subtitle quality, religious accuracy, child suitability, or final visual approval. No upload or public channel changes were made.",
  ""
].join("\n");
const output = path.join(root, "review", "QC-VARIABLE-CANDIDATE.md");
fs.writeFileSync(output, report, "utf8");
console.log(report);
if (!ok) process.exit(1);
