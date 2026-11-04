# Production report — 4 November 2026

## Repository and workflow
- Project path: `Documents/Little-Hearts-Quran-Stories`.
- Git branch: `main`; latest known published remote commit before current work: `7c57ab2decf994beccf44bfcd12c9ff40ea5261b`.
- GitHub connector can read repository metadata/files, but direct GitHub file/branch writes return HTTP 403 (Resource not accessible by integration). Use the authorized local Git remote; verify every push with `git ls-remote`.
- GitHub repository is public.
- GitHub Actions checks still require direct workflow-run verification; prior commit status endpoint returned no statuses.

## Technical fixes made in this session
- Fixed Azure candidate QC to resolve manifest file paths from repository root (the generator records root-relative paths).
- Fixed the integrity check: manifest `sha256` is a hash of `sourceText`, not the MP3 bytes.
- Replaced fragile FFmpeg stderr duration parsing with an `ffprobe` duration query.
- Added explicit missing-ffprobe failure guidance.
- Installed/located FFmpeg 9.0.2 locally via winget; executable path:
  `%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin`.
- Azure candidate QC: **PASS — 73 checks, 0 failed**, covering all 10 candidate clips, voice mappings, Arabic locale, file sizes, file hashes uniqueness, source-text SHA-256, and durations.
- Subtitle validator: PASS; six sequential bilingual cue blocks, positive timing, no overlap, final endpoint 63.13 sec.
- Voice-profile validator: PASS.
- JavaScript syntax: PASS; all 22 modules.
- Candidate video technical QC: PASS; full decode, H.264 1920x1080 30 fps, AAC 44.1kHz mono, embedded mov_text subtitles, duration 63.13 sec, size 6.85 MiB.

## Audio diagnostic — not a listening approval
- Source WAV: 62.8777 seconds, PCM s16le, 44.1 kHz mono.
- Four quiet intervals remain in both WAV and final MP4:
  - 18.0399–18.5452 s (0.5053 s)
  - 44.4658–44.9917 s (0.5259 s)
  - 50.3645–50.9027 s (0.5382 s)
  - 56.3221–56.9319 s (0.6099 s)
- Mean volume: -18.0 dB; peak: -3.3 dB.
- These may be natural pauses. Human listening is required before changing them.

## Visual review finding
- Sampled frame at approximately 30 seconds shows a large whale with an open mouth in dark, star-filled water.
- This scene is now flagged for replacement with neutral symbolic imagery because it can imply an unsupported literal sequence and may be too intense for ages 2–4.
- Updated `episode-01-yunus/storyboard-prompts.md` with safer symbolic scene direction and created `review/VISUAL-REVISION-EP01.md`.
- The existing MP4 has NOT been rebuilt yet; retain it only as a technical reference pending qualified storyboard approval and replacement assets.

## Release blockers — DRAFT / NOT APPROVED
- Qualified Quran/religious reviewer must verify source map, script, exact dua from Qur'an 21:87, context and translation.
- Fluent Arabic reviewer must check pronunciation, narration and subtitles; synthetic TTS is not presumed correct recitation.
- Human listening review of voice cadence and the four quiet intervals is still needed.
- Visual replacement scenes require review; the existing MP4 remains visually unapproved.
- Child-suitability and asset-licensing review required.
- Full character animation and phoneme-accurate lip-sync are not implemented.
- Azure Speech key is not configured for future generation; existing local Azure candidates are already available and technically checked.

## Publishing controls
- Episode 01 remains DRAFT.
- No upload, schedule, public publication or public channel setting change has been made.
- Any public posting remains gated by a direct, explicit owner command.
