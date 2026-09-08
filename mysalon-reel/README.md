# MySalon.ma Reel

A vertical 9:16 product reel (1080 x 1920, 30 fps, ~36 s) for MySalon.ma, built with Remotion.
It follows a problem → solution → proof → offer structure:

| Frames     | Scene   | What happens                                                                                                                                                                                                                                                                                                                                         |
| ---------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 – 165    | Hook    | Three "Appel manqué" notifications pile up (with a phone-buzz shake), then the Darija hook line by line: hands busy, phone ringing, client gone.                                                                                                                                                                                                     |
| 165 – 279  | Cost    | "Koula appel manqué, client khserto." with three prices popping in, then struck through and dropping away.                                                                                                                                                                                                                                           |
| 279 – 897  | Product | Iris reveal of the brand (star, logo, tagline, "Fait au Maroc"), headline, then a phone demo with ~3.5 s per feature: booking page opened from the link → tap Réserver → pick 14:30 → confirm → reminder notification → agenda with the new booking → client profile with a one-tap WhatsApp offer. A feature card at the top names each capability. |
| 897 – 1077 | Offer   | "3 MOIS GRATUITS" with a launch stamp, conditions, the "Écrivez-nous en DM" button (with a shine sweep), the handle, founder line and footer.                                                                                                                                                                                                        |

Transitions: a `pushCut()` between hook and cost, a seamless iris into the product scene, and a `slide()` up into the offer.
The phone UI is real HTML/CSS (no screenshots), so every label, price and name is editable.

## Run it

```bash
cd mysalon-reel
npm install
npm run dev      # Remotion Studio at http://localhost:3000
npm run render   # writes out/mysalon-reel.mp4
```

If Remotion cannot download Chrome Headless Shell in your environment:

```bash
npx remotion render MySalonReel out/mysalon-reel.mp4 --browser-executable=/path/to/chrome
```

## Customize

All copy is exposed as props on the `MySalonReel` composition (Studio props panel, or `src/Root.tsx`):

- `handle` – shown in the product-scene header and in the offer scene.
- `hook.line1/2/3`, `cost.line1/2/footnote` – the Darija hook and the cost lines.
- `brand.tagline/badge/headline/subheadline` – the reveal copy.
- `features[]` – five cards: `icon` (`link`, `clock`, `bell`, `calendar`, `heart`, `mail`), `title`, `description`.
- `offer.*` – titles, stamp, conditions, CTA label, founder line, footer.

The demo salon data (Salon Yasmine, services, prices, agenda, client) lives in `src/components/screens/`.
The three lost amounts in the cost scene are in `src/scenes/CostScene.tsx`.

Scene durations are literal values in `src/MySalonReel.tsx`; if you change them, update `durationInFrames` in `src/Root.tsx` (sum of scenes minus 6 for the push cut and 12 for the slide).

Each scene is also registered under the `MySalonReel-Scenes` folder in Studio for isolated tuning.

## Sound

The file is rendered without audio: add a trending sound or a voice-over in Instagram / TikTok when posting.

## Notes

- Key text stays inside the Instagram / TikTok safe area (nothing important above y = 220 or below y = 1500), so the app UI does not cover it.
- Fonts (Playfair Display, Inter) are bundled under the SIL Open Font License in `public/fonts`, so the reel renders offline.
- The project lives outside `packages/` on purpose so the monorepo's Bun workspace does not pick it up; it uses the published `remotion@4.0.522` packages and plain `npm`.
