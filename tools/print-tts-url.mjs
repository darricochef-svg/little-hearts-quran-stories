import { getAudioUrl } from 'google-tts-api';
console.log(getAudioUrl('مرحبا', {lang:'ar', slow:false, host:'https://translate.google.com'}));
