import { getVoices } from 'edge-tts';
const voices = await getVoices();
console.log(voices.filter(v => String(v.Locale).startsWith('ar-')).map(v => `${v.ShortName} | ${v.Locale}`).join('\n'));
