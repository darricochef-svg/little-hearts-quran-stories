import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const audioDir = path.join(root, 'assets', 'audio');
const outDir = path.join(audioDir, 'azure-candidates');
const profileFile = path.join(root, 'brand', 'voice-profiles.json');
const profile = JSON.parse(fs.readFileSync(profileFile, 'utf8'));

const parts = [
  ['01', 'في يومٍ جميل، جاءت نور وزوزو إلى البحر الأزرق الجميل.'],
  ['02a', 'انظري يا نور! كم هي جميلة الأسماك!'],
  ['02b', 'واو! ما أجمل البحر!'],
  ['03', 'والآن، لنتعلّم قصة النبي يونس عليه السلام. كان يونس نبيًّا من أنبياء الله. وفي قصة يونس، ابتلعه الحوت.'],
  ['04a', 'كان يونس عليه السلام في الظلمات، فنادى ربَّه وتاب إليه. ودعا الله بكلمات عظيمة.'],
  ['04b', 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ.'],
  ['05', 'فاستجاب الله له ونجّاه من الغمّ. إن الله رحيمٌ بعباده.'],
  ['06a', 'ماذا نتعلّم من قصة يونس؟'],
  ['06b', 'ندعو الله، ونتوب إليه، ولا نيأس من رحمته!'],
  ['06c', 'أحسنتم يا أصدقائي! إلى اللقاء في قصة جميلة جديدة!']
];

const errors = [];
if (!profile || !Array.isArray(profile.profiles)) throw new Error('Invalid voice profile file.');
for (const [clipId] of parts) {
  const assigned = profile.clipAssignments?.[clipId];
  const voice = profile.profiles.find(x => x.id === assigned);
  if (!voice || voice.provider !== 'azure' || !voice.voiceId || !voice.locale) errors.push('Clip ' + clipId + ' has no complete Azure voice profile.');
}
const configured = profile.profiles.filter(x => x.provider === 'azure' && x.voiceId);
const ids = configured.map(x => x.voiceId);
if (new Set(ids).size !== ids.length) errors.push('Duplicate Azure voice IDs are not allowed.');
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(2);
}

const key = process.env.AZURE_SPEECH_KEY;
const region = process.env.AZURE_SPEECH_REGION;
if (!key || !region) {
  console.log('READY FOR CREDENTIALS — voice assignments and clip mappings validated.');
  console.log('Required environment variables: AZURE_SPEECH_KEY and AZURE_SPEECH_REGION.');
  console.log('No network request made; no audio assets changed.');
  console.log('Profiles: ' + configured.map(x => x.id + '=' + x.voiceId).join(', '));
  process.exit(0);
}

const esc = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
fs.mkdirSync(outDir, { recursive: true });
const manifest = { provider: 'Azure AI Speech', region, generatedAt: new Date().toISOString(), status: 'candidate', clips: [] };
for (const [clipId, text] of parts) {
  const profileId = profile.clipAssignments[clipId];
  const voice = profile.profiles.find(x => x.id === profileId);
  const ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="' + voice.locale + '"><voice name="' + voice.voiceId + '">' + esc(text) + '</voice></speak>';
  const response = await fetch('https://' + region + '.tts.speech.microsoft.com/cognitiveservices/v1', {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      'User-Agent': 'LittleHeartsQuranStories'
    },
    body: ssml
  });
  if (!response.ok) throw new Error('Azure TTS failed for ' + clipId + ': HTTP ' + response.status + ' ' + (await response.text()).slice(0, 500));
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 1000) throw new Error('Azure returned suspiciously small audio for ' + clipId);
  const dest = path.join(outDir, 'voice-' + clipId + '.mp3');
  fs.writeFileSync(dest, bytes, { flag: 'wx' });
  manifest.clips.push({
    clipId,
    profileId,
    locale: voice.locale,
    voiceId: voice.voiceId,
    file: path.relative(root, dest).replaceAll('\\', '/'),
    bytes: bytes.length,
    audioSha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    sha256: crypto.createHash('sha256').update(text).digest('hex'),
    sourceText: text
  });
  console.log('Generated candidate ' + clipId + ' with ' + voice.voiceId);
}
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
console.log('Candidate generation complete. Listen and obtain fluent Arabic review before promotion to production.');
