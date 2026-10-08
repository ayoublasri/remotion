# MySalon.ma Gift Card Reel: offer OYA MUSE

A 36-second vertical reel (1080 x 1920, 30 fps), silent, ready for Instagram: **Vous ne savez pas quoi lui offrir ?
Offrez une expérience beauté à votre maman, amie, sœur, femme, chérie… chez OYA MUSE.** Then the treatments to offer,
photographed big and clear (manucure russe, lash lift, brow lift), how it works (write "CADEAU" to MySalon.ma, pay
in the chat, she receives a digital gift card on her phone and books when she likes) and how to get in touch. Built
with Remotion. Everything that matters sits inside the Instagram safe area, so nothing is hidden by the app's header,
buttons or caption.

## How the two brands share the reel

- **OYA MUSE is what you offer.** It is on the gift card, under the recipients ("chez OYA MUSE · Témara"), in the
  photos of its treatments and next to the call to action. The reel sells the salon.
- **MySalon.ma is how you offer it.** It owns the DM, the payment, the digital gift card and the booking, so the
  messages come to MySalon.ma ("Écrivez « CADEAU » en DM"), not to the salon.
- **One set of props switches the salon.** `partner` (name, city, logo, services), `services.items` and
  `how.options` drive the card, the photos, the chat and the signature, so the same reel can be re-rendered for
  another salon.

| Time    | Scene    | What happens                                                                                                                                                                                                                                          |
| ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0–4 s   | Question | Frame 0 already reads **"Vous ne savez pas"**, then **"quoi lui offrir ?"** in gold, under the MySalon.ma wordmark. A gold rule, then "Nous avons une idée…".                                                                                         |
| 4–10 s  | Reveal   | **"Offrez une expérience beauté à votre maman / amie / sœur / femme / chérie"**, a word a second in handwriting, while a gift box bursts open and the digital gift card floats out with the same name written on it; then "chez OYA MUSE · Témara".   |
| 10–22 s | Services | The treatments to offer, four seconds each, the photo big and clear under the salon's name: **01 · ONGLES Manucure russe** (two of OYA MUSE's photos, two seconds each), **02 · CILS Lash lift**, **03 · SOURCILS Brow lift**, with detail and price. |
| 22–30 s | How      | Two four-second steps on two phones: 1. "Écrivez « CADEAU » en DM" (pick the treatment in the chat, pay), 2. "Elle reçoit sa carte cadeau" (notification, then the digital card on her phone; she books when she likes).                              |
| 30–36 s | CTA      | MySalon.ma, the card, **"OFFREZ UNE EXPÉRIENCE BEAUTÉ" chez OYA MUSE · Témara**, "Pour offrir, c'est par message :", the "Écrivez « CADEAU » en DM" button, and "Vous en rêvez ? Envoyez ce reel à qui doit vous l'offrir."                           |

## Instagram safe area

Tall phones crop about 9% of the width on each side of a 9:16 reel, the "Reels" header covers the top, the caption
block covers the bottom, and the like / comment / share icons sit on the right from about the middle of the screen
down. `src/layout.ts` defines the limits (text between x 110–970 and y 290–1450, and only up to x 870 in the icon
band) and every scene places its text inside them. Photos may go full-bleed; text never does. The grid thumbnail
(4:5, centred) also keeps all the text.

## Sound

The reel is rendered **silent** (`--muted`): add the audio in the Instagram editor (a trending sound keeps the reel
in the algorithm's good books, and the cut is on a two-second grid, so most tracks fit). The project still has its
own soundtrack and sound effects, synthesised from scratch and free to use: `npm run render:sound` renders the same
cut with them (`props/sound.json` turns them on; in the Studio, set `sfx` and `musicFile` in the props panel).

## Run it

```bash
cd mysalon-gift-reel
npm install
npm run dev            # Remotion Studio at http://localhost:3000
npm run render         # silent -> out/mysalon-gift-reel.mp4
npm run render:sound   # with soundtrack and effects -> out/mysalon-gift-reel-sound.mp4
npm run cover          # grid cover (the gift card, "à votre chérie") -> out/cover-card.png
npm run cover:soin     # alternative cover (manucure russe) -> out/cover-soin.png
npm run cover:hook     # alternative cover (the question) -> out/cover-hook.png
```

If Remotion cannot download Chrome Headless Shell in your environment:

```bash
npx remotion render GiftReel out/mysalon-gift-reel.mp4 --muted --browser-executable=/path/to/chrome
```

Each scene is also registered on its own under the `GiftReel-Scenes` folder in the Studio.

## Editing

All copy, recipients, photos, prices, the DM keyword and the chat options are props validated by a Zod schema
(`src/schema.ts`), with defaults in `src/Root.tsx`, so they can be changed in the Studio's props panel. The
recipients are `reveal.recipients` (the word after "à votre" and the name written on the card). The treatments are
`services.items`: each has a category, a name, a detail, a price (leave it empty to hide the tag), one or two photos
(one is held for four seconds, two get two seconds each) and `framed` for small photos. Photos live in
`public/images`; the nails photos are OYA MUSE's, the lash and brow photos are generated ones, shown framed. French
typography uses no-break spaces before "?" and ":" and inside « ».

Colours are in `src/theme.ts` (emerald, champagne gold and ivory). Scene lengths are in `src/GiftReel.tsx`
(`SCENES`): each length includes the overlap with the next scene, on a two-second grid, so that with the soundtrack
every scene starts on a bar line. The transitions (star wipe, blur zoom, iris) are in `src/components/transitions.tsx`
and use plain CSS, no WebGL.

## Music and sound effects

`public/music/gift-theme.mp3` is generated by `scripts/make-music.mjs` and produced like a club record: a catchy,
energetic house track at 120 BPM (exactly 15 frames per beat and 60 frames per bar at 30 fps) in A minor
(Am7 - Fmaj7 - Cadd9 - G6), 18 bars long, with sidechain pumping, a mono low end, delay and reverb, an air shelf, a
soft clipper and a lookahead limiter. `public/sfx/*.wav` (pop, strike, sparkle, tick, ding, whoosh, stamp, success)
come from `scripts/make-sfx.mjs`.

```bash
npm run music   # -> public/music/gift-theme.wav
npm run sfx     # -> public/sfx/*.wav
ffmpeg -i public/music/gift-theme.wav -b:a 192k public/music/gift-theme.mp3
```

## Fonts

Cinzel, Playfair Display, Inter and Great Vibes are bundled in `public/fonts` (SIL Open Font License, see the
`LICENSE-*.txt` files), so the reel renders offline.
