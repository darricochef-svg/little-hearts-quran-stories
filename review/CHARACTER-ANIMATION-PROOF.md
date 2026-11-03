# Character Animation Proof — Technical Notes

Date: 2026-10-30

## Rendered artifact
- Video: renders/character-animation-proof.mp4
- Duration: 3 seconds
- Source: 90 generated PPM frames at 30 fps
- Rendering: CapCut-bundled FFmpeg
- Frame preview: review/character-animation-proof.jpg

## What is demonstrated
- Frame-by-frame raster animation rather than a single still image.
- Nour has small vertical body movement and alternating mouth-open/mouth-closed shapes.
- Zuzu has body bobbing, alternating beak/mouth shapes and a moving wing.

## What is not yet demonstrated
- Mouth motion is periodic and NOT driven by speech phonemes or measured dialogue timing.
- Both characters do not yet have distinct recorded voices.
- The current source TTS script generates all ten lines through one Arabic voice; it does not separate speaker identities.
- No reusable skeletal/rigged character system exists yet.
- The proof art is intentionally primitive and is not final channel artwork.
- No episode has been re-rendered using this proof.

## Next engineering milestones
1. Separate host dialogue from narrator lines in the script and audio assets.
2. Generate or record distinct Arabic host voices and keep narrator voice separate.
3. Measure speech timing for each dialogue clip and create mouth-open/closed timing driven by speech activity; later upgrade to phoneme/viseme alignment.
4. Build reusable character rigs with body, head, eyes, mouth, ears/wings as separate animated layers.
5. Animate a complete 10–15 second host exchange and review it before integrating into Episode 01.
6. Only after host animation is accepted, create story-scene animation using symbolic visuals and no prophet depiction.

## Release gate
Prototype only. Not publication-ready. Arabic pronunciation, script, Quranic source accuracy, visual quality, child suitability and human playback review remain outstanding. No upload or public channel changes made.
