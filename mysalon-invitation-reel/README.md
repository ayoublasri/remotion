# MySalon.ma Invitation Reel: Sara's story

A 45-second vertical reel (1080 x 1920, 30 fps) for salon owners, built from the 10-second AI-generated MySalon.ma
ad (`assets/source.mp4`). Instead of a montage, it tells one story with names, days and actions, slowly enough to
follow, so a scroller understands the product without reading a word of explanation:

| Time    | Chip                              | What happens                                                                                                                                                                         |
| ------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0–5 s   | LUNDI · 23:14                     | The DMs pile up on the salon counter. **Sara, nail artist à Témara.** 47 DM ce soir. Elle n'a pas encore dîné.                                                                       |
| 5–12 s  | LUNDI · 23:16                     | On a frozen frame of the ad, the messages keep arriving with names (Nada, Imane, Salma, Hajar) and the unread badge climbs. Sara répond à tout, entre deux clientes. Tous les soirs. |
| 12–17 s | MARDI                             | Sara installe MySalon : un lien dans sa bio, un QR sur le comptoir.                                                                                                                  |
| 17–25 s | JEUDI · 14:02                     | Nada ouvre le lien de Sara, picks manucure russe, samedi 11:00. Confirmé. Sara est en pleine pose.                                                                                   |
| 25–29 s | JEUDI · 14:03                     | Sara's phone gets the booking notification. Sara n'a rien eu à faire. 0 DM échangé.                                                                                                  |
| 29–34 s | CETTE SEMAINE                     | The agenda fills on the tablet while a counter climbs to +12 réservations.                                                                                                           |
| 34–39 s | VENDREDI · 20:00 → SAMEDI · 11:00 | Rappel WhatsApp envoyé à Nada, automatiquement. Nada arrive, +1 point fidélité.                                                                                                      |
| 39–45 s | UN MOIS PLUS TARD                 | **Sara : 0 DM le soir. Agenda plein.** Then MySalon.ma, Fait au Maroc, 0 commission · 0 paiement en ligne, **DM « INVITATION »**, mysalon.ma.                                        |

The ad's shots are slowed down (from a 60 fps motion-interpolated copy) and held on a frame wherever the story
needs time, so nothing stutters and every caption stays two to four seconds; the two built scenes grow out of frozen
frames of the footage, so the whole thing feels like one film. Every caption, chip and counter sits inside the
Instagram safe area (`src/layout.ts`). Sound: dings for the DMs, pops for each message, a chime for the confirmed
booking, ticks for the bookings, a whoosh on each cut. No music: add a trending sound in the Instagram editor
(`npm run render:silent` renders without the effects too).

## Run it

```bash
cd mysalon-invitation-reel
npm install
npm run prep           # assets/source.mp4 -> public/video/source-60.mp4 + two frozen frames (needs ffmpeg)
npm run dev            # Remotion Studio at http://localhost:3000
npm run render         # -> out/mysalon-invitation-reel.mp4 (with sound effects)
npm run render:silent  # -> out/mysalon-invitation-reel-silent.mp4
npm run cover          # the hook frame -> out/cover-hook.png
npm run cover:end      # the end card -> out/cover-end.png
```

`npm run prep` motion-interpolates the 24 fps ad to 60 fps and scales it to 1080 x 1920 with ffmpeg's
`minterpolate`, then extracts the two frozen frames the built scenes use. It uses the `ffmpeg` on your PATH, or the
one shipped with Remotion (which then only scales).

If Remotion cannot download Chrome Headless Shell in your environment:

```bash
npx remotion render InvitationReel out/mysalon-invitation-reel.mp4 --browser-executable=/path/to/chrome
```

## Editing

The story is a list of scenes in `src/Root.tsx`, validated by `src/schema.ts` and editable in the Studio's props
panel. Four kinds: `shot` (keyframes mapping frames of the scene to seconds of the ad, held where two keys share a
second, plus an optional booking counter), `messages` (the message stack with names on a frozen frame),
`notification` (the booking notification on a frozen frame) and `end` (the result lines, then the brand and the
call to action). Every scene carries its day chips, its captions (frames, lines, `*highlighted*` words, size) and
its sounds. The reel's length follows the scenes. Colours are in `src/theme.ts`; fonts (Inter, Playfair Display)
are bundled in `public/fonts`; the sound effects in `public/sfx` are synthesised and free to use.
