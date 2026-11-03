import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sceneDir = path.join(root, "assets", "scenes");
const audio = path.join(root, "assets", "audio", "voiceover.wav");
const subtitles = path.join(root, "episode-01-yunus", "subtitles.srt");
const renderDir = path.join(root, "renders");
const output = path.join(renderDir, "episode-01-yunus-animated-test.mp4");
const duration = Number(process.env.SCENE_SECONDS || 12);
const fps = 30;

if (!Number.isFinite(duration) || duration < 2 || duration > 20) {
  console.error("SCENE_SECONDS must be between 2 and 20.");
  process.exit(1);
}
const scenes = fs.readdirSync(sceneDir)
  .filter(f => /\.(png|jpe?g|webp|ppm)$/i.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map(f => path.join(sceneDir, f));
if (scenes.length < 2) {
  console.error("Need at least 2 supported scene images.");
  process.exit(1);
}
function resolveFfmpeg() {
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) return process.env.FFMPEG_PATH;
  const pathCheck = spawnSync("ffmpeg", ["-version"], { encoding: "utf8", windowsHide: true });
  if (!pathCheck.error && pathCheck.status === 0) return "ffmpeg";
  const capcutApps = path.join(process.env.LOCALAPPDATA || "", "CapCut", "Apps");
  try {
    const candidates = fs.readdirSync(capcutApps, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => path.join(capcutApps, e.name, "ffmpeg.exe"))
      .filter(p => fs.existsSync(p));
    candidates.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
    if (candidates.length) return candidates[0];
  } catch {}
  return "ffmpeg";
}
const ffmpeg = resolveFfmpeg();
const ver = spawnSync(ffmpeg, ["-version"], { encoding: "utf8", windowsHide: true });
if (ver.error || ver.status !== 0) {
  console.error("FFmpeg not found.");
  process.exit(1);
}
const enc = spawnSync(ffmpeg, ["-hide_banner", "-encoders"], { encoding: "utf8", windowsHide: true });
const encoders = (enc.stdout || "") + (enc.stderr || "");
const codec = encoders.includes("libx264") ? "libx264" : "mpeg4";
fs.mkdirSync(renderDir, { recursive: true });
const args = ["-y", "-hide_banner", "-loglevel", "warning"];
for (const scene of scenes) args.push("-loop", "1", "-framerate", String(fps), "-t", String(duration), "-i", scene);
const audioIndex = scenes.length;
const hasAudio = fs.existsSync(audio);
const hasSubs = fs.existsSync(subtitles);
if (hasAudio) args.push("-i", audio);
if (hasSubs) args.push("-i", subtitles);

const filters = [];
for (let i = 0; i < scenes.length; i++) {
  const frames = Math.round(duration * fps);
  // Slow, subtle Ken Burns push-in; each scene remains a separate generated stream.
  filters.push(`[${i}:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.00018,1.065)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=${fps},format=yuv420p[v${i}]`);
}
filters.push(scenes.map((_, i) => `[v${i}]`).join("") + `concat=n=${scenes.length}:v=1:a=0[vout]`);
args.push("-filter_complex", filters.join(";"), "-map", "[vout]");
if (hasAudio) args.push("-map", `${audioIndex}:a:0`, "-c:a", "aac", "-b:a", "192k", "-shortest");
else args.push("-an");
if (hasSubs) args.push("-map", `${audioIndex + (hasAudio ? 1 : 0)}:0`, "-c:s", "mov_text");
args.push(...(codec === "libx264" ? ["-c:v", "libx264", "-preset", "medium", "-crf", "20"] : ["-c:v", "mpeg4", "-q:v", "3"]), "-movflags", "+faststart", output);
console.log("Experimental animated render");
console.log("Scenes:", scenes.length, "| duration per scene:", duration, "sec | slow zoom: enabled");
console.log("Audio:", hasAudio ? "included" : "not found", "| subtitles:", hasSubs ? "included" : "not found");
const result = spawnSync(ffmpeg, args, { stdio: "inherit", windowsHide: true });
if (result.error || result.status !== 0) {
  console.error("Animated test render failed. The existing draft was not modified.");
  process.exit(result.status || 1);
}
console.log("Animated test rendered:", output);
