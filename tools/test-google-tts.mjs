import { getAudioUrl } from 'google-tts-api';
import fs from 'node:fs';
const url = getAudioUrl('مرحبًا يا أصدقائي', {lang:'ar', slow:false, host:'https://translate.google.com'});
console.log('Requesting Arabic TTS audio');
const res = await fetch(url);
console.log('HTTP', res.status, res.headers.get('content-type'));
if (!res.ok) throw new Error('TTS request failed: ' + res.status);
fs.writeFileSync('C:/Users/vitag/Documents/Little-Hearts-Quran-Stories/assets/audio/tts-test.mp3', Buffer.from(await res.arrayBuffer()));
console.log('Saved test audio');
