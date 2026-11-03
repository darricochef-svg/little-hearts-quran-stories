import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const render = path.join(root, "renders", "episode-01-yunus-animated-test.mp4");
const wav = path.join(root, "assets", "audio", "voiceover.wav");
const sceneDir = path.join(root, "assets", "scenes");
const reportDir = path.join(root, "review");
const ffmpeg = process.env.FFMPEG_PATH ||
  path.join(process.env.LOCALAPPDATA || "", "CapCut", "Apps", "8.5.0.3590", "ffmpeg.exe");

const checks = [];
const add = (name, pass, detail) => checks.push({ name, status: pass ? "PASS" : "FAIL", detail });
const exists = p => fs.existsSync(p);
add("Rendered MP4 exists", exists(render), render);
add("Narration WAV exists", exists(wav), wav);
const sceneCount = exists(sceneDir) ? fs.readdirSync(sceneDir).filter(f => /\.(png|jpe?g|webp|ppm)$/i.test(f)).length : 0;
add("At least 2 supported scene images", sceneCount >= 2, String(sceneCount) + " scene images");
add("FFmpeg executable exists", exists(ffmpeg), ffmpeg);

let probe = "";
if (exists(render) && exists(ffmpeg)) {
  const p = spawnSync(ffmpeg, ["-hide_banner", "-i", render], { encoding: "utf8", windowsHide: true });
  probe = (p.stderr || "") + (p.stdout || "");
  const duration = Number((probe.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/) || []).slice(1).reduce((acc, n, i) => acc + Number(n) * [3600, 60, 1][i], 0));
  const hasVideo = /Stream #\d+:\d+.*Video:/.test(probe);
  const hasAudio = /Stream #\d+:\d+.*Audio:/.test(probe);
  const hasSubtitles = /Stream #\d+:\d+.*Subtitle:/.test(probe);
  add("Video stream detected", hasVideo, hasVideo ? "Video stream found" : "No video stream detected");
  add("Audio stream detected", hasAudio, hasAudio ? "Audio stream found" : "No audio stream detected");
  add("Subtitle stream detected", hasSubtitles, hasSubtitles ? "Subtitle stream found" : "No subtitle stream detected");
  add("Duration in expected range (60–90 sec)", duration >= 60 && duration <= 90, Number.isFinite(duration) ? duration.toFixed(2) + " sec" : "Duration could not be parsed");
  const stat = fs.statSync(render);
  add("Render file is non-trivial (> 1 MB)", stat.size > 1024 * 1024, (stat.size / 1024 / 1024).toFixed(2) + " MB");
} else {
  for (const name of ["Video stream detected", "Audio stream detected", "Subtitle stream detected", "Duration in expected range (60–90 sec)", "Render file is non-trivial (> 1 MB)"]) add(name, false, "Skipped: missing render or FFmpeg");
}

const allPass = checks.every(c => c.status === "PASS");
const lines = [
  "# Episode 01 — Animated Test Technical QC",
  "",
  "This report checks file/container properties only. It cannot judge story accuracy, Arabic pronunciation, child suitability, visual quality, or religious correctness.",
  "",
  "| Check | Result | Detail |",
  "|---|---|---|",
  ...checks.map(c => "| " + c.name + " | " + c.status + " | " + c.detail.replaceAll("|", "\\|") + " |"),
  "",
  "**Automated result:** " + (allPass ? "PASS — technical checks passed; human review is still required." : "FAIL — fix failed checks before relying on this render."),
  "",
  "**Release gate:** NOT APPROVED. No upload or public channel changes are performed by this script.",
  ""
];
fs.mkdirSync(reportDir, { recursive: true });
const report = path.join(reportDir, "AUTOMATED-QC-ANIMATED.md");
fs.writeFileSync(report, lines.join("\n"), "utf8");
console.log(lines.join("\n"));
console.log("\nReport written: " + report);
if (!allPass) process.exitCode = 1;
