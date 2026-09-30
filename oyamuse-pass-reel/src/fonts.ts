import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Bundled in public/fonts (SIL Open Font License): renders offline.
export const SERIF = "Playfair Display";
export const DISPLAY = "Cinzel";
export const SANS = "Inter";

loadFont({
  family: SERIF,
  url: staticFile("fonts/playfair-display-latin-700-normal.woff2"),
  weight: "700",
});
loadFont({
  family: SERIF,
  url: staticFile("fonts/playfair-display-latin-500-italic.woff2"),
  weight: "500",
  style: "italic",
});

for (const weight of ["400", "600", "700"]) {
  loadFont({
    family: DISPLAY,
    url: staticFile(`fonts/cinzel-latin-${weight}-normal.woff2`),
    weight,
  });
}

for (const weight of ["500", "600", "700", "800"]) {
  loadFont({
    family: SANS,
    url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`),
    weight,
  });
}
