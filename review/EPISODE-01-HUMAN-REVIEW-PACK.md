# Episode 01 — Human Review Pack

**Release state: DRAFT / NOT APPROVED.** This pack organizes required human decisions; it does not certify that any review has happened.

## Review order and sign-off

| Gate | Reviewer needed | What to inspect | Status |
|---|---|---|---|
| Quranic accuracy | Qualified Quran/religious reviewer | Source map, verse sequence, context, exact dua, simplified narration, translation | NOT REVIEWED |
| Arabic language | Fluent Arabic reviewer | Full Arabic script, diacritics, grammar, pronunciation, subtitle alignment | NOT REVIEWED |
| English translation | Qualified bilingual reviewer | Meaning, nuance, age-appropriate simplification; especially 21:87–88 | NOT REVIEWED |
| Child suitability | Early-childhood educator or experienced reviewer | Ages 2–4 comprehension, pacing, emotional tone, frightening or confusing elements | NOT REVIEWED |
| Visual review | Human visual reviewer | All six actual PPM scenes and silent preview; consistency, artifacts, symbolism, subtitle-safe area | NOT REVIEWED |
| Audio review | Human Arabic listener | Full narration, exact dua, pronunciation, cadence, volume, pauses, abrupt edits | NOT REVIEWED |
| Licensing | Production owner/editor | Provenance and license for every image, sound, font, and third-party asset | NOT REVIEWED |
| Final master review | Owner plus relevant reviewers | Watch/listen to the complete final video with subtitles after all edits | NOT REVIEWED |
| Release authorization | Owner | Explicit approval in current conversation before any upload or public action | NOT GRANTED |

## Asset-by-asset visual inspection
Inspect the actual six regenerated files in assets/scenes/scene-01.ppm through scene-06.ppm, not just SVG previews or prompts.

- [ ] Scene 01 — fictional hosts are consistent; no text/artifacts; gentle opening.
- [ ] Scene 02 — fish and water are calm; no unintended host interaction with sacred events.
- [ ] Scene 03 — neutral open sea only; no animal, person, prophet, mouth, or implied swallowing.
- [ ] Scene 04 — abstract darkness/light only; no identifiable animal/person or frightening imagery.
- [ ] Scene 05 — calm daylight sea only; no invented rescue sequence, animal, landing, or plant.
- [ ] Scene 06 — hosts are consistent; calm ending; subtitle area remains clear.
- [ ] Silent 18-second preview reviewed end-to-end; note that it contains no narration or subtitles.

## Audio and language review
- [ ] Listen to the entire current audio candidate without skipping.
- [ ] Verify Arabic narration against the approved script line by line.
- [ ] Verify the dua in Qur'an 21:87 against a trusted mushaf and qualified reviewer; synthetic TTS is not presumed approved Quranic recitation.
- [ ] Check the four quiet intervals reported in the production report; preserve natural pauses unless a reviewer identifies a real defect.
- [ ] Check pronunciation, diacritics, pacing, child-friendly clarity, clipping, hiss, and consistent loudness.
- [ ] Verify every subtitle appears at the right time and conveys the approved wording.

## Editorial questions requiring explicit decisions
- [ ] Approve the simplified phrase describing Yunus's repentance and calling upon Allah in Scene 4.
- [ ] Approve the English rendering of the supplication and wording of Scene 5.
- [ ] Confirm the episode title is suitable and does not imply the visuals depict a literal whale.
- [ ] Confirm fictional hosts appear only in framing scenes and are never presented as witnesses to Qur'anic events.
- [ ] Decide whether the 63-second pilot is acceptable or should be expanded toward the original 2–3 minute target.

## Review record
For each review, record reviewer name/role, date, exact asset/script version or commit reviewed, decision (approved / changes requested / rejected), and concrete notes. Do not mark a gate approved based on automated tests.

| Reviewer role | Name / date | Version reviewed | Decision | Notes / required changes |
|---|---|---|---|---|
| Quran/religious |  |  | PENDING |  |
| Arabic language |  |  | PENDING |  |
| English translation |  |  | PENDING |  |
| Child suitability |  |  | PENDING |  |
| Visual |  |  | PENDING |  |
| Audio |  |  | PENDING |  |
| Licensing |  |  | PENDING |  |
| Final owner review |  |  | PENDING |  |

## Stop conditions
Do not build a release master from stale Azure audio. Do not overwrite the existing candidate. Do not mark any human gate complete without documented review. Do not upload, schedule, publish, or change public channel settings without a direct, explicit owner command in the current conversation.
