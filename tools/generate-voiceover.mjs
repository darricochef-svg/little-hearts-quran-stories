import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
if (!process.argv.includes('--allow-legacy-single-voice')) {
 console.error('BLOCKED: this legacy generator assigns one Google Translate Arabic voice to every character.');
 console.error('Use the new brand/voice-profiles.json and configure distinct Arabic provider voice IDs first.');
 console.error('To deliberately regenerate the old single-voice draft only, pass --allow-legacy-single-voice.');
 process.exit(2);
}
const root = 'C:/Users/vitag/Documents/Little-Hearts-Quran-Stories';
const out = path.join(root, 'assets', 'audio');
fs.mkdirSync(out, {recursive:true});
const parts = [
 ['01','في يومٍ جميل، جاءت نور وزوزو إلى البحر الأزرق الجميل.'],
 ['02a','انظري يا نور! كم هي جميلة الأسماك!'],
 ['02b','واو! ما أجمل البحر!'],
 ['03','والآن، لنتعلّم قصة النبي يونس عليه السلام. كان يونس نبيًّا من أنبياء الله. وفي قصة يونس، ابتلعه الحوت بأمر الله.'],
 ['04a','كان يونس عليه السلام في الظلمات، فنادى ربَّه وتاب إليه. ودعا الله بكلمات عظيمة.'],
 ['04b','لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ.'],
 ['05','فاستجاب الله له ونجّاه من الغمّ. إن الله رحيمٌ بعباده.'],
 ['06a','ماذا نتعلّم من قصة يونس؟'],
 ['06b','ندعو الله، ونتوب إليه، ولا نيأس من رحمته!'],
 ['06c','أحسنتم يا أصدقائي! إلى اللقاء في قصة جميلة جديدة!']
];
const files = [];
for (const [clipId, text] of parts) {
 const file = path.join(out, 'voice-' + clipId + '.mp3');
 console.log('Generating Arabic clip ' + clipId);
 const url = new URL('https://translate.google.com/translate_tts');
 for (const [key, value] of Object.entries({ie:'UTF-8', q:text, tl:'ar', total:'1', idx:'0', textlen:String(text.length), client:'tw-ob', prev:'input', ttsspeed:'1'})) url.searchParams.set(key, value);
 const response = await fetch(url);
 if (!response.ok) throw new Error('Google TTS failed for ' + clipId + ': HTTP ' + response.status);
 fs.writeFileSync(file, Buffer.from(await response.arrayBuffer()));
 files.push(file);
}
const assembler = spawnSync(process.execPath, [path.join(root, 'tools', 'assemble-voiceover.mjs')], {stdio:'inherit', windowsHide:true});
if (assembler.error || assembler.status !== 0) throw new Error('Voiceover assembly failed');
console.log('Provisional Arabic voiceover saved: ' + path.join(out, 'voiceover.wav'));
