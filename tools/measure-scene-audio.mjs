import { spawnSync } from "node:child_process";
import path from "node:path";
const root = "C:/Users/vitag/Documents/Little-Hearts-Quran-Stories";
const dir = path.join(root, "assets", "audio");
const ids = ["01", "02a", "02b", "03", "04a", "04b", "05", "06a", "06b", "06c"];
const groups = [[0], [1,2], [3], [4,5], [6], [7,8,9]];
const ffmpeg = path.join(process.env.LOCALAPPDATA, "CapCut", "Apps", "8.5.0.3590", "ffmpeg.exe");
const results = [];
for (let i=0; i<groups.length; i++) {
 const out = path.join(dir, "scene-audio-measure-" + (i+1) + ".wav");
 const args = ["-y","-hide_banner","-loglevel","error"];
 for (const n of groups[i]) args.push("-i", path.join(dir, "voice-" + ids[n] + ".mp3"));
 const labels = groups[i].map((_,n)=>"["+n+":a]").join("");
 const filter = labels + "concat=n=" + groups[i].length + ":v=0:a=1,areverse,silenceremove=start_periods=1:start_duration=0.08:start_threshold=-35dB,areverse";
 args.push("-filter_complex",filter,"-ar","44100","-ac","1","-c:a","pcm_s16le",out);
 const r = spawnSync(ffmpeg,args,{encoding:"utf8",windowsHide:true});
 if (r.error || r.status!==0) { console.error(r.stderr||r.error); process.exit(r.status||1); }
 const probe = spawnSync(ffmpeg,["-hide_banner","-i",out,"-f","null","NUL"],{encoding:"utf8",windowsHide:true});
 const m = (probe.stderr||"").match(/Duration: (\d+):(\d+):(\d+(?:\.\d+)?)/);
 const seconds = m ? Number(m[1])*3600+Number(m[2])*60+Number(m[3]) : null;
 results.push({scene:i+1,seconds,file:out});
}
console.log(JSON.stringify(results,null,2));
