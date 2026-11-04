# Little Hearts, Quran Stories

A child-friendly Arabic Quran-story channel project for ages 2–4.

## Creative direction
A gentle 2D animated story series. Nour (cream rabbit) and Zuzu (golden bird) are fictional recurring hosts. The Qur'an remains the source of every story; child-friendly explanations must not add unsupported events or dialogue.

- Production standard: brand/ANIMATED-QURAN-STORY-STANDARD.md
- Brand guide: brand/brand-guide.md
- Agent operating rules: AGENTS.md
- Episode 01 source map: episode-01-yunus/QURAN-SOURCE-MAP.md
- Episode 01 human sign-off pack: review/EPISODE-01-HUMAN-REVIEW-PACK.md

## Episode 01 — Prophet Yunus and the Whale

**Status: DRAFT / NOT APPROVED.**

- Arabic/English script: episode-01-yunus/script-ar-en.md (requires qualified religious and fluent Arabic review).
- Storyboard: episode-01-yunus/storyboard-prompts.md (aligned to the current neutral visual assets; human review required).
- Candidate subtitles: episode-01-yunus/subtitles-variable-candidate.srt.
- Current six scene assets: assets/scenes/scene-01.ppm through scene-06.ppm.
- Candidate narration: assets/audio/voiceover-variable-candidate.wav (62.88 seconds; four short quiet intervals of 0.50–0.61 seconds remain for listening review).
- Old compressed video candidate: renders/episode-01-yunus-variable-candidate-compressed.mp4 (63.13 seconds, 1920×1080, H.264/AAC; contains earlier visuals and is NOT the current approved cut).
- Silent visual review preview: renders/episode-01-yunus-visual-review-only.mp4 (18 seconds; no narration or subtitles; review aid only).
- Silent motion animatic: renders/episode-01-yunus-motion-animatic-only.mp4 (27 seconds; 1080p/24 fps; camera drift and crossfades over still scenes; no audio; review aid only). See review/MOTION-ANIMATIC-STATUS.md.
- QC report: review/QC-VARIABLE-CANDIDATE.md.

## Animation limitation
Current scenes are illustrated stills with slow camera movement. The dialogue prototype demonstrates basic audio-energy-driven mouth movement and listener reactions, but it is not finished character animation or phoneme-accurate Arabic lip-sync. Do not describe the pilot as fully animated until consistent character motion and speaker-specific lip-sync are implemented and reviewed.

## Voice production
- Voice profiles: brand/voice-profiles.json.
- Validator: npm run voices:validate.
- Azure candidate generator: npm run voices:generate:azure.
- Azure candidate QC: npm run voices:qc:azure.
- Azure Speech region is present on the production computer, but AZURE_SPEECH_KEY is not configured. Do not paste keys into chat or commit them. Follow review/AZURE-SPEECH-SECURE-SETUP.md.
- Existing Azure clips predate the revised source text and are stale; do not use them for release.
- The exact Qur'anic supplication in 21:87 must be checked by a qualified reviewer; synthetic TTS is not presumed correct recitation.

## Local quality checks
Run from the project directory:

```cmd
npm ci
npm run voices:validate
npm run subtitles:validate
npm run scenes:validate
npm run check:syntax
npm run video:qc
npm run video:qc:variable
npm run qc:audio
```

To create a silent visual-only preview of the current six scenes (no narration or subtitles):

```cmd
npm run video:build:visual-review
npm run video:build:motion-animatic
```

The preview is saved locally as renders/episode-01-yunus-visual-review-only.mp4 and is excluded from Git.

Automated checks verify technical properties only. They do not approve religious accuracy, Arabic pronunciation, child suitability, visual quality, licensing, or release readiness.

## Release gates
1. Qualified reviewer verifies source map, script, exact dua, context and translation.
2. Fluent Arabic reviewer checks narration, pronunciation and subtitles.
3. Human listens to the complete audio and watches the full video with subtitles.
4. Review character consistency, visual quality, preschool suitability and asset licensing.
5. Owner explicitly approves any public release.

Use review/EPISODE-01-HUMAN-REVIEW-PACK.md to record human decisions and version reviewed.

**Never upload, schedule, publish, or change public channel settings without an explicit owner command in the current conversation.**

## Repository
- Local Git repository: main; verify local HEAD against origin/main after each push.
- Generated MP4 renders and intermediate frame sequences are intentionally excluded from Git; keep them locally for review.
- GitHub remote: https://github.com/darricochef-svg/little-hearts-quran-stories.
- GitHub Actions workflow: .github/workflows/quality.yml; pushes to main trigger the quality workflow.
