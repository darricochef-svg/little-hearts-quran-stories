# Production report — 4 November 2026

## Repository and workflow
- Project path: `Documents/Little-Hearts-Quran-Stories`.
- Git repository is on branch `main`; local working tree was clean before this documentation sync.
- Remote `origin/main` was independently verified with `git ls-remote` at commit `912089bdc7c8daf9d595d4111ff69ba990dc91b4` (`Update-project-handoff-readme`).
- Repository visibility was not checked; do not assume it is private.
- GitHub integration content writes previously returned HTTP 403, so this sync is being performed from the authorized Windows workstation.
- GitHub Actions status for the latest push has not been independently verified.

## Checks run on 4 November 2026
- `npm ci`: PASS; 1 package audited, 0 vulnerabilities.
- `npm run voices:validate`: PASS; all profiles configured with distinct Arabic voices.
- `npm run check:syntax`: PASS; all 21 JavaScript modules passed syntax checks.
- `npm run video:qc:variable`: PASS; candidate exists, is below 500 MB, fully decodes, and contains H.264 video, AAC audio and embedded subtitles.
- Candidate details: 63.13 seconds, 1920×1080, 30 fps, 6.85 MiB.
- `npm run qc:audio`: PASS as a diagnostic run; it identified four quiet intervals (0.505, 0.526, 0.538 and 0.610 seconds). This is not a human listening approval.
- Audio candidate duration: 62.88 seconds; mean volume -18.0 dB, peak -3.3 dB.

## Production-document synchronization
- Updated the six script scene headings to match the variable candidate subtitle timing: 0:00–0:05.86; 0:05.91–0:12.75; 0:12.80–0:26.38; 0:26.43–0:41.01; 0:41.06–0:47.56; 0:47.61–1:03.13.
- Updated the script's assembled-cut duration to 63.13 seconds.
- Production tracker now records the verified remote main push rather than remote-pending status.

## Defects previously corrected
- Fixed a syntax error in `tools/qc-variable-candidate.mjs`.
- Fixed the variable render zoompan frame multiplier so the filter emits one output frame per input frame.
- Added controlled H.264 bitrate output. The compressed candidate is 6.85 MiB; the older large render was preserved rather than overwritten.

## Release blockers — episode remains DRAFT / NOT APPROVED
- Qualified Quran/religious review is still required for the source map, script, exact dua from Qur'an 21:87, and translation.
- Fluent Arabic review of pronunciation, narration and subtitles remains required.
- Human listening review is required for cadence and the four quiet intervals.
- Human review remains required for visuals, child suitability, subtitle readability and asset licensing.
- Azure Speech region is present in the Windows environment, but `AZURE_SPEECH_KEY` is not configured. Never paste secrets into chat or commit them.
- Current visuals are illustrated still scenes with camera movement, not full character animation or phoneme-accurate lip-sync.

## Publishing controls
- Episode 01 remains DRAFT.
- Publishing calendar has no target dates.
- No video was uploaded, scheduled or published.
- No public channel settings were changed.
- Any public posting remains gated by a direct, explicit owner command.
