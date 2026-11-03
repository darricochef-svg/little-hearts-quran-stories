# Talking-character dialogue prototype

- Render: `renders/dialogue-animation-prototype.mp4`
- Audio: original Arabic clips 02a and 02b, separated by 250 ms.
- Character assignment: Zuzu speaks first; Nour answers second.
- Mouth movement: three amplitude bands (closed / small / open) are driven by 10 ms PCM RMS windows from the corresponding speaker clip; not a fixed periodic loop.
- Listener: the non-speaking character receives a simple reaction movement; both characters have basic blink timing.
- Frame rate: 30 fps; raster animation; embedded AAC audio.

## Limitations
- Both clips still use the same TTS voice; distinct character voices are not solved.
- Amplitude-based three-state mouth timing is a prototype, not phoneme/viseme lip-sync. Arabic phoneme alignment, co-articulation and expressive facial animation remain future work.
- Artwork remains a simple engineering placeholder, not final channel-quality character design.
- Human review of pronunciation, religious accuracy, timing and visual quality is still required.
