# Episode 01 — Technical QC Report

Date: 2026-10-30
File: `renders/episode-01-yunus-draft.mp4`

## Automated checks completed
- MP4 exists and was rendered successfully using CapCut's bundled FFmpeg.
- Video stream: MPEG-4, 1920×1080, 30 fps.
- Audio stream: AAC, 44.1 kHz, mono.
- Subtitle stream: embedded MP4 `mov_text` track.
- Render duration: approximately 71.5 seconds.
- Source narration WAV duration: 72 seconds.
- Narration loudness scan: mean -19.2 dB, peak -3.3 dB; no digital clipping detected by this scan.
- `npm audit --omit=dev`: zero vulnerabilities after removing the TTS package that brought in vulnerable Axios dependencies.

## Still requires human review
- Listen to the complete MP4 on a phone with sound on. Automated loudness statistics cannot judge pronunciation, unnatural cadence, or whether any clips are cut off.
- Verify Arabic pronunciation and exact recitation of the dua against Qur'an 21:87 with a qualified reviewer. Synthetic TTS must not be assumed correct for Quranic recitation.
- Review English translation and Arabic captions for accuracy and legibility.
- Current scene art is simple, largely static vector-style art; improve the visual quality and transitions before calling this a polished children's episode.
- Confirm any music or other assets are appropriately licensed before adding them.

## Release gate
NOT READY FOR PUBLICATION. Do not upload or change public channel settings until language/religious review and full playback QC are complete and the owner explicitly approves publication.
