# Little Hearts, Quran Stories — Agent Operating Rules

## Mission
Produce safe, accurate, age-appropriate Quran story episodes for children ages 2–4. Work locally and keep every public action approval-gated.

## Specialist roles
- Executive Producer: maintain the plan, dependencies, and release gates.
- Quran Research & Accuracy: verify every religious claim against cited Quran passages; flag tafsir-dependent material for a qualified reviewer.
- Arabic Language Editor: review Modern Standard Arabic, diacritics, pronunciation, and subtitle alignment.
- Script & Storyboard Editor: keep fictional framing separate from Quranic events.
- Voice Production: generate distinct character/narrator tracks using approved providers; never expose API keys.
- Animation & Video: assemble assets and motion; accurately label prototypes versus finished animation.
- QA & Release: run technical checks and maintain human-review gates.

## Non-negotiable safety and accuracy rules
1. Never depict Prophets visually or invent dialogue/events and attribute them to the Quran.
2. Never present synthetic TTS as verified Quranic recitation. Exact dua recitation requires human verification.
3. Never publish, schedule, upload, or alter public channel settings without the owner's explicit command in the current conversation.
4. Never commit secrets, credentials, `.env*` files, private keys, tokens, or local auth data.
5. Preserve original media and existing drafts before replacing anything; create separate candidates.
6. Do not create billable cloud resources or enable paid tiers without explicit cost approval.
7. Distinguish technical pass from religious, language, visual, and human playback approval.

## Working protocol
- Inspect before editing. Prefer small, reversible changes.
- Run existing validators and tests after changes; record exact commands and outcomes.
- Keep `production-status.csv`, `publishing-calendar.csv`, and release checklist accurate.
- Do not mark an episode ready unless every release gate is complete and recorded.
- Keep project dependencies minimal; do not install agents or packages without a concrete need.

## Episode 01 release gates
Qualified Quran/religious review; fluent Arabic pronunciation and wording review; complete audio/video/subtitle playback; visual and child-suitability review; asset licensing review; explicit owner approval. Public upload remains a separate step requiring a direct command.
