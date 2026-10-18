// Emerald, champagne gold and ivory: OYA MUSE's colours (the salon being
// offered) deepened towards the MySalon.ma teal, so both brands sit in one
// elegant palette.
export const IVORY = "#f8f3ea";
export const IVORY_DEEP = "#efe6d6";
export const SAND = "#e4d7c2";
export const CARD = "#fffdf8";
export const EMERALD = "#1a4a40";
export const EMERALD_DEEP = "#11372f";
export const EMERALD_INK = "#08221c";
export const SAGE = "#a9c1b4";
export const GOLD = "#c9a96e";
export const GOLD_LIGHT = "#ead7ae";
export const GOLD_DEEP = "#9c7c43";
export const INK = "#1d211f";
export const MUTED = "#7d7a72";

// Champagne satin, for ribbons and bows.
export const SATIN = {
  light: "#f6e8c6",
  mid: GOLD,
  dark: "#8a6a32",
};
export const SATIN_BAND = `linear-gradient(90deg, ${SATIN.dark} 0%, ${GOLD} 22%, ${SATIN.light} 50%, ${GOLD} 78%, ${SATIN.dark} 100%)`;

// Gold foil, for the OYA MUSE name (used as a text fill).
export const GOLD_FOIL =
  "linear-gradient(100deg, #9c7c43 0%, #e9d5a6 26%, #c9a96e 48%, #f6e8c6 70%, #a8853a 100%)";

// Light and dark backgrounds used across the scenes.
export const LIGHT_BG = `radial-gradient(60% 38% at 50% 68%, rgba(201,169,110,0.16) 0%, rgba(201,169,110,0) 100%), radial-gradient(55% 30% at 50% 20%, rgba(26,74,64,0.06) 0%, rgba(26,74,64,0) 100%), linear-gradient(180deg, ${IVORY} 0%, ${IVORY} 50%, ${IVORY_DEEP} 100%)`;
export const DARK_BG = `radial-gradient(90% 60% at 50% 36%, #1f5547 0%, ${EMERALD_DEEP} 58%, ${EMERALD_INK} 100%)`;
