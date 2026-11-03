# Little Hearts, Quran Stories

A child-friendly Arabic Quran-story channel project for ages 2–4.

## Creative direction
The channel is being developed as a genuine 2D animated story series, not a slideshow. Nour (cream rabbit) and Zuzu (golden bird) are fictional recurring hosts. The Qur'an remains the source of every story; child-friendly explanations must not add unsupported events or dialogue.

- Production standard: `brand/ANIMATED-QURAN-STORY-STANDARD.md`
- Episode 01 source map: `episode-01-yunus/QURAN-SOURCE-MAP.md`

## Current production status
- Episode 01: Prophet Yunus and the Whale — narration and technical video candidates exist; not approved for publication.
- Script: `episode-01-yunus/script-ar-en.md` (requires qualified religious review).
- Source map: `episode-01-yunus/QURAN-SOURCE-MAP.md`.
- Current scene art: `assets/scenes/scene-01.ppm` through `scene-06.ppm`.
- Provisional Arabic TTS clips: `assets/audio/voice-*.mp3`.
- Original assembled narration: `assets/audio/voiceover.wav`.
- Variable-duration narration candidate: `assets/audio/voiceover-variable-candidate.wav`.
- Variable-duration subtitles: `episode-01-yunus/subtitles-variable-candidate.srt`.
- Variable-duration video candidate: `renders/episode-01-yunus-variable-candidate.mp4`.
- Original draft and prior candidates remain preserved.

## Animation gap — important
The current renders use illustrated still scenes and slow camera movement. They do NOT yet meet the target of animated characters that move and talk. The next production milestone is a character-animation prototype:
- consistent rigged 2D characters for Nour and Zuzu;
- body/face motion (walk/hop, turn, blink, ears/wings, gestures);
- distinct speaker voices;
- mouth shapes timed to each character's own dialogue;
- environmental animation;
- narrator sections where hosts react silently rather than fake lip-sync.

Do not call the episode fully animated until these features are visibly implemented and checked in playback.

## Technical tools
- Narration generator: `tools/generate-voiceover.mjs` (Google Translate public TTS endpoint; network access required).
- Audio assembly: `tools/assemble-voiceover.mjs`.
- Video assembly and FFmpeg scripts are experimental candidates; preserve originals when testing.
- FFmpeg is available through the CapCut installation on the production device.

## Review and release gates
1. Qualified religious review of the source map, script, exact dua and translation.
2. Fluent Arabic review of narration and pronunciation.
3. Human review of complete playback, subtitles, character consistency, animation, audio and preschool suitability.
4. Explicit owner approval before any public upload or channel setting changes.

No upload has been made. Public uploads and channel settings remain approval-gated.

## Character dialogue prototype and voice system
- Dialogue render: `renders/dialogue-animation-prototype.mp4` (7.42 seconds, 960x540, 30 fps).
- The prototype uses Zuzu's and Nour's existing Arabic dialogue clips, a 250 ms turn gap, three-state audio-energy-driven mouth movement, basic blinking and listener reactions.
- Technical decode check passed. This is an engineering prototype, not final character animation or phoneme-accurate Arabic lip-sync.
- Voice profiles: `brand/voice-profiles.json`; readiness report: `review/VOICE-SYSTEM-READINESS.md`.
- Local voice audit found only English Windows voices. The legacy one-voice generator is now blocked by default; it requires the explicit `--allow-legacy-single-voice` flag to run.
- Run `node tools/validate-voice-profiles.mjs` to check voice readiness. It currently reports NOT READY until distinct Arabic-capable provider voice IDs are configured.

## Arabic voice provider integration
- Azure AI Speech selected as the first provider; official Arabic neural voice IDs are assigned to Narrator, Nour and Zuzu in `brand/voice-profiles.json`.
- Generator: `tools/generate-azure-voice-candidates.mjs`. It writes to a separate candidate folder and never overwrites the existing provisional recordings.
- Voice profile validation and generator syntax checks pass; dry run confirms all ten clip assignments.
- Audio generation is waiting for Azure Speech resource credentials (`AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`) to be configured securely on the production device.
- Voice samples must pass fluent Arabic review before any candidate is promoted to the episode.
