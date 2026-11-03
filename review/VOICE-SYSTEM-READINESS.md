# Character voice system readiness

## Provider selected
Azure AI Speech is the first integration target because Microsoft's official voice catalogue lists distinct neural Arabic voices across regional locales. Current configured voice IDs:
- Narrator: `ar-SA-HamedNeural` — Saudi Arabic male.
- Nour: `ar-SA-ZariyahNeural` — Saudi Arabic female.
- Zuzu: `ar-JO-TaimNeural` — Jordanian Arabic male.

These are provider voice identities, not cloned or custom characters. Zuzu's suitability for a playful preschool character must be judged by listening to a generated sample.

Official voice catalogue: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support
Official REST API guide: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech

## Local environment audit
- Windows Speech installed voices: Microsoft David Desktop (en-US, male) and Microsoft Zira Desktop (en-US, female).
- No local Arabic voice is installed.
- Existing Google Translate generator uses one Arabic voice for every clip. It is blocked by default to prevent accidental regeneration with the same voice.
- Existing MP3/WAV assets remain preserved and provisional.

## Implemented integration
- `brand/voice-profiles.json`: three distinct Azure voice IDs and per-clip assignments.
- `tools/validate-voice-profiles.mjs`: validates regional Arabic locales, provider IDs, unique voices and clip mappings.
- `tools/generate-azure-voice-candidates.mjs`: Azure REST TTS adapter. It reads credentials only from environment variables, generates into a separate candidate folder, refuses to overwrite existing files, and writes a source-text hash manifest.
- Candidate output path: `assets/audio/azure-candidates/`.
- Syntax checks and profile validation pass. Dry run confirms all clip mappings and voice IDs. No credentials were found/used and no audio was generated.

## Required to generate
Set these environment variables on the production device:
- `AZURE_SPEECH_KEY`
- `AZURE_SPEECH_REGION`

Then run:
`node tools/generate-azure-voice-candidates.mjs`

Never paste the key into source files or commit it. Do not generate the sacred supplication without preserving its exact text and having fluent Arabic pronunciation reviewed.

## Production gate
Generated clips are candidates only. A fluent Arabic reviewer must approve pronunciation, clarity, pacing and child suitability before promotion to production. Check the three voices sound distinct in practice; voice ID uniqueness alone is not enough.
