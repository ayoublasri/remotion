# OYA MUSE · nails by Safae — the reel

A silent 28.8 s Instagram reel (1080 × 1920, 30 fps) for the OYA MUSE salon in
Témara, made from six photos of one manicure by Safae (@nailrio_bysafae),
built with Remotion as one continuous take.

```bash
npm ci
npm run dev            # Remotion Studio
npm run render         # out/oyamuse-nails-reel.mp4 (no audio track)
npm run render:track   # the same file with a silent AAC track, for uploaders that want one
npm run cover          # out/cover-after.png, frame 330: the "Après" print
npm run cover:end      # out/cover-end.png, frame 840: the call to action
npm run lint
```

## The film

Six photos as five prints on an ivory table. A fingertip brings each one in,
pushes it aside for the next, flips the "before" over to its "after", and
the camera pulls back to show the whole table before the prints gather into
the salon's mark and one call to action. No music (post with the original
silence or a trending sound), no caption pills, no cut: every boundary is
carried by a print that stays on the table or by the hand that moved it.

### The three concepts considered

- **A · Le trait.** One brush stroke of polish is the whole film: it paints
  across the frame revealing the after over the before, underlines the words
  and ends as the line under « Lien en bio ». Carry: the stroke. Rules out
  seeing whole photos at rest for long.
- **B · La loupe.** One circular lens travels over the photos, opening on a
  detail (the ring, one nail) and pulling back to the whole hand, jumping
  from photo to photo as a continuous iris. Carry: the lens. Needs sharper
  sources than phone screenshots.
- **C · L'album (chosen).** The photos are prints on a table; the hand slides
  each one in, flips the before to the after, the table is revealed, the
  prints fold into the mark. Carry: the hand and the prints. Rules out
  full-bleed photos. Look: ivory paper, emerald and champagne gold (the
  salon's palette), Cinzel for the name.

C was picked because the brief is "people should have time to see clearly":
a print at rest on a plain ground is the most legible way to show a photo,
the before/after flip is a transformation the viewer watches happen rather
than a cut, and the table view at the end shows the whole body of work in
one frame before the call to action.

### Beat sheet

| t | beat | what moves | what is still | what carries |
| --- | --- | --- | --- | --- |
| 0.0–0.4 | the hero print drops onto the table | the print | the ground | |
| 0.4–2.6 | hold; the eyebrow « OYA MUSE » fades in at the top | nothing | everything | the print |
| 2.6–3.75 | the finger pushes the hero to the top left; flicks the « Préparation » print up from below | hand, two prints | the ground | the hand, the hero (stays on the table) |
| 3.75–5.95 | hold on the gloved hand and the bare nails | nothing | everything | |
| 5.95–7.05 | push the prep print top right; flick the « Avant » print up | hand, two prints | | the hand, the parked prints |
| 7.05–9.25 | hold on the before | nothing | everything | |
| 9.25–10.05 | the finger taps the edge: the print flips to its back, the « Après » | the flip | the table | the same print |
| 10.05–12.85 | hold on the after (2.8 s) | nothing | everything | |
| 12.85–13.95 | push the after print bottom left; flick the close-up in from the right | hand, two prints | | the hand |
| 13.95–16.5 | hold on the close-up, a slow push-in from 15.2 | the camera | the print | |
| 16.5–17.6 | push the close-up bottom right; flick the pair in from the left; the camera settles | hand, prints, camera | | the hand |
| 17.6–20.0 | hold on the pair | nothing | everything | |
| 20.0–20.8 | the camera pulls back to the whole table | the camera | the prints | all five prints |
| 20.8–21.8 | hold on the table | nothing | everything | |
| 21.8–22.8 | the prints gather on arcs into one point; the eyebrow travels down and grows into the mark | prints, the lockup, the camera | | the prints → the mark, the eyebrow → the lockup |
| 22.8–25.3 | « Nails by Safae », « Réserve ton expérience nails », « Lien en bio ↓ », the address | type rising | the mark | |
| 25.8–28.8 | dead still on the call to action | nothing | everything | |

Rhythm: 0.45 s pushes next to 2.8 s holds; about 14 s of the 28.8 are dead
still, in eight rests. Fast moves (the flicks, the flip, the pull-out, the
gather) are rendered under a 180° shutter, so they smear instead of stepping.

### Built from

- `public/photos/`: the six photos, cut out of the phone screenshots with
  ffmpeg (the Instagram header, counters and buttons removed, the baked
  « Before : » / « After: » labels painted over, upscaled once with Lanczos).
- `src/film/beats.json`: every time in seconds.
- `src/film/motion.ts`: the pure-function move library (springs, impact,
  press, pops, rises, hop, gather, shake, keyed camera, paths).
- `src/film/stage.ts`: the layout, the parked poses, the hand's path and
  presses, the camera keys and the rests.
- `src/film/Prints.tsx`: a print is paper with a border and a shadow around
  a cover-fitted photo; the before/after print has two faces and flips in 3D.
- `src/film/Hand.tsx`, `src/film/Screen.tsx` (the eyebrow that becomes the
  lockup, the call to action), `src/film/Shutter.tsx`.
- Brand files shared with the gift reel: `src/theme.ts` (ivory, emerald,
  gold foil), `src/components/Logo.tsx` (the round badge), fonts.

## Safe area

Text and the call to action stay inside Instagram's safe area (`src/layout.ts`):
x 110–970, y 290–1450, and x ≤ 870 in the action-icon band from y 950. The
prints are sized so the hands never sit under the icons; parked prints may
touch the edges, as paper on a table does.
