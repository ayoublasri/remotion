# Nail Reel

A vertical 9:16 reel (1080 x 1920, 30 fps, ~13 s) built with Remotion from three nail photos.
It is structured the way short-form video that performs well usually is:

| Frames    | Scene  | What happens                                                                                                                 |
| --------- | ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| 0 – 66    | Hook   | Shutter flash, hard punch-in on the hero photo, three-line save-bait hook pops in ("SAVE THIS / for your next / NAIL APPT"). |
| 66 – 156  | Set 01 | Slow Ken Burns zoom, glossy shine sweep, sparkles, outlined number, title card with tags.                                    |
| 156 – 246 | Set 02 | Same layout, accent color swaps to match the set.                                                                            |
| 246 – 336 | Set 03 | Same layout.                                                                                                                 |
| 336 – 402 | Outro  | Photos fan out as polaroids, "which one? comment 1, 2 or 3" (comment bait) plus handle and follow line.                      |

Every cut is a `pushCut()` transition from `@remotion/transitions` (punch-in + 2-frame flash).

## Run it

```bash
cd nail-reel
npm install
npm run dev      # opens Remotion Studio at http://localhost:3000
npm run render   # writes out/nail-reel.mp4
```

If Remotion cannot download Chrome Headless Shell in your environment, point it at any Chromium build:

```bash
npx remotion render NailReel out/nail-reel.mp4 --browser-executable=/path/to/chrome
```

## Customize

All copy, colors and photo framing are props on the `NailReel` composition.
Edit them in the Studio props panel (right sidebar) or in `src/Root.tsx`:

- `handle` – the chip shown top-right and in the outro footer.
- `hook.top / middle / bottom` – the three hook lines.
- `sets[]` – one entry per photo:
  - `image` – file name inside `public/images/`.
  - `title`, `subtitle`, `tags` – title card copy.
  - `accent` – color for the bar, subtitle and badge.
  - `focusX` – horizontal focus point (0–100 %) used to crop the photo to 9:16.
  - `sparkles` – `{x, y}` positions (% of the frame) for the twinkles. Put them on the glossiest nails.
- `outro.title / cta / footer` – closing copy.
- `musicFile` – `null` by default. Drop an audio file into `public/` and set e.g. `"music.mp3"` to bake a track in (it fades in and out automatically). If you plan to use a trending sound, leave this `null` and add the audio inside Instagram or TikTok — that is what feeds the trend algorithm.

Scene durations are literal values in `src/NailReel.tsx`; if you change them, update `durationInFrames` in `src/Root.tsx` (total = sum of scenes minus 6 frames per transition).

The individual scenes are also registered under the `NailReel-Scenes` folder in Studio so you can tune each one in isolation.

## Swap in new photos

1. Put the photo into `public/images/`.
2. Point a set's `image` at it and adjust `focusX` until the nails sit inside the vertical crop.
3. Move the `sparkles` onto the nails.

Key text stays inside the Instagram / TikTok safe area (nothing important above y = 220 or below y = 1500 on the 1920 px canvas), so the app UI does not cover it.

## Layout of this folder

This project intentionally lives outside `packages/` so it is not picked up by the monorepo's Bun workspace.
It depends on the published `remotion@4.0.522` packages (the same version as this repository) and installs with plain `npm`.

Fonts (Anton, Playfair Display, Inter) are bundled in `public/fonts` under the SIL Open Font License so the reel renders offline.
