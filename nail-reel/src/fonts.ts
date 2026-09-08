import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// All fonts are bundled in public/fonts (SIL Open Font License),
// so the reel renders without network access.
export const DISPLAY_FONT = "Anton";
export const ACCENT_FONT = "Playfair Display";
export const BODY_FONT = "Inter";

loadFont({
  family: DISPLAY_FONT,
  url: staticFile("fonts/anton-latin-400-normal.woff2"),
  weight: "400",
});

loadFont({
  family: ACCENT_FONT,
  url: staticFile("fonts/playfair-display-latin-400-italic.woff2"),
  weight: "400",
  style: "italic",
});

loadFont({
  family: ACCENT_FONT,
  url: staticFile("fonts/playfair-display-latin-500-italic.woff2"),
  weight: "500",
  style: "italic",
});

loadFont({
  family: BODY_FONT,
  url: staticFile("fonts/inter-latin-600-normal.woff2"),
  weight: "600",
});

loadFont({
  family: BODY_FONT,
  url: staticFile("fonts/inter-latin-800-normal.woff2"),
  weight: "800",
});
