# MySalon.ma Gift Card Reel, featuring OYA MUSE

A 36-second vertical reel (1080 x 1920, 30 fps): **Offrir une expérience beauté n'a jamais été aussi simple.** You
write "CADEAU" to MySalon.ma, choose the treatment and pay in the chat; the person you choose receives a digital gift
card on her phone and books when she likes, at one of the partner salons in Témara. Built with Remotion, with its own
club-style soundtrack and sound effects; every cut lands on the beat and the reel loops.

## How the two brands share the reel

- **MySalon.ma is the hero.** It owns the message ("Offrir une expérience beauté n'a jamais été aussi simple"), the
  digital gift card, the DM, the payment, the booking and the call to action. People book a salon, not a platform, so
  the platform shows what you can offer.
- **OYA MUSE is the featured salon ("à la une").** It is the concrete thing to want: on the card, in the photos, in the
  booking screen and next to the call to action. "À Témara, dans l'un de nos salons partenaires" shows the partner
  salons with OYA MUSE highlighted, so the platform story stays true and the sale still goes to OYA MUSE.
- **One prop switches the featured salon.** `partner` (name, city, logo, services) and `where.shots` drive the card,
  the photos, the booking screen and the signature, so the same reel can be re-rendered for another partner.

| Bars  | Time    | Scene  | What happens                                                                                                                                                                                                                                             |
| ----- | ------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1–2   | 0–4 s   | Hook   | Frame 0 already reads **"ARRÊTE D'OFFRIR… des fleurs"**, under the MySalon.ma wordmark. Perfume and chocolates join and all three get struck through, then "Cette fois, offrez mieux." over a build and a beat of silence.                               |
| 3–5   | 4–10 s  | Reveal | The drop: **"Offrir une expérience beauté N'A JAMAIS ÉTÉ AUSSI SIMPLE"**, "avec MySalon.ma". A gift box bursts open and the digital gift card floats out, its name rewritten every second (Maman, Ma chérie, Ma best, Ma femme): "Pour qui vous voulez." |
| 6–8   | 10–16 s | Where  | "À Témara, dans l'un de nos salons partenaires": the partner salons, OYA MUSE highlighted "✦ À LA UNE", then its treatments in slow photo cuts (ONGLES, CILS, SOURCILS) under its name.                                                                  |
| 9–14  | 16–28 s | How    | Three four-second steps on two phones: 1. "Choisissez le soin" (write CADEAU, pick the treatment in the chat, pay), 2. "Elle reçoit sa carte cadeau" (notification, then the digital card on her phone), 3. "Elle réserve quand elle veut" (confirmed).  |
| 15–18 | 28–36 s | CTA    | Second drop. MySalon.ma, the card, **"OFFREZ UNE EXPÉRIENCE BEAUTÉ"**, "Pour offrir, c'est par message :", the "Écrivez « CADEAU » en DM" button, "À LA UNE OYA MUSE · Témara", and "Vous en rêvez ? Envoyez ce reel à qui doit vous l'offrir."          |

## Built to be watched and shared

- The first frame is the hook, readable before anyone scrolls; the payoff lands on the drop at 4 s.
- One idea per screen, each held long enough to read; the how-to gives four seconds to each step.
- The name on the card changes every second, so every viewer, man or woman, sees their person.
- Two-sided ending: those who want to offer get a one-word action (DM "CADEAU"); those who dream of it are asked to
  send the reel to the person who should offer it.
- The music stops like a record at the end and flows straight back into "ARRÊTE", so the reel loops.

Ready-to-post caption, hashtags, pinned comment, DM auto-reply and launch tips: see [POSTING.md](POSTING.md).

## Run it

```bash
cd mysalon-gift-reel
npm install
npm run dev          # Remotion Studio at http://localhost:3000
npm run render       # -> out/mysalon-gift-reel.mp4
npm run cover        # grid cover (gift card) -> out/cover-card.png
npm run cover:hook   # alternative cover (hook) -> out/cover-hook.png
```

If Remotion cannot download Chrome Headless Shell in your environment:

```bash
npx remotion render GiftReel out/mysalon-gift-reel.mp4 --browser-executable=/path/to/chrome
```

Each scene is also registered on its own under the `GiftReel-Scenes` folder in the Studio.

## Editing

All copy, names, photos, the salons, the DM keyword and the booking details are props validated by a Zod schema
(`src/schema.ts`), with defaults in `src/Root.tsx`, so they can be changed in the Studio's props panel. The partner
salons shown in the "À Témara" scene are `where.salons`; the featured one is `partner`. The names written on the card
are `reveal.names`. Photos live in `public/images`; the brow and lash photos are generated ones, the nails photos are
OYA MUSE's.

Colours are in `src/theme.ts` (emerald, champagne gold and ivory). Scene lengths are in `src/GiftReel.tsx`
(`SCENES`): each length includes the overlap with the next scene, so that every scene starts on a bar line of the
soundtrack. The transitions (star wipe, blur zoom, iris) are in `src/components/transitions.tsx` and use plain CSS, no
WebGL.

## Music and sound effects

`public/music/gift-theme.mp3` is generated by `scripts/make-music.mjs` and produced like a club record: a catchy,
energetic house track at 120 BPM (exactly 15 frames per beat and 60 frames per bar at 30 fps) in A minor
(Am7 - Fmaj7 - Cadd9 - G6), 18 bars long.

- **Sound:** a layered kick tuned to A, clap with a snare body, 808-style metallic hats with swing, shaker, congas,
  rims and a ride on the last drop; a rolling tech-house bass; pumping supersaw chords and house stabs; the hook as a
  bright pluck lead doubled by formant "vocal chops".
- **Arrangement, cut like a DJ edit:** the groove hits on the first frame with the music filtered, a snare roll, riser
  and high-pass sweep build into the first drop (the reveal), the groove keeps rolling under the salon and its photos, a
  lighter groove with stabs and plucks leaves room for the phone sounds (the vocals come back halfway), a second build
  with a stutter leads into the last drop (the call to action), a beat of silence precedes each drop, and a record stop
  ends the loop.
- **Mix and master:** sidechain pumping, the music high-passed above the kick and bass, mono low end, ping-pong delay
  and reverb, an air shelf, a soft clipper and a lookahead limiter.

`public/sfx/*.wav` (pop, strike, sparkle, tick, ding, whoosh, stamp, success) come from `scripts/make-sfx.mjs`.
Everything is synthesised from scratch, so it is free to use anywhere.

```bash
npm run music   # -> public/music/gift-theme.wav
npm run sfx     # -> public/sfx/*.wav
ffmpeg -i public/music/gift-theme.wav -b:a 192k public/music/gift-theme.mp3
```

## Fonts

Cinzel, Playfair Display, Inter and Great Vibes are bundled in `public/fonts` (SIL Open Font License, see the
`LICENSE-*.txt` files), so the reel renders offline.
