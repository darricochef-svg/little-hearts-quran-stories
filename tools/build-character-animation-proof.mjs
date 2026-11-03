import fs from "node:fs"; import path from "node:path"; import {spawnSync} from "node:child_process";
const root="C:/Users/vitag/Documents/Little-Hearts-Quran-Stories", dir=path.join(root,"review","character-animation-ppm"); fs.mkdirSync(dir,{recursive:true});
const W=960,H=540;
function frame(n){const b=Buffer.alloc(W*H*3);
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*3;const sea=y>390; b[i]=sea?126:217;b[i+1]=sea?199:241;b[i+2]=sea?194:237;}
function el(cx,cy,rx,ry,c){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx);x++){const dx=(x-cx)/rx,dy=(y-cy)/ry;if(dx*dx+dy*dy<=1){const i=(y*W+x)*3;b[i]=c[0];b[i+1]=c[1];b[i+2]=c[2];}}}
const t=n/30, bob=Math.round(Math.abs(Math.sin(t*3))*8), x=Math.round(230+Math.sin(t*1.7)*35);
el(780,100,54,54,[255,226,160]); el(x,380-bob,58,66,[255,247,231]); el(x-24,270-bob,14,55,[255,247,231]);el(x+24,265-bob,14,60,[255,247,231]);el(x,330-bob,49,45,[255,247,231]);
el(x-17,322-bob,5,6,[40,40,40]);el(x+17,322-bob,5,6,[40,40,40]);
if(n%12<6)el(x,347-bob,7,10,[120,65,60]);else{el(x,350-bob,8,2,[120,65,60]);}
const bx=610,by=350+Math.round(Math.sin(t*3)*9);el(bx,by+18,42,49,[255,211,95]);el(bx,by-25,34,34,[255,211,95]);el(bx+37,by-22,12,7,[242,151,96]);el(bx-12,by-32,5,5,[40,40,40]);
if(n%16<8)el(bx+8,by-1,5,7,[120,65,60]);else el(bx+8,by-1,6,2,[120,65,60]);
// Flapping wing: alternate wing ellipse position and size.
el(bx-27,by+8+(n%10<5?-14:10),20,10,[239,174,66]);
const header=Buffer.from("P6\n"+W+" "+H+"\n255\n","ascii");fs.writeFileSync(path.join(dir,"frame-"+String(n).padStart(4,"0")+".ppm"),Buffer.concat([header,b]));}
for(let n=0;n<90;n++)frame(n);
const ff=path.join(process.env.LOCALAPPDATA,"CapCut","Apps","8.5.0.3590","ffmpeg.exe"),out=path.join(root,"renders","character-animation-proof.mp4");
const r=spawnSync(ff,["-y","-hide_banner","-loglevel","warning","-framerate","30","-i",path.join(dir,"frame-%04d.ppm"),"-t","3","-pix_fmt","yuv420p","-c:v","mpeg4","-q:v","3",out],{stdio:"inherit",windowsHide:true});
if(r.error||r.status!==0)process.exit(r.status||1);console.log("Raster character animation proof rendered:",out);