import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const root='C:/Users/vitag/Documents/Little-Hearts-Quran-Stories';
const audioDir=path.join(root,'assets','audio');
const frameDir=path.join(root,'review','dialogue-prototype-ppm');
const reviewDir=path.join(root,'review');
const ff=path.join(process.env.LOCALAPPDATA,'CapCut','Apps','8.5.0.3590','ffmpeg.exe');
fs.mkdirSync(frameDir,{recursive:true}); fs.mkdirSync(reviewDir,{recursive:true});
function run(args,opts={}){const r=spawnSync(ff,args,{encoding:opts.encoding||'utf8',maxBuffer:20*1024*1024,windowsHide:true});if(r.error||r.status!==0)throw new Error((r.stderr||r.error||'ffmpeg failed').toString());return r;}
const clips=['voice-02a.mp3','voice-02b.mp3'];
const pcm=[];
for(let i=0;i<clips.length;i++){
 const out=path.join(frameDir,'speaker-'+i+'.raw');
 run(['-y','-v','error','-i',path.join(audioDir,clips[i]),'-ac','1','-ar','16000','-f','s16le',out]);
 pcm.push(fs.readFileSync(out));
}
const gap=Buffer.alloc(8000,0); // 0.25 sec at 16 kHz, mono s16
const allPcm=Buffer.concat([pcm[0],gap,pcm[1]]); fs.writeFileSync(path.join(frameDir,'dialogue.raw'),allPcm);
const audioWav=path.join(frameDir,'dialogue.wav');
run(['-y','-v','error','-f','s16le','-ar','16000','-ac','1','-i',path.join(frameDir,'dialogue.raw'),'-c:a','pcm_s16le',audioWav],{encoding:'utf8'});

const sr=16000, totalSamples=allPcm.length/2, duration=totalSamples/sr;
const talk=[{start:0,end:pcm[0].length/2/sr},{start:pcm[0].length/2/sr+0.25,end:duration}];
function activeAt(t,segment){
 if(t<segment.start||t>=segment.end)return 0;
 const center=Math.floor(t*sr),radius=160;let sum=0,count=0;
 for(let k=Math.max(0,center-radius);k<Math.min(totalSamples,center+radius);k++){const v=allPcm.readInt16LE(k*2);sum+=v*v;count++;}
 const rms=count?Math.sqrt(sum/count):0;
 return rms<260?0:rms<1050?1:2;
}
const W=960,H=540,fps=30,frames=Math.ceil(duration*fps);
function frame(n){
 const t=n/fps,b=Buffer.alloc(W*H*3);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*3;const sea=y>390;b[i]=sea?126:217;b[i+1]=sea?199:241;b[i+2]=sea?194:237;}
 function el(cx,cy,rx,ry,c){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx);x++){const dx=(x-cx)/rx,dy=(y-cy)/ry;if(dx*dx+dy*dy<=1){const i=(y*W+x)*3;b[i]=c[0];b[i+1]=c[1];b[i+2]=c[2];}}}
 const speaker=t<talk[0].end?0:1, mouthLevel=activeAt(t,talk[speaker]), speaking=mouthLevel>0, listening=speaker===0?1:0;
 const bob=Math.round(Math.sin(t*4)*4);
 // Nour, left: speech-driven mouth only while her own clip is active.
 const nx=270,ny=345+bob;
 el(nx,ny+35,66,80,[255,247,231]);el(nx-30,ny-65,16,62,[255,247,231]);el(nx+30,ny-70,16,67,[255,247,231]);el(nx,ny-5,58,52,[255,247,231]);
 const blink=(Math.sin(t*2.4+0.7)>0.992); if(blink){el(nx-20,ny-15,6,2,[40,40,40]);el(nx+20,ny-15,6,2,[40,40,40]);}else{el(nx-20,ny-15,5,6,[40,40,40]);el(nx+20,ny-15,5,6,[40,40,40]);}
 if(speaker===1&&speaking)el(nx,ny+12,7+mouthLevel*2,4+mouthLevel*5,[120,65,60]);else el(nx,ny+15,9,2,[120,65,60]);
 // Zuzu, right. Beak opens only during her own clip.
 const bx=650,by=350+Math.round(Math.sin(t*3.5)*4);
 el(bx,by+20,48,54,[255,211,95]);el(bx,by-35,38,38,[255,211,95]);el(bx+40,by-30,14,8,[242,151,96]);if(Math.sin(t*2.1+1.2)>0.994)el(bx-12,by-42,6,2,[40,40,40]);else el(bx-12,by-42,5,5,[40,40,40]);
 if(speaker===0&&speaking)el(bx+39,by-17,8+mouthLevel*2,3+mouthLevel*3,[188,92,65]);else el(bx+40,by-18,9,3,[188,92,65]);
 // Listener reacts with a small wing/ear movement.
 if(listening===1)el(bx-30,by+8,22,12,[239,174,66]);else el(nx+55,ny-65,9,22,[246,229,202]);
 const head=Buffer.from('P6\n'+W+' '+H+'\n255\n','ascii');
 fs.writeFileSync(path.join(frameDir,'frame-'+String(n).padStart(4,'0')+'.ppm'),Buffer.concat([head,b]));
}
for(let n=0;n<frames;n++)frame(n);
const video=path.join(root,'renders','dialogue-animation-prototype.mp4');
run(['-y','-hide_banner','-loglevel','warning','-framerate',String(fps),'-i',path.join(frameDir,'frame-%04d.ppm'),'-i',audioWav,'-shortest','-pix_fmt','yuv420p','-c:v','mpeg4','-q:v','3','-c:a','aac','-b:a','128k','-movflags','+faststart',video]);
const srt=path.join(root,'review','dialogue-animation-prototype.srt');
const fmt=s=>{const ms=Math.round(s*1000),h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),sec=Math.floor(ms%60000/1000),milli=ms%1000;return [h,m,sec].map(v=>String(v).padStart(2,'0')).join(':')+','+String(milli).padStart(3,'0');};
const end0=talk[0].end,end1=talk[1].end;
fs.writeFileSync(srt,'1\n'+fmt(0)+' --> '+fmt(end0)+'\nانظري يا نور! كم هي جميلة الأسماك!\n\n2\n'+fmt(end0+0.25)+' --> '+fmt(end1)+'\nواو! ما أجمل البحر!\n');
const report='# Talking-character dialogue prototype\n\n- Render: `renders/dialogue-animation-prototype.mp4`\n- Audio: original Arabic clips 02a and 02b, separated by 250 ms.\n- Character assignment: Zuzu speaks first; Nour answers second.\n- Mouth movement: driven by short-window PCM energy from the corresponding speaker clip, rather than a fixed periodic loop.\n- Listener: the non-speaking character receives a simple reaction movement.\n- Frame rate: 30 fps; raster animation; embedded AAC audio.\n\n## Limitations\n- Both clips still use the same TTS voice; distinct character voices are not solved.\n- Amplitude-based mouth timing is a prototype, not phoneme/viseme lip-sync. Arabic phoneme alignment and expressive facial animation remain future work.\n- Artwork remains a simple engineering placeholder, not final channel-quality character design.\n- Human review of pronunciation, religious accuracy, timing and visual quality is still required.\n';
fs.writeFileSync(path.join(reviewDir,'DIALOGUE-ANIMATION-PROTOTYPE.md'),report);
console.log(JSON.stringify({video,audioWav,srt,duration,frames,clipDurations:talk.map(x=>x.end-x.start)},null,2));
