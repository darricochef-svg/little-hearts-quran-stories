# Motion Animatic Status — 2026-11-04

## Result

A new silent motion animatic was generated from the six current neutral scene assets:

- Local output: `renders/episode-01-yunus-motion-animatic-only.mp4` (ignored by Git; not a release master).
- Duration: 27.00 seconds.
- Picture: 1920×1080, H.264, 24 fps.
- Audio: none.
- Motion: restrained camera drift and soft crossfades over still illustrations; no character animation or lip-sync.

## Validation

- Build command: `npm run video:build:motion-animatic` — passed.
- ffprobe: expected H.264, 1920×1080, 24 fps, 27 seconds — passed.
- Full FFmpeg decode to null output — passed.
- Scene asset validation — 9 passed, 0 failed.
- Subtitle validation — passed (6 sequential bilingual cues; endpoint 63.13 seconds).
- Voice profile validation — passed.
- `node --check tools/build-motion-animatic.mjs` — passed.
- `git diff --check` — passed before documentation updates.

A first render exposed a zoompan frame multiplier error and produced a 622-second file; the duration guard rejected it. The generator was corrected to emit one output frame per input frame, then rebuilt successfully at 27 seconds. The corrected output overwrote the failed preview.

## Approval status

This is a technical visual review aid only. It is not the 63.13-second episode master, contains no narration/subtitles, and has not received human visual, religious, Arabic, child-suitability, or licensing approval. Episode 01 remains **DRAFT / NOT APPROVED**. Do not publish or upload.
