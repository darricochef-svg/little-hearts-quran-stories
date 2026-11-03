import { spawnSync } from "node:child_process";
import path from "node:path";

const root = "C:/Users/vitag/Documents/Little-Hearts-Quran-Stories";
const ffmpeg = process.env.FFMPEG_PATH || path.join(process.env.LOCALAPPDATA || "", "CapCut", "Apps", "8.5.0.3590", "ffmpeg.exe");
const audio = process.env.AUDIO_QC_FILE || path.join(root, "assets", "audio", "voiceover-variable-candidate.wav");

for (const args of [
  ["-hide_banner", "-i", audio, "-af", "silencedetect=noise=-35dB:d=0.5", "-f", "null", "NUL"],
  ["-hide_banner", "-i", audio, "-af", "volumedetect", "-f", "null", "NUL"]
]) {
  const result = spawnSync(ffmpeg, args, { encoding: "utf8", windowsHide: true });
  console.log("\nCOMMAND:", args.slice(2).join(" "));
  console.log((result.stderr || "") + (result.stdout || ""));
  if (result.error || result.status !== 0) process.exit(result.status || 1);
}
