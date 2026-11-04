# Production report — 4 November 2026

## Repository and workflow
- Project: `darricochef-svg/little-hearts-quran-stories`.
- Workstation: Windows checkout at `Documents/Little-Hearts-Quran-Stories`.
- Branch: `main`; latest previously verified commit: `1562f3f74fb91fda71d7aab3fedf0715df945f1b`.
- Use the authorized local Git remote for pushes; verify local HEAD against `git ls-remote origin refs/heads/main`.
- GitHub Actions run #7 passed for commit `71c209d`; this newer commit must receive its own CI run after push.
- No upload, scheduling, public publishing, or public channel setting changes.

## Technical fixes completed
- Azure candidate QC resolves manifest file paths from repository root, verifies source-text hashes correctly, and uses ffprobe duration checks.
- Voice profile validator and Azure candidate generator resolve files relative to their script location, making them portable across Windows and Ubuntu.
- Azure generator clip 03 now matches the revised canonical script and no longer contains the earlier interpretive phrase.
- Existing Azure MP3s are from the older wording version; they are explicitly marked stale and not approved for production. Azure Speech key is missing locally, so regeneration is blocked.
- Subtitle validator: PASS; six sequential bilingual cues, valid positive timing, no overlap, endpoint 63.13 sec.
- Voice-profile validator: PASS.
- JavaScript syntax: PASS for all tool modules.
- Scene asset QC: **PASS — 9 checks, 0 failures**; six 960x540 RGB PPM assets and three neutral SVG previews.
- Visual-only review preview: **18.00 seconds, 1920x1080, H.264, silent**, full FFmpeg decode passed. This is a scene review aid, not the episode master.
- Existing 63.13-second MP4 technical candidate remains untouched; it still contains the earlier visual scene and must not be treated as the new approved cut.

## Visual revision
- Backed up the original six PPM scene images under `assets/scenes/backup-before-art-refresh/`.
- Reworked scenes 03, 04 and 05 in `tools/generate-scenes.mjs` and regenerated the PPMs:
  - Scene 03: neutral open sea, no animal or swallowing event.
  - Scene 04: abstract layered darkness/light metaphor, no stars, person or animal.
  - Scene 05: calm morning sea, no creature or invented rescue sequence.
- Updated corresponding SVG previews.
- Added `tools/validate-scenes.mjs`, `npm run scenes:validate`, and a GitHub Actions step.
- Added `tools/build-visual-review.mjs` and `npm run video:build:visual-review` to produce a silent visual-only review preview.
- Spot-checked scene images. Visual direction is calmer and no longer depicts a whale, but qualified review remains mandatory.

## Audio diagnostic — not a listening approval
- Source WAV: 62.8777 seconds, PCM s16le, 44.1 kHz mono.
- Four quiet intervals remain in the existing audio and MP4:
  - 18.0399–18.5452 s (0.5053 s)
  - 44.4658–44.9917 s (0.5259 s)
  - 50.3645–50.9027 s (0.5382 s)
  - 56.3221–56.9319 s (0.6099 s)
- Mean volume: -18.0 dB; peak: -3.3 dB.
- These may be natural pauses. Human listening is required before changing them.

## Release blockers — DRAFT / NOT APPROVED
- Qualified Quran/religious reviewer must verify source map, script, exact dua from Qur'an 21:87, context and translation.
- Fluent Arabic reviewer must check pronunciation, narration and subtitles; synthetic speech is not presumed correct Quranic recitation.
- Existing Azure candidates are stale; regenerate with the updated source text after securely configuring the Azure key.
- Human listening review of cadence and the four quiet intervals is required.
- Human visual review, child-suitability review and asset-licensing review are required.
- Full character animation and phoneme-accurate lip-sync are not implemented.
- The new silent visual-only preview is not the final episode and does not include narration or subtitles.

## Publishing controls
- Episode 01 remains DRAFT / NOT APPROVED.
- No upload, schedule, public publication or public channel setting change has been made.
- Any public posting remains gated by a direct, explicit owner command.
