# Production report — 4 November 2026

## Repository and workflow
- Located the production project at `Documents/Little-Hearts-Quran-Stories`.
- Initialized local Git repository on `main`; initial commit: `2d3a1f9`.
- Added `AGENTS.md` with specialist role instructions and non-negotiable Quran accuracy, credential, and public-release rules.
- Added `.gitignore` to exclude secrets, local dependencies, generated intermediate frames, and rendered MP4 files.
- Rebuilt minimal package scripts and synchronized the lockfile.
- Added GitHub Actions workflow for voice profile validation and JavaScript syntax checks.
- GitHub remote is not created or pushed yet. GitHub CLI installation/authentication remains pending; the connected GitHub integration currently exposes no repositories and no repository-creation action.

## Verified checks
- `npm install --package-lock-only --ignore-scripts`: PASS; zero reported vulnerabilities.
- `npm run voices:validate`: PASS; narrator, Nour and Zuzu profiles are configured with distinct Arabic voice IDs.
- `npm run check:syntax`: PASS; all 21 project JavaScript modules passed `node --check`.
- Existing animated test: PASS; 71.50 seconds, 1920×1080, video/audio/subtitle streams detected, 18.55 MB.
- New compressed variable-duration candidate: PASS; 63.13 seconds, 1920×1080 H.264, AAC audio, embedded subtitles, 6.85 MiB; FFmpeg fully decoded the file.
- AMD H.264 encoder test: PASS.
- Variable narration assembly: PASS; six scene audio segments combined to 62.88 seconds.

## Defects found and corrected
- Fixed a syntax error in `tools/qc-variable-candidate.mjs` that prevented the candidate QC script from running.
- Fixed the variable render's zoompan frame multiplier. It was producing an extremely oversized/long render; the corrected filter emits one output frame per input frame.
- Added controlled H.264 bitrate output. The new candidate is 6.85 MiB; the old 5.5 GB candidate was preserved and not overwritten.

## Remaining blockers — pilot is not release-ready
- The variable narration track has four quiet intervals of approximately 0.50–0.61 seconds. These may be scene pauses, but a human must listen and confirm the cadence is natural.
- The previous tightened track had 5–6 second gaps; the new variable candidate removes those long gaps.
- Azure region is present in the Windows environment, but `AZURE_SPEECH_KEY` is not configured. No key was printed or requested in chat.
- Existing visuals are stylized illustrated still scenes with camera movement, not full character animation or phoneme-accurate lip-sync.
- Qualified Quran/religious review and fluent Arabic pronunciation review remain outstanding, especially the exact dua from Qur'an 21:87.
- Full playback, subtitle readability, child suitability, and asset licensing review remain outstanding.

## Publishing
- Episode 01 remains DRAFT.
- Publishing calendar has no target dates.
- No video was uploaded, scheduled, or published.
- No public channel settings were changed.
- Any public posting remains gated by explicit owner command.
