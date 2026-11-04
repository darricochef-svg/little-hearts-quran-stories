# Azure voice candidate status — Episode 01

**Status: LOCAL TECHNICAL CANDIDATES ONLY — NOT APPROVED FOR USE**

The ten MP3 clips currently stored in `assets/audio/azure-candidates/` were generated before the current script wording was revised. The current script uses the line that the fish swallowed Yunus and does not include the earlier interpretive phrase “by Allah's command.” The generator has now been corrected so future candidate generation uses the revised wording.

Do not promote or use the older candidate set as the release narration. The existing files are preserved for traceability and their technical integrity check is not an editorial approval.

## Regeneration requirements

1. Configure `AZURE_SPEECH_KEY` locally as a secure environment variable. Do not paste it into chat or commit it.
2. Confirm `AZURE_SPEECH_REGION` is correct.
3. Move or archive the existing candidate folder so the generator's no-overwrite protection can create a new clean set.
4. Run `npm run voices:generate:azure`.
5. Run `npm run voices:qc:azure`.
6. Have a fluent Arabic speaker review all clips and the exact dua separately; synthetic speech is not Quranic recitation approval.
7. Rebuild the narration and full video only after the script, audio and visual storyboard have been accepted.

## Current checks

- Generator source uses the updated clip 03 wording.
- Azure profile configuration passes.
- Current local old candidate set: 73 technical QC checks pass, but the old content version is not the current canonical script.
- Azure key is not configured in the current Windows environment, so regeneration has not been performed.
