import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sceneDir = path.join(root, "assets", "scenes");
const audio = path.join(root, "assets", "audio", "voiceover-variable-candidate.wav");
const subtitles = path.join(root, "episode-01-yunus", "subtitles-variable-candidate.srt");
const output = path.join(root, "renders", "episode-01-yunus-variable-candidate-compressed.mp4");
const durations = [5.86, 6.84, 13.58, 14.58, 6.50, 15.52];
const fps = 30;
const scenes = fs.readdirSync(sceneDir).filter(file => /\.(png|jpe?g|webp|ppm)$/i.test(file))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map(file => path.join(sceneDir, file));

if (scenes.length !== 6) throw new Error("Expected exactly six scene images; found " + scenes.length);
if (!fs.existsSync(audio) || !fs.existsSync(subtitles)) throw new Error("Candidate audio or subtitles missing.");

const ffmpeg = process.env.FFMPEG_PATH || path.join(process.env.LOCALAPPDATA || "", "CapCut", "Apps", "8.5.0.3590", "ffmpeg.exe");
if (!fs.existsSync(ffmpeg)) throw new Error("FFmpeg executable missing: " + ffmpeg);
const encoderResult = spawnSync(ffmpeg, ["-hide_banner", "-encoders"], { encoding: "utf8", windowsHide: true });
const encoders = (encoderResult.stdout || "") + (encoderResult.stderr || "");
const videoCodec = encoders.includes("h264_amf") ? "h264_amf" : encoders.includes("libx264") ? "libx264" : "mpeg4";

const args = ["-y", "-hide_banner", "-loglevel", "warning"];
scenes.forEach((scene, index) => args.push("-loop", "1", "-framerate", String(fps), "-t", String(durations[index]), "-i", scene));
const audioIndex = scenes.length;
args.push("-i", audio);
const subtitleIndex = scenes.length + 1;
args.push("-i", subtitles);

const filters = [];
scenes.forEach((_, index) => {
  const zoomStep = (0.065 / (durations[index] * fps)).toFixed(8);
  filters.push(`[${index}:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+${zoomStep},1.065)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=${fps},format=yuv420p[v${index}]`);
});
filters.push(scenes.map((_, index) => `[v${index}]`).join("") + "concat=n=6:v=1:a=0[vout]");

args.push("-filter_complex", filters.join(";"), "-map", "[vout]", "-map", audioIndex + ":a:0", "-map", subtitleIndex + ":0");
if (videoCodec === "h264_amf") args.push("-c:v", "h264_amf", "-quality", "balanced", "-rc", "cbr", "-b:v", "4M", "-maxrate", "4M", "-bufsize", "8M", "-enforce_hrd", "true");
else if (videoCodec === "libx264") args.push("-c:v", "libx264", "-preset", "medium", "-crf", "20");
else args.push("-c:v", "mpeg4", "-b:v", "4M");
args.push("-c:a", "aac", "-b:a", "192k", "-c:s", "mov_text", "-movflags", "+faststart", output);

console.log("Rendering 62.88-second compressed candidate with", videoCodec, "; zoompan emits one output frame per input frame.");
const result = spawnSync(ffmpeg, args, { stdio: "inherit", windowsHide: true });
if (result.error || result.status !== 0) process.exit(result.status || 1);
console.log("Candidate:", output);
