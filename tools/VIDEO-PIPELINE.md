# Local video assembly pipeline

This folder contains a lightweight local FFmpeg assembly script. It does not upload or publish anything.

## Requirements
- Node.js 20+ (Node 24 is fine)
- FFmpeg installed and available in PATH, or CapCut installed (the script can auto-detect its bundled FFmpeg)

## Add assets
1. Put at least two finished scene images in `assets/scenes/`, named in order, e.g. `scene-01.png`, `scene-02.png`.
2. Optional: add the approved Arabic voice track as `assets/audio/voiceover.wav`.
3. Optional: add reviewed subtitles at `episode-01-yunus/subtitles.srt`.
4. Make sure all religious text, narration, pronunciation, images, and subtitles have been reviewed before any public release.

## Render
From the project folder, run:
```cmd
node tools\build-video.mjs
```
Optional scene duration (seconds, 2–20):
```cmd
set SCENE_SECONDS=7
node tools\build-video.mjs
```
Output: `renders\episode-01-yunus-draft.mp4`.

## Automated technical QC
After rendering, run:
```cmd
node tools\automated-qc.mjs
```
The script checks that the animated test MP4 exists, contains video/audio/subtitle streams, has a duration between 60 and 90 seconds, and is larger than 1 MB. It writes `review\AUTOMATED-QC-ANIMATED.md`. A technical PASS does not approve the story or release.

## Current limitations
This is a basic slideshow assembler, not a full 3D animation engine. Motion, character consistency, sound design, narration, and thumbnail creation still require assets and review. Arabic pronunciation, Qur'anic wording, translation, subtitle readability, and full playback must be checked by people. YouTube publishing remains a separate, approval-gated step.
