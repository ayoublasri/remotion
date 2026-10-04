# MySalon.ma Gift Card Reel

A 33 s vertical reel (1080 x 1920, 30 fps) for MySalon.ma: **offer someone special a beauty moment**. You write to
MySalon.ma, the person you choose receives a code and books the treatment you offered on mysalon.ma. The treatments
featured are those of the partner salon, OYA MUSE in Témara. Built with Remotion in the MySalon.ma brand (deep teal,
raspberry, warm off-white, Playfair Display and Inter), with its own royalty-free soundtrack and sound effects. Every
scene starts on a downbeat.

| Bars  | Frames    | Scene    | What happens                                                                                                                                                                                                                                                                              |
| ----- | --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1–2   | 0 – 120   | Hook     | Deep teal, MySalon.ma wordmark. "Des fleurs ? Un parfum ? Des chocolats ?" with line icons drawing themselves, then all three get struck through: "Cette fois, _offrez un vrai moment._"                                                                                                  |
| 3–5   | 120 – 300 | Reveal   | The drop, through an eight-pointed star wipe (the MySalon.ma mark). A teal gift box with a raspberry satin ribbon wiggles, the lid pops in a burst of confetti, and a MySalon.ma gift card, "Un moment beauté chez OYA MUSE · Témara", floats out while "Maman" is written on it by hand. |
| 6–7   | 300 – 420 | For whom | Blur zoom into deep teal. "POUR…" Votre sœur, Votre meilleure amie, Votre chérie, handwritten one after the other, then "…ou juste _parce que._"                                                                                                                                          |
| 8–9   | 420 – 540 | Offer    | A raspberry satin ribbon sweeps across. "Chez OYA MUSE · Témara: Choisissez le soin à offrir": ONGLES, CILS, SOURCILS as an elegant menu with photos. "Le cadeau qui fait vraiment plaisir."                                                                                              |
| 10–13 | 540 – 780 | How      | "Comment ça marche ?" on two phones. 1. You write to MySalon.ma in DM and pay (Payer → Payé, "Code envoyé à votre sœur"). 2. She gets the gift and its code on her lock screen. 3. She enters the code on mysalon.ma at OYA MUSE, picks a slot, "Rendez-vous confirmé".                   |
| 14–16 | 780 – 990 | CTA      | Second drop, through an iris. MySalon.ma, the gift card "pour quelqu'un de spécial", "OFFREZ UN MOMENT BEAUTÉ", "Soins chez OYA MUSE · Témara", "Pour offrir, c'est par message :" and a pulsing raspberry "Écrivez-nous en DM" button, "✦ mysalon.ma". The last chord rings out.         |

## Why it works

- **MySalon.ma is the brand, OYA MUSE is the treat.** The platform owns the look, the gift card and the call to action;
  the partner salon appears wherever the viewer asks "where?": on the card, above the menu, in the booking screen and
  under the headline of the CTA.
- **A hook everyone recognises.** Flowers, perfume, chocolates: the usual gifts, crossed out in three beats.
- **The gift is the hero.** A box opens and a real-looking gift card comes out with a name being written on it, so the
  offer is understood before any explanation.
- **Emotion, then clarity.** The "pour…" names make it personal, the menu shows what can be offered, and the two phones
  show exactly how it works, from the DM to the confirmed appointment.
- **One ask.** Everything leads to "Écrivez-nous en DM" on the MySalon.ma account; mysalon.ma is the only footer.

## Run it

```bash
cd mysalon-gift-reel
npm install
npm run dev      # Remotion Studio at http://localhost:3000
npm run render   # -> out/mysalon-gift-reel.mp4
npm run still    # cover image -> out/cover.png (frame 250)
```

If Remotion cannot download Chrome Headless Shell in your environment:

```bash
npx remotion render GiftReel out/mysalon-gift-reel.mp4 --browser-executable=/path/to/chrome
```

Each scene is also registered on its own under the `GiftReel-Scenes` folder in the Studio.

## Editing

All copy, names, photos, the partner salon, the code and the booking details are props validated by a Zod schema
(`src/schema.ts`), with defaults in `src/Root.tsx`, so they can be changed in the Studio's props panel. To feature
another partner salon, change `partner` (name, city, logo, services), the `card.partnerLine`, the `offer` services and
the `cta.partnerLabel`. Photos live in `public/images`; the brow and lash photos are generated ones, the nails photos
are OYA MUSE's.

Colours are in `src/theme.ts`. Scene lengths are in `src/GiftReel.tsx` (`SCENES`): each length includes the overlap
with the next scene, so that every scene starts on a bar line of the soundtrack. The transitions (star wipe, blur zoom,
ribbon wipe, iris) are in `src/components/transitions.tsx` and use plain CSS, no WebGL.

## Music and sound effects

`public/music/gift-theme.mp3` is generated by `scripts/make-music.mjs`: a warm, elegant lounge-house groove at 120 BPM
(exactly 15 frames per beat and 60 frames per bar at 30 fps) in F major: a music box over a heartbeat for the hook, the
drop on the reveal, harp arpeggios for "pour…", a Rhodes melody over the offer, a lighter groove with a build under the
how-to, and a second drop with the melody on the call to action. Crashes and impacts land on the scene changes.
`public/sfx/*.wav` (pop, strike, sparkle, tick, ding, whoosh, stamp, success) come from `scripts/make-sfx.mjs`.
Everything is synthesised from scratch, so it is free to use anywhere.

```bash
npm run music   # -> public/music/gift-theme.wav
npm run sfx     # -> public/sfx/*.wav
ffmpeg -i public/music/gift-theme.wav -b:a 192k public/music/gift-theme.mp3
```

## Fonts

Playfair Display, Inter and Great Vibes are bundled in `public/fonts` (SIL Open Font License, see the `LICENSE-*.txt`
files), so the reel renders offline.
