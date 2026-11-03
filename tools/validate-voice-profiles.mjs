import fs from 'node:fs';
import path from 'node:path';
const root='C:/Users/vitag/Documents/Little-Hearts-Quran-Stories';
const file=path.join(root,'brand','voice-profiles.json');
const data=JSON.parse(fs.readFileSync(file,'utf8'));
const errors=[];
for(const required of ['narrator','nour','zuzu']){
 const p=data.profiles.find(x=>x.id===required);
 if(!p) errors.push('Missing profile: '+required);
 else {
  if(typeof p.locale!=='string'||!p.locale.toLowerCase().startsWith('ar-')) errors.push(required+' must use a regional Arabic locale such as ar-SA.');
  if(!p.provider) errors.push(required+' has no configured provider.');
  if(!p.voiceId) errors.push(required+' has no verified provider voice ID.');
 }
}
const configured=data.profiles.filter(p=>p.provider&&p.voiceId);
const ids=configured.map(p=>p.provider+':'+p.voiceId);
if(new Set(ids).size!==ids.length) errors.push('Two character profiles share the same provider voice ID.');
for(const [clip,profile] of Object.entries(data.clipAssignments||{})){
 if(!data.profiles.some(p=>p.id===profile)) errors.push('Clip '+clip+' maps to missing profile '+profile+'.');
}
if(errors.length){console.log('VOICE PROFILE CHECK: NOT READY');for(const e of errors)console.log('- '+e);process.exitCode=2;}
else console.log('VOICE PROFILE CHECK: PASS — all profiles configured with distinct Arabic voices.');
