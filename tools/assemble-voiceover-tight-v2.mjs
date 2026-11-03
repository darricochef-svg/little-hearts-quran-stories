import { spawnSync } from "node:child_process";
import path from "node:path";

const root = "C:/Users/vitag/Documents/Little-Hearts-Quran-Stories";
const dir = path.join(root, "assets", "audio");
const ids = ["01", "02a", "02b", "03", "04a", "04b", "05", "06a", "06b", "06c"];
const groups = [[0], [1, 2], [3], [4, 5], [6], [7, 8, 9]];
const ffmpeg = path.join(process.env.LOCALAPPDATA, "CapCut", "Apps", "8.5.0.3590", "ffmpeg.exe");
const output = path.join(dir, "voiceover-tightened-v2.wav");
const args = ["-y", "-hide_banner", "-loglevel", "warning"];
for (const id of ids) args.push("-i", path.join(dir, "voice-" + id + ".mp3"));

const filters = [];
groups.forEach((group, i) => {
  const joined = group.map(n => "[" + n + ":a]").join("") +
    "concat=n=" + group.length + ":v=0:a=1";
  // Reverse only this scene's joined narration so silence removal trims its END,
  // then reverse it back. Internal pauses and the original source clips remain intact.
  filters.push(
    joined +
    ",areverse," +
    "silenceremove=start_periods=1:start_duration=0.05:start_threshold=-40dB:start_silence=0.05," +
    "areverse,apad=whole_dur=12,atrim=duration=12[s" + i + "]"
  );
});
filters.push("[s0][s1][s2][s3][s4][s5]concat=n=6:v=0:a=1[out]");
args.push("-filter_complex", filters.join(";"), "-map", "[out]",
  "-ar", "44100", "-ac", "1", "-c:a", "pcm_s16le", output);

console.log("Creating separate candidate: trims trailing silence per scene only; original voiceover.wav is untouched.");
const result = spawnSync(ffmpeg, args, { stdio: "inherit", windowsHide: true });
if (result.error || result.status !== 0) {
  console.error("Candidate assembly failed; original audio remains untouched.");
  process.exit(result.status || 1);
}
console.log("Candidate created:", output);
