# MySalon.ma Invitation Reel: the ad video, cut to go viral

A 17-second vertical reel (1080 x 1920, 30 fps) for salon owners, built from the 10-second AI-generated MySalon.ma ad
(`assets/source.mp4`). The ad's shots are 0.5 to 2 seconds each, too fast to read, so every shot is slowed down
(smoothly, from a 60 fps motion-interpolated copy), captioned with one idea at a time, and the end card is rebuilt
crisp: **DM « INVITATION »**.

| Time      | Shot (source)      | Caption                                                                                              |
| --------- | ------------------ | ---------------------------------------------------------------------------------------------------- |
| 0–3.5 s   | DMs piling up      | **Tes clientes réservent encore par DM ?**                                                           |
| 3.5–4.5   | Instagram profile  | Un lien dans ta bio.                                                                                 |
| 4.5–5.5   | QR stand           | Un QR sur ton comptoir.                                                                              |
| 5.5–8.3   | A client books     | Elle réserve seule. · Samedi 11:00 Confirmé, sans toi.                                               |
| 8.3–11.4  | The agenda fills   | Ton agenda se remplit tout seul.                                                                     |
| 11.4–13.4 | Reminders, loyalty | Rappels WhatsApp. Fidélité automatique.                                                              |
| 13.1–17.1 | End card           | MySalon.ma · Fait au Maroc · 0 commission · 0 paiement en ligne · **DM « INVITATION »** · mysalon.ma |

Every caption sits inside the Instagram safe area (`src/layout.ts`): below the header, above the caption block and
left of the icon column. The cuts get a white flash and a whoosh; the DMs ding, the booking confirms with a chime,
the agenda ticks as it fills. There is no music: add a trending sound in the Instagram editor (`npm run
render:silent` renders without the effects too).

## Run it

```bash
cd mysalon-invitation-reel
npm install
npm run prep           # assets/source.mp4 -> public/video/source-60.mp4 (needs ffmpeg; a few minutes)
npm run dev            # Remotion Studio at http://localhost:3000
npm run render         # -> out/mysalon-invitation-reel.mp4 (with sound effects)
npm run render:silent  # -> out/mysalon-invitation-reel-silent.mp4
npm run cover          # the hook frame -> out/cover-hook.png
npm run cover:end      # the end card -> out/cover-end.png
```

`npm run prep` motion-interpolates the 24 fps ad to 60 fps and scales it to 1080 x 1920 with ffmpeg's
`minterpolate`, so the slowed-down shots do not stutter. It uses the `ffmpeg` on your PATH, or the one shipped with
Remotion (which then only scales).

If Remotion cannot download Chrome Headless Shell in your environment:

```bash
npx remotion render InvitationReel out/mysalon-invitation-reel.mp4 --browser-executable=/path/to/chrome
```

## Editing

Everything is a prop validated by a Zod schema (`src/schema.ts`), with defaults in `src/Root.tsx`, editable in the
Studio's props panel: the shots (`from` / `to` in seconds of the source, `rate` for the slow-down, the captions with
their frames and `*highlighted*` words, the sounds), the end card and `sfx`. The reel's length follows the shots.
Colours are in `src/theme.ts`. Fonts (Inter, Playfair Display) are bundled in `public/fonts`; the sound effects in
`public/sfx` are synthesised and free to use.
