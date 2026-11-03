# Little Hearts, Quran Stories

A child-friendly Arabic Quran-story channel project for ages 2–4.

## Creative direction
A gentle 2D animated story series. Nour (cream rabbit) and Zuzu (golden bird) are fictional recurring hosts. The Qur'an remains the source of every story; child-friendly explanations must not add unsupported events or dialogue.

- Production standard: `brand/ANIMATED-QURAN-STORY-STANDARD.md`
- Brand guide: `brand/brand-guide.md`
- Agent operating rules: `AGENTS.md`
- Episode 01 source map: `episode-01-yunus/QURAN-SOURCE-MAP.md`

## Episode 01 — Prophet Yunus and the Whale

**Status: technical candidate only — not approved for publication.**

- Arabic/English script: `episode-01-yunus/script-ar-en.md` (requires qualified religious and fluent Arabic review).
- Storyboard: `episode-01-yunus/storyboard-prompts.md`.
- Candidate subtitles: `episode-01-yunus/subtitles-variable-candidate.srt`.
- Current six scene assets: `assets/scenes/scene-01.ppm` through `scene-06.ppm`.
- Variable-duration narration candidate: `assets/audio/voiceover-variable-candidate.wav` (62.88 seconds; four short quiet intervals of 0.50–0.61 seconds remain for listening review).
- Compressed video candidate: `renders/episode-01-yunus-variable-candidate-compressed.mp4` (local render; 63.13 seconds, 1920×1080, H.264/AAC, 6.85 MiB; automated full-decode QC passes).
- Existing animated technical test: `renders/episode-01-yunus-animated-test.mp4` (71.50 seconds; technical container QC passes).
- QC report: `review/QC-VARIABLE-CANDIDATE.md`.

## Animation limitation
Current scenes are illustrated stills with slow camera movement. The dialogue prototype demonstrates basic audio-energy-driven mouth movement and listener reactions, but it is not finished character animation or phoneme-accurate Arabic lip-sync. Do not describe the pilot as fully animated until consistent character motion and speaker-specific lip-sync are implemented and reviewed.

## Voice production
- Voice profiles: `brand/voice-profiles.json`.
- Validator: `npm run voices:validate`.
- Azure candidate generator: `npm run voices:generate:azure`.
- Azure candidate QC: `npm run voices:qc:azure`.
- Azure Speech region is present on the production computer, but `AZURE_SPEECH_KEY` is not configured. Do not paste keys into chat or commit them. Follow `review/AZURE-SPEECH-SECURE-SETUP.md`.
- The exact Qur'anic supplication in 21:87 must be checked by a qualified reviewer; synthetic TTS is not presumed correct recitation.

## Local quality checks
Run from the project directory:

```cmd
npm ci
npm run voices:validate
npm run check:syntax
npm run video:qc
npm run video:qc:variable
npm run qc:audio
```

The checks verify technical properties only. They do not approve religious accuracy, Arabic pronunciation, child suitability, visual quality, or release readiness.

## Release gates
1. Qualified reviewer verifies source map, script, exact dua, context and translation.
2. Fluent Arabic reviewer checks narration, pronunciation and subtitles.
3. Human listens to the complete audio and watches the full video with subtitles.
4. Review character consistency, visual quality, preschool suitability and asset licensing.
5. Owner explicitly approves any public release.

**Never upload, schedule, publish, or change public channel settings without an explicit owner command in the current conversation.**

## Repository
- Local Git repository: `main`; latest commits are recorded in local Git history.
- Generated MP4 renders and intermediate frame sequences are intentionally excluded from Git; keep them locally for review.
- GitHub remote repository has not yet been created or connected.
- GitHub Actions workflow: `.github/workflows/quality.yml`.
