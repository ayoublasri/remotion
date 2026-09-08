import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Bundled in public/fonts (SIL Open Font License): renders offline.
export const SERIF = "Playfair Display";
export const SANS = "Inter";

loadFont({
  family: SERIF,
  url: staticFile("fonts/playfair-display-latin-400-normal.woff2"),
  weight: "400",
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

for (const weight of ["400", "500", "600", "700"]) {
  loadFont({
    family: SANS,
    url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`),
    weight,
  });
}
