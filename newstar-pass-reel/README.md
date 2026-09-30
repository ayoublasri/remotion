# Pass Njma Reel

A vertical 9:16 offer reel (1080 x 1920, 30 fps, 54.1 s) for the New Star Beauty (Wifak, Témara) morning and daytime offers,
sold as the "Pass Njma" (njma = star, after the salon's name and the sparkles in its logo). Built with Remotion, with its own
royalty-free soundtrack and sound effects. Every cut lands on a downbeat of the music.

| Bars  | Frames      | Scene    | What happens                                                                                                                                                                                                                               |
| ----- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1–2   | 0 – 112     | Hook     | "Un lissage à 649 DH ?" then "Oui. Ghir f sbah." over the sleek-hair photo while the music builds.                                                                                                                                         |
| 3–4   | 112 – 224   | Collab   | "En collaboration avec" the New Star Beauty logo, name and "Wifak · Témara", then "nous vous offrons le…".                                                                                                                                 |
| 5–7   | 224 – 392   | Title    | The drop: PASS NJMA over a rotating starburst, "Brillez comme une étoile", the Lissage / Ongles / Mar → Ven pills, the mysalon.ma footer, then a bar of hold.                                                                              |
| 8–12  | 392 – 672   | Lissage  | Window pill "MAR → VEN · 9h30 → 12h30", three cards stacking one per bar (short, mid-length, long hair icons), old price struck through, new price counting down, "−151 DH" callouts; two bars of hold with "Dernier rendez-vous à 12h30". |
| 13–17 | 672 – 952   | Ongles   | Window pill "MAR → VEN · 11h30 → 16h30", three cards with the nail photos: faux ongles + vernis permanent 80 DH, vernis permanent 60 DH, manucure + pédicure 140 DH; two bars of hold.                                                     |
| 18–20 | 952 – 1120  | Validity | "Ces prix sont valables UNIQUEMENT": M M J V light up on the beat, "Mardi → Vendredi", two clocks sweeping the lissage and ongles windows, "Dernier rendez-vous lissage : 12h30".                                                          |
| 21–24 | 1120 – 1344 | How      | "Comment en profiter ? C'est simple." Three steps, one per bar: write to us by DM (chat thread, Payer → Payé), receive the code (typed on a ticket, chime), book online (calendar slot on mysalon.ma); one bar of hold.                    |
| 25–26 | 1344 – 1456 | Code     | "Votre code reste valable 45 JOURS" with a ring drawing itself and the number counting up, "pour choisir votre créneau", the windows reminder.                                                                                             |
| 27–29 | 1456 – 1624 | CTA      | Second drop: logo, "RÉSERVEZ VOTRE PLACE MAINTENANT !", "Du mardi au vendredi", "Pour réserver, c'est par message :", a pulsing "Écrivez-nous en DM" button, the mysalon.ma footer, the conditions.                                        |

## Design

Palette from the salon logo: deep plum (`#3d1426`) and blush (`#ecd5ce`) with a rose accent. Dark plum scenes carry the
story beats (collab, validity, code); blush scenes carry the offers, the how-to and the invite. Headlines are set in Cinzel,
accents in Playfair Display italic, UI copy in Inter.

## Pictures

`public/images` holds generated photos supplied for the reel: `hair-sleek.jpg` (the hook, and blurred behind the lissage
cards), `nails-pink-almond.jpg`, `nails-red-gel.jpg` and `mani-pedi.jpg` (the three ongles cards; the pink set is also
blurred behind them). The lissage cards use a drawn hair-length icon (short, mid, long). Any card can switch between a
photo and a drawn icon: set `image` to a file name, or set it to `null` and pick a `hair` length or a `nail` illustration
(`almond`, `red`, `manipedi`, drawn in `src/components/NailIcons.tsx`).

## Remotion Elements used

The offer cards, the savings callouts, the counting prices and the 45-day counter are remixes of Remotion Elements
(`packages/docs/elements`): **Product Offer**, **Product Discount Callout** (pointer shape from `@remotion/shapes`
`makeCallout`) and **Number Counter**. The starburst is the Rotating Starburst idea redrawn with a CSS conic gradient.

## Run it

```bash
cd newstar-pass-reel
npm install
npm run dev      # Remotion Studio at http://localhost:3000
npm run render   # writes out/pass-reel.mp4
```

If Remotion cannot download Chrome Headless Shell in your environment:

```bash
npx remotion render PassReel out/pass-reel.mp4 --browser-executable=/path/to/chrome
```

## Music and sound effects

`public/music/pass-theme.mp3` is generated by `scripts/make-music.mjs`: an energetic pop / house groove in D minor at
128.57 BPM (exactly 14 frames per beat at 30 fps), 29 bars: quiet two-bar intro, kick-driven pre-drop groove with a snare
build under the collab scene, the drop on the title (bar 5), crashes on every section change, a lead melody over the
offer holds and the CTA, a second build under the 45-day scene and a second drop on the CTA (bar 27).
`public/sfx/*.wav` (whoosh, stamp, pop, tick, ding, success) come from `scripts/make-sfx.mjs`. Everything is synthesised
from scratch, so it is free to use anywhere.

```bash
npm run music                                   # regenerates public/music/pass-theme.wav
ffmpeg -i public/music/pass-theme.wav -codec:a libmp3lame -b:a 192k public/music/pass-theme.mp3
npm run sfx                                     # regenerates public/sfx/*.wav
```

To post with a trending sound instead, set `musicFile` to `null` in `src/Root.tsx` (or in the Studio props panel), render,
and add the audio in Instagram / TikTok. The cuts are 1.87 s apart (one bar at 128.57 BPM), so pick a track around 128 BPM
if you want them to stay on the beat. The sound effects stay in the file either way.

## Customize

All copy, prices, hours and photos are props on the `PassReel` composition (Studio props panel or `src/Root.tsx`):

- `site`, `logo` – the platform name shown in the footers and on the calendar, and the salon logo file in `public/images`.
- `hook.image / line1 / line2`, `collab.intro / name / nameLine2 / city / outro`, `title.*`.
- `lissage` and `ongles` – one section each: `label`, `window` pill, `footer` pill, `backdrop` photo, and three `offers`
  (`image` photo, or `hair` / `nail` icon, `focusX/focusY/zoom`, `title`, `subtitle`, `oldPrice`, `newPrice`, `callout`); `backdrop` may be `null` for a soft gradient.
- `validity.*` – intro, "UNIQUEMENT", the days line, `activeDays` (indexes into L M M J V S D), two `rows` (label, hours
  text, `fromHour/toHour` for the clock), the note.
- `how.*`, `code.*`, `cta.*` – the how-to steps, the 45-day beat and the invite (`\n` in `cta.conditions` breaks the line).
- `musicFile` – audio file inside `public/`, or `null`.

Scenes are whole bars (56 frames) long; keep that grid if you re-order them so the cuts stay on the beat.
Each scene is also registered under the `PassReel-Scenes` folder in Studio.

## Notes

- Key text stays inside the Instagram / TikTok safe area (nothing important above y = 140 or below y = 1500).
- Fonts (Cinzel, Playfair Display, Inter) are bundled under the SIL Open Font License in `public/fonts`.
- The project lives outside `packages/` on purpose so the monorepo's Bun workspace does not pick it up; it uses the published
  `remotion@4.0.522` packages and plain `npm`.
