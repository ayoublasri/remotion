import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Bundled in public/fonts (SIL Open Font License): renders offline.
// Cinzel echoes the OYA MUSE lettering, Playfair Display and Inter are the
// MySalon.ma brand fonts, Great Vibes is the handwriting on the gift card.
export const DISPLAY = "Cinzel";
export const SERIF = "Playfair Display";
export const SANS = "Inter";
export const SCRIPT = "Great Vibes";

for (const weight of ["400", "600", "700"]) {
  loadFont({
    family: DISPLAY,
    url: staticFile(`fonts/cinzel-latin-${weight}-normal.woff2`),
    weight,
  });
}

loadFont({
  family: SERIF,
  url: staticFile("fonts/playfair-display-latin-700-normal.woff2"),
  weight: "700",
});
loadFont({
  family: SERIF,
  url: staticFile("fonts/playfair-display-latin-900-normal.woff2"),
  weight: "900",
});
loadFont({
  family: SERIF,
  url: staticFile("fonts/playfair-display-latin-400-italic.woff2"),
  weight: "400",
  style: "italic",
});
loadFont({
  family: SERIF,
  url: staticFile("fonts/playfair-display-latin-500-italic.woff2"),
  weight: "500",
  style: "italic",
});

for (const weight of ["500", "600", "700", "800"]) {
  loadFont({
    family: SANS,
    url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`),
    weight,
  });
}

loadFont({
  family: SCRIPT,
  url: staticFile("fonts/great-vibes-latin-400-normal.woff2"),
  weight: "400",
});
