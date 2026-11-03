import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sceneDir = path.join(root, "assets", "scenes");
const audioDir = path.join(root, "assets", "audio");
const renderDir = path.join(root, "renders");
const output = path.join(renderDir, "episode-01-yunus-draft.mp4");
const audio = path.join(audioDir, "voiceover.wav");
const subtitles = path.join(root, "episode-01-yunus", "subtitles.srt");
const duration = Number(process.env.SCENE_SECONDS || 12);

if (!Number.isFinite(duration) || duration < 2 || duration > 20) {
  console.error("SCENE_SECONDS must be between 2 and 20.");
  process.exit(1);
}
const scenes = fs.readdirSync(sceneDir)
  .filter(f => /\.(png|jpe?g|webp|ppm)$/i.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map(f => path.join(sceneDir, f));
if (scenes.length < 2) {
  console.error("Add at least 2 scene images to assets/scenes (for example scene-01.png, scene-02.png).");
  process.exit(1);
}
function resolveFfmpeg() {
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) return process.env.FFMPEG_PATH;
  const pathCheck = spawnSync("ffmpeg", ["-version"], { encoding: "utf8", windowsHide: true });
  if (!pathCheck.error && pathCheck.status === 0) return "ffmpeg";
  const capcutApps = path.join(process.env.LOCALAPPDATA || "", "CapCut", "Apps");
  try {
    const candidates = fs.readdirSync(capcutApps, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => path.join(capcutApps, entry.name, "ffmpeg.exe"))
      .filter(candidate => fs.existsSync(candidate));
    candidates.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
    if (candidates.length) return candidates[0];
  } catch {}
  return "ffmpeg";
}
const ffmpegPath = resolveFfmpeg();
const check = spawnSync(ffmpegPath, ["-version"], { encoding: "utf8", windowsHide: true });
if (check.error || check.status !== 0) {
  console.error("FFmpeg was not found. Install it or set FFMPEG_PATH to a working ffmpeg.exe.");
  process.exit(1);
}
const encoderCheck = spawnSync(ffmpegPath, ["-hide_banner", "-encoders"], { encoding: "utf8", windowsHide: true });
const encoderList = (encoderCheck.stdout || "") + (encoderCheck.stderr || "");
const videoCodec = encoderList.includes("libx264") ? "libx264" : "mpeg4";
fs.mkdirSync(renderDir, { recursive: true });
const listPath = path.join(renderDir, "scenes.concat.txt");
const safe = p => p.replace(/\\/g, "/").replace(/'/g, "'\\''");
const lines = [];
for (const scene of scenes) {
  lines.push("file '" + safe(scene) + "'");
  lines.push("duration " + duration);
}
lines.push("file '" + safe(scenes[scenes.length - 1]) + "'");
fs.writeFileSync(listPath, lines.join("\n") + "\n", "utf8");

const args = [
  "-y", "-hide_banner", "-loglevel", "warning",
  "-f", "concat", "-safe", "0", "-i", listPath
];
const hasAudio = fs.existsSync(audio);
const hasSubtitles = fs.existsSync(subtitles);
if (hasAudio) args.push("-i", audio);
if (hasSubtitles) args.push("-i", subtitles);
args.push(
  "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black,fps=30,format=yuv420p",
  ...(videoCodec === "libx264" ? ["-c:v", "libx264", "-preset", "medium", "-crf", "20"] : ["-c:v", "mpeg4", "-q:v", "3"])
);
args.push("-map", "0:v:0");
if (hasAudio) args.push("-map", "1:a:0", "-c:a", "aac", "-b:a", "192k", "-shortest");
else args.push("-an");
if (hasSubtitles) args.push("-map", hasAudio ? "2:0" : "1:0", "-c:s", "mov_text");
args.push("-movflags", "+faststart", output);
console.log("Scenes:", scenes.length);
console.log("Voiceover:", hasAudio ? "found" : "not found (silent draft)");
console.log("Subtitles:", hasSubtitles ? "found" : "not found");
const result = spawnSync(ffmpegPath, args, { stdio: "inherit", windowsHide: true });
if (result.error || result.status !== 0) {
  console.error("Render failed. Review FFmpeg output above; source assets were not changed.");
  process.exit(result.status || 1);
}
console.log("Draft rendered:", output);
