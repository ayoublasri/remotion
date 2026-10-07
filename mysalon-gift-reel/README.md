# MySalon.ma Gift Card Reel: offer OYA MUSE

A 36-second vertical reel (1080 x 1920, 30 fps): **Offrez une expérience beauté chez OYA MUSE.** The treatments to
offer, photographed big and clear (manucure russe, lash lift, brow lift), then how it works: you write "CADEAU" to
MySalon.ma, choose the treatment and pay in the chat; the person you choose receives a digital gift card on her phone
and books when she likes. Built with Remotion, with its own club-style soundtrack and sound effects; every cut lands
on the beat and the reel loops.

## How the two brands share the reel

- **OYA MUSE is what you offer.** It is in the headline ("Offrez une expérience beauté chez OYA MUSE"), on the gift
  card, in the photos of its treatments and next to the call to action. The reel sells the salon.
- **MySalon.ma is how you offer it.** It owns the DM, the payment, the digital gift card and the booking, so the
  messages come to MySalon.ma ("Écrivez « CADEAU » en DM"), not to the salon.
- **One set of props switches the salon.** `partner` (name, city, logo, services), `services.items` and
  `how.options` drive the headline, the card, the photos, the chat and the signature, so the same reel can be
  re-rendered for another salon.

| Bars  | Time    | Scene    | What happens                                                                                                                                                                                                                                             |
| ----- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1–2   | 0–4 s   | Hook     | Frame 0 already reads **"ARRÊTE D'OFFRIR… des fleurs"**, under the MySalon.ma wordmark. Perfume and chocolates join and all three get struck through, then "Cette fois, offrez mieux." over a build and a beat of silence.                               |
| 3–5   | 4–10 s  | Reveal   | The drop: **"Offrez une expérience beauté CHEZ OYA MUSE"**, "Témara · ongles · cils · sourcils", "via MySalon.ma". A gift box bursts open and the digital gift card floats out, its name rewritten every second (Maman, Ma chérie, Ma best, Ma femme).   |
| 6–11  | 10–22 s | Services | The treatments to offer, four seconds each, the photo big and clear under the salon's name: **01 · ONGLES Manucure russe** (two of OYA MUSE's photos, a bar each), **02 · CILS Lash lift**, **03 · SOURCILS Brow lift**, each with its detail and price. |
| 12–15 | 22–30 s | How      | Two four-second steps on two phones: 1. "Écrivez « CADEAU » en DM" (pick the treatment in the chat, pay), 2. "Elle reçoit sa carte cadeau" (notification, then the digital card on her phone; she books when she likes).                                 |
| 16–18 | 30–36 s | CTA      | Second drop. MySalon.ma, the card, **"OFFREZ UNE EXPÉRIENCE BEAUTÉ" chez OYA MUSE · Témara**, "Pour offrir, c'est par message :", the "Écrivez « CADEAU » en DM" button, and "Vous en rêvez ? Envoyez ce reel à qui doit vous l'offrir."                 |

## Built to be watched and shared

- The first frame is the hook, readable before anyone scrolls; the payoff lands on the drop at 4 s.
- One idea per screen, each held long enough to read; every treatment and every how-to step gets four seconds.
- The photos are the hero: full-bleed with a slow push-in for the salon's own photos, a large framed card over a
  blurred fill for the small ones; the captions sit bottom-left, clear of the Instagram buttons.
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
npm run cover        # grid cover (the gift card) -> out/cover-card.png
npm run cover:soin   # alternative cover (manucure russe) -> out/cover-soin.png
npm run cover:hook   # alternative cover (the hook) -> out/cover-hook.png
```

If Remotion cannot download Chrome Headless Shell in your environment:

```bash
npx remotion render GiftReel out/mysalon-gift-reel.mp4 --browser-executable=/path/to/chrome
```

Each scene is also registered on its own under the `GiftReel-Scenes` folder in the Studio.

## Editing

All copy, names, photos, prices, the DM keyword and the chat options are props validated by a Zod schema
(`src/schema.ts`), with defaults in `src/Root.tsx`, so they can be changed in the Studio's props panel. The
treatments are `services.items`: each has a category, a name, a detail, a price (leave it empty to hide the tag),
one or two photos (one is held for four seconds, two get two seconds each) and `framed` for small photos. The names
written on the card are `reveal.names`. Photos live in `public/images`; the nails photos are OYA MUSE's, the lash and
brow photos are generated ones, shown framed.

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
  and high-pass sweep build into the first drop (the reveal), the groove keeps rolling under the photos with the lead
  and the vocal chops answering each other a bar at a time, a lighter groove with stabs and plucks leaves room for the
  phone sounds, a second build with a stutter leads into the last drop (the call to action), a beat of silence precedes
  each drop, and a record stop ends the loop.
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
