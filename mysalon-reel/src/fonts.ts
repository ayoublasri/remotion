import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled in public/fonts (SIL Open Font License) so the reel
// renders without network access.
export const SERIF = "Playfair Display";
export const SANS = "Inter";

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

for (const weight of ["400", "500", "600", "700", "800"]) {
  loadFont({
    family: SANS,
    url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`),
    weight,
  });
}
