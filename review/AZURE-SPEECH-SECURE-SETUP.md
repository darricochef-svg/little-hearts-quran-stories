# Azure Speech — Secure Setup

This project uses Azure Speech REST TTS with three distinct Arabic neural voices.
No API key should be pasted into chat, committed to Git, or written into project files.

## 1. Create the resource
1. In the Azure portal, create an **AI Speech** resource.
2. Choose the region you intend to use and note its exact region identifier (for example, `eastus`).
3. Open **Keys and Endpoint** and copy one key locally. Do not share it.

Azure pricing and availability depend on your subscription and region. Do not enable paid tiers or create billable resources without reviewing the price first.

## 2. Configure credentials on the Windows production computer
Open PowerShell on the computer and run the following commands, replacing the placeholders locally:

```powershell
[Environment]::SetEnvironmentVariable("AZURE_SPEECH_KEY", "<paste-key-here>", "User")
[Environment]::SetEnvironmentVariable("AZURE_SPEECH_REGION", "<your-region>", "User")
```

Close and reopen the terminal so the new user environment variables are loaded. Do not run commands that echo either value.

To verify safely:
```powershell
"KEY_SET=" + [bool]$env:AZURE_SPEECH_KEY
"REGION_SET=" + [bool]$env:AZURE_SPEECH_REGION
```

Both should print `True`. Never share the values themselves.

## 3. Generate isolated candidates
From the project directory:
```powershell
node tools\validate-voice-profiles.mjs
node tools\generate-azure-voice-candidates.mjs
```

Outputs go only to `assets\audio\azure-candidates\`. Existing episode audio is not overwritten. If a partial run leaves files behind, inspect the folder and manifest before deciding whether to remove only those generated candidate files and retry.

## 4. Quality gate
After generation, run:
```powershell
node tools\qc-azure-voice-candidates.mjs
```

A technical pass only confirms file integrity, expected voice assignments, durations, and non-identical audio files. It does not establish naturalness or correct Arabic pronunciation. Listen to every clip and obtain fluent Arabic review. The Qur'anic supplication in clip 04b requires a separate exact-text and pronunciation review before use.

## 5. Release restrictions
Do not replace episode audio, render a final episode, or publish until the voice candidates pass listening review, Arabic review, animation sync checks, and the project release checklist.
