import { spawnSync } from "node:child_process";
import path from "node:path";
const root = "C:/Users/vitag/Documents/Little-Hearts-Quran-Stories";
const ffmpeg = path.join(process.env.LOCALAPPDATA, "CapCut", "Apps", "8.5.0.3590", "ffmpeg.exe");
const audio = path.join(root, "assets", "audio", "voiceover-tightened-v2.wav");
for (const args of [
  ["-hide_banner", "-i", audio, "-af", "silencedetect=noise=-35dB:d=0.5", "-f", "null", "NUL"],
  ["-hide_banner", "-i", audio, "-af", "volumedetect", "-f", "null", "NUL"]
]) {
 const r = spawnSync(ffmpeg, args, {encoding:"utf8", windowsHide:true});
 console.log("\nCOMMAND:", args.slice(2).join(" "));
 console.log((r.stderr || "") + (r.stdout || ""));
 if (r.error || r.status !== 0) process.exit(r.status || 1);
}
