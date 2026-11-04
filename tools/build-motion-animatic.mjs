import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sceneDir = path.join(root, 'assets', 'scenes');
const output = path.join(root, 'renders', 'episode-01-yunus-motion-animatic-only.mp4');
const bins = [
  path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Packages', 'Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe', 'ffmpeg-9.0.2-full_build', 'bin'),
  path.join(process.env.LOCALAPPDATA || '', 'CapCut', 'Apps', '8.5.0.3590')
];
const ffmpeg = process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)
  ? process.env.FFMPEG_PATH : bins.map(b => path.join(b, 'ffmpeg.exe')).find(fs.existsSync);
if (!ffmpeg) throw new Error('FFmpeg not found. Set FFMPEG_PATH to an existing ffmpeg.exe.');
const scenes = Array.from({ length: 6 }, (_, i) => path.join(sceneDir, 'scene-' + String(i + 1).padStart(2, '0') + '.ppm'));
for (const file of scenes) if (!fs.existsSync(file)) throw new Error('Missing scene asset: ' + file);
fs.mkdirSync(path.dirname(output), { recursive: true });
const fps = 24, seconds = 5, frames = fps * seconds, transition = 0.6;
const args = ['-y', '-hide_banner', '-loglevel', 'warning', '-filter_complex_threads', '1'];
for (const file of scenes) args.push('-loop', '1', '-framerate', String(fps), '-t', String(seconds), '-i', file);
const filters = [];
for (let i = 0; i < scenes.length; i++) {
  const x = i % 2 === 0 ? 'iw/2-(iw/zoom/2)+on*0.08' : 'iw/2-(iw/zoom/2)-on*0.08';
  const y = i % 3 === 0 ? 'ih/2-(ih/zoom/2)+on*0.025' : 'ih/2-(ih/zoom/2)-on*0.02';
  filters.push('[' + i + ':v]zoompan=z=\'min(zoom+0.00042,1.05)\':x=\'' + x + '\':y=\'' + y + '\':d=1:s=960x540:fps=' + fps + ',setsar=1,format=yuv420p[v' + i + ']');
}
let prev = '[v0]';
for (let i = 1; i < scenes.length; i++) {
  const label = i === scenes.length - 1 ? '[joined]' : '[x' + i + ']';
  filters.push(prev + '[v' + i + ']xfade=transition=fade:duration=' + transition + ':offset=' + ((seconds - transition) * i).toFixed(2) + label);
  prev = label;
}
filters.push('[joined]scale=1920:1080:flags=bilinear,setsar=1,format=yuv420p[vout]');
args.push('-filter_complex', filters.join(';'), '-map', '[vout]', '-an', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '22', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', output);
console.log('Building a silent 1080p motion animatic. Camera drift and crossfades only; this is a review aid, not finished character animation.');
const result = spawnSync(ffmpeg, args, { stdio: 'inherit', windowsHide: true });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
const ffprobe = path.join(path.dirname(ffmpeg), 'ffprobe.exe');
const probe = spawnSync(ffprobe, ['-v', 'error', '-show_entries', 'format=duration:stream=codec_name,width,height,avg_frame_rate', '-of', 'json', output], { encoding: 'utf8', windowsHide: true });
if (probe.error || probe.status !== 0) throw new Error('ffprobe validation failed: ' + (probe.stderr || probe.error || 'unknown error'));
const meta = JSON.parse(probe.stdout), video = meta.streams?.find(s => s.codec_name === 'h264' && s.width === 1920 && s.height === 1080), duration = Number(meta.format?.duration);
if (!video || !Number.isFinite(duration) || duration < 25 || duration > 30) throw new Error('Unexpected output metadata: ' + probe.stdout);
console.log(JSON.stringify({ output, duration_seconds: duration, resolution: video.width + 'x' + video.height, frame_rate: video.avg_frame_rate, audio: 'none', validation: 'passed' }, null, 2));
