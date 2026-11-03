import fs from "node:fs";
import path from "node:path";

const out = path.resolve("C:/Users/vitag/Documents/Little-Hearts-Quran-Stories/assets/scenes");
fs.mkdirSync(out, { recursive: true });
const W = 960, H = 540;
const scenes = [
  { sky:[194,235,239], sea:[101,190,203], land:[250,225,171], deep:[48,135,164], sun:[255,220,130], title:"A quiet shore" },
  { sky:[46,135,177], sea:[22,103,153], land:[103,203,207], deep:[12,68,119], sun:[255,218,125], title:"Beneath the waves" },
  { sky:[88,187,209], sea:[33,119,157], land:[201,233,222], deep:[27,91,130], sun:[255,231,155], title:"A great sea creature" },
  { sky:[17,43,78], sea:[25,75,113], land:[88,139,170], deep:[10,38,70], sun:[225,237,242], title:"In the deep darkness" },
  { sky:[249,218,157], sea:[63,156,179], land:[255,241,204], deep:[38,112,145], sun:[255,190,106], title:"A new morning" },
  { sky:[185,229,215], sea:[110,183,157], land:[222,238,197], deep:[55,135,127], sun:[255,224,136], title:"A peaceful garden" }
];

function make(scene, index) {
  const data = Buffer.alloc(W * H * 3);
  const mix = (a,b,t) => Math.round(a + (b-a)*t);
  for (let y=0; y<H; y++) {
    const t = y/H;
    const base = y < H*0.48 ? scene.sky : y < H*0.82 ? scene.sea : scene.land;
    const next = y < H*0.48 ? scene.sea : y < H*0.82 ? scene.deep : scene.land;
    const blend = y < H*0.48 ? t*0.14 : y < H*0.82 ? (t-0.48)*0.28 : 0;
    for (let x=0; x<W; x++) {
      const i=(y*W+x)*3;
      data[i]=mix(base[0],next[0],blend);
      data[i+1]=mix(base[1],next[1],blend);
      data[i+2]=mix(base[2],next[2],blend);
    }
  }
  function ellipse(cx,cy,rx,ry,c) {
    for(let y=Math.max(0,Math.floor(cy-ry));y<Math.min(H,Math.ceil(cy+ry));y++)
      for(let x=Math.max(0,Math.floor(cx-rx));x<Math.min(W,Math.ceil(cx+rx));x++) {
        const dx=(x-cx)/rx, dy=(y-cy)/ry;
        if(dx*dx+dy*dy<=1) { const i=(y*W+x)*3; data[i]=c[0];data[i+1]=c[1];data[i+2]=c[2]; }
      }
  }
  function rect(x0,y0,x1,y1,c) {
    for(let y=Math.max(0,y0);y<Math.min(H,y1);y++) for(let x=Math.max(0,x0);x<Math.min(W,x1);x++) {
      const i=(y*W+x)*3;data[i]=c[0];data[i+1]=c[1];data[i+2]=c[2];
    }
  }
  function line(x0,y0,x1,y1,thick,c) {
    const steps=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));
    for(let k=0;k<=steps;k++){const t=steps?k/steps:0;ellipse(Math.round(x0+(x1-x0)*t),Math.round(y0+(y1-y0)*t),thick,thick,c);}
  }
  function fish(x,y,s,c) {
    ellipse(x,y,26*s,15*s,c);
    ellipse(x+25*s,y,11*s,14*s,c);
    ellipse(x-10*s,y-4*s,3*s,3*s,[255,255,244]);
    ellipse(x-10*s,y-4*s,1.5*s,1.5*s,[35,48,56]);
    line(x-1*s,y-9*s,x+7*s,y+8*s,1.5*s,[255,232,168]);
  }
  function rabbit(x,y,s) {
    const fur=[255,247,231], shade=[229,212,185], ink=[66,65,63], pink=[242,164,157];
    ellipse(x,y+52*s,43*s,50*s,fur);
    ellipse(x-14*s,y-8*s,12*s,42*s,fur);
    ellipse(x+15*s,y-12*s,12*s,45*s,fur);
    ellipse(x+15*s,y-11*s,5*s,32*s,shade);
    ellipse(x,y+4*s,37*s,36*s,fur);
    ellipse(x-13*s,y+1*s,4*s,5*s,ink);
    ellipse(x+13*s,y+1*s,4*s,5*s,ink);
    ellipse(x,y+12*s,5*s,4*s,pink);
    line(x,y+14*s,x-4*s,y+19*s,1.3*s,ink);
    line(x,y+19*s,x+4*s,y+19*s,1.3*s,ink);
    ellipse(x-24*s,y+13*s,7*s,4*s,[255,208,198]);
    ellipse(x+24*s,y+13*s,7*s,4*s,[255,208,198]);
  }
  function bird(x,y,s) {
    const yellow=[255,210,91], gold=[239,166,62], ink=[67,65,60];
    ellipse(x,y+15*s,29*s,34*s,yellow);
    ellipse(x,y-12*s,24*s,24*s,yellow);
    ellipse(x+20*s,y-8*s,10*s,6*s,[255,145,89]);
    ellipse(x-7*s,y-16*s,3.5*s,4*s,ink);
    ellipse(x-6*s,y-17*s,1*s,1*s,[255,255,255]);
    ellipse(x-2*s,y+35*s,14*s,7*s,gold);
    line(x-8*s,y+45*s,x-10*s,y+54*s,2*s,ink);
    line(x+3*s,y+45*s,x+4*s,y+54*s,2*s,ink);
  }
  function stars(seed) {
    for(let k=0;k<22;k++) {
      const x=(seed*137+k*173+71)%W, y=(seed*53+k*61+37)%210;
      ellipse(x,y,k%4===0?3:1.7,k%4===0?3:1.7,[231,246,250]);
    }
  }
  function waves(y, color, amp, phase) {
    for(let x=0;x<W-8;x+=8) {
      const yy=Math.round(y+Math.sin((x+phase)/48)*amp);
      line(x,yy,x+8,yy+Math.sin((x+8+phase)/48)*amp,1.5,color);
    }
  }
  // Sun glow and soft layered clouds.
  ellipse(782,92,67,67,[255,242,196]);
  ellipse(782,92,48,48,scene.sun);
  ellipse(150,105,60,19,[244,250,242]); ellipse(185,91,36,24,[244,250,242]); ellipse(218,107,48,17,[244,250,242]);
  ellipse(430,145,45,14,index===3?[45,74,106]:[240,248,244]);
  // Layered seabed and soft wave highlights.
  ellipse(180,505,280,60,scene.land); ellipse(730,522,340,62,scene.land);
  waves(275, index===3?[67,108,145]:[159,222,222], 5, index*19);
  waves(330, index===3?[52,91,128]:[127,207,211], 4, index*31+22);
  if(index===0) {
    rabbit(280,360,1.1); bird(400,389,1.0);
    ellipse(655,430,105,36,scene.deep); ellipse(655,419,85,25,[99,177,187]);
    fish(635,414,.7,[255,220,121]);
    for(let k=0;k<6;k++) ellipse(520+k*30,465+(k%2)*12,5,5,[255,255,245]);
  } else if(index===1) {
    fish(230,260,1.4,[255,171,120]); fish(530,350,1.1,[255,218,100]); fish(690,215,.9,[114,222,203]);
    for(let k=0;k<8;k++){ellipse(120+k*88,390-(k%3)*48,5,5,[210,245,246]);}
    line(80,500,100,430,4,[36,139,123]);line(100,430,125,465,4,[36,139,123]);
    line(835,515,850,442,4,[36,139,123]);line(850,442,877,474,4,[36,139,123]);
  } else if(index===2) {
    // Stylized friendly sea creature, not a depiction of a sacred figure.
    ellipse(505,338,198,112,[45,111,145]); ellipse(535,371,130,54,[188,226,226]);
    ellipse(657,303,82,65,[45,111,145]); ellipse(678,287,7,7,[255,255,245]); ellipse(680,287,3,3,[34,52,66]);
    ellipse(330,333,78,31,[45,111,145]); ellipse(340,326,30,13,[70,145,168]);
    for(let k=0;k<7;k++) ellipse(390+k*34,421+(k%2)*8,4,7,[183,230,232]);
    fish(225,300,.8,[255,213,99]); fish(770,386,.65,[255,171,120]);
  } else if(index===3) {
    stars(index);
    ellipse(500,350,200,118,[18,59,92]); ellipse(540,384,130,48,[35,91,117]);
    for(let k=0;k<8;k++) ellipse(200+k*80,270+(k%3)*39,3,3,[184,222,240]);
    ellipse(780,220,24,24,[47,82,113]);
  } else if(index===4) {
    ellipse(500,338,180,100,[48,117,143]); ellipse(570,375,112,42,[198,231,221]);
    fish(270,280,.85,[255,176,113]); fish(720,325,.7,[255,215,102]);
    ellipse(785,433,45,17,[255,255,246]);
    for(let k=0;k<5;k++) ellipse(170+k*150,460-(k%2)*16,8,4,[255,255,242]);
  } else {
    rabbit(280,362,1.05); bird(408,390,.95);
    ellipse(665,440,110,38,[61,137,124]);
    for(let k=0;k<8;k++){const x=565+k*27;line(x,458,x-8,425,3,[42,128,103]);ellipse(x-8,426,7,12,[78,165,116]);}
    ellipse(770,450,22,11,[238,117,127]);ellipse(792,450,22,11,[238,117,127]);line(781,450,781,464,2,[49,118,89]);
  }
  const header=Buffer.from(`P6\n# Little Hearts enhanced original storybook art ${index+1}\n${W} ${H}\n255\n`,"ascii");
  fs.writeFileSync(path.join(out,`scene-${String(index+1).padStart(2,"0")}.ppm`),Buffer.concat([header,data]));
  console.log("Rendered scene",index+1,scene.title);
}
scenes.forEach(make);
console.log("Refreshed",scenes.length,"storybook scenes. Original versions are backed up in backup-before-art-refresh.");
