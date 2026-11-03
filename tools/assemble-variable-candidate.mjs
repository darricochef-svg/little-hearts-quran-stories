import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
const root = "C:/Users/vitag/Documents/Little-Hearts-Quran-Stories";
const dir = path.join(root,"assets","audio");
const renderDir = path.join(root,"renders");
const ffmpeg = path.join(process.env.LOCALAPPDATA,"CapCut","Apps","8.5.0.3590","ffmpeg.exe");
const clips = [1,2,3,4,5,6].map(n=>path.join(dir,"scene-audio-measure-"+n+".wav"));
const output = path.join(dir,"voiceover-variable-candidate.wav");
const args = ["-y","-hide_banner","-loglevel","warning"];
for (const f of clips) args.push("-i",f);
args.push("-filter_complex","[0:a][1:a][2:a][3:a][4:a][5:a]concat=n=6:v=0:a=1[out]","-map","[out]","-ar","44100","-ac","1","-c:a","pcm_s16le",output);
const r=spawnSync(ffmpeg,args,{stdio:"inherit",windowsHide:true});
if(r.error||r.status!==0) process.exit(r.status||1);

// Subtitle blocks are aligned to measured scene-audio durations; modest 0.15s gaps avoid overlap.
const durations=[5.86,6.84,13.58,14.58,6.50,15.52];
const src=fs.readFileSync(path.join(root,"episode-01-yunus","subtitles.srt"),"utf8").trim();
const blocks=src.split(/\r?\n\s*\r?\n/).map(b=>b.split(/\r?\n/).slice(2).join("\n"));
const fmt=t=>{const ms=Math.round(t*1000);const h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000),z=ms%1000;return String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")+","+String(z).padStart(3,"0");};
let t=0;
const srt=durations.map((d,i)=>{const start=t;const end=t+d;t=end+0.05;return (i+1)+"\n"+fmt(start)+ " --> "+fmt(end)+"\n"+(blocks[i]||"");}).join("\n\n")+"\n";
const srtPath=path.join(root,"episode-01-yunus","subtitles-variable-candidate.srt");
fs.writeFileSync(srtPath,srt,"utf8");
console.log("Candidate audio:",output);
console.log("Candidate subtitles:",srtPath);
console.log("Approx. combined narration duration:",durations.reduce((a,b)=>a+b,0).toFixed(2),"seconds; verify with human listening before use.");
