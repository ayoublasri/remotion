// MySalon.ma palette, from the brand: deep teal, raspberry and a warm
// off-white.
export const PAPER = "#f8f4ee";
export const BLUSH = "#fdf4f1";
export const SAND = "#eee6e2";
export const CARD = "#ffffff";
export const TEAL = "#0f5c57";
export const TEAL_MID = "#1a5450";
export const TEAL_DEEP = "#0f3d3a";
export const TEAL_INK = "#0a2d2b";
export const TEAL_SOFT = "#9fcac4";
export const ROSE = "#e8365d";
export const ROSE_DEEP = "#b81238";
export const ROSE_SOFT = "#f47c97";
export const ROSE_PALE = "#fde4ea";
export const INK = "#1c1c1c";
export const MUTED = "#6b6b6b";

// Raspberry satin, for ribbons and bows.
export const SATIN = {
  light: "#ffc2cf",
  mid: ROSE,
  dark: "#8c0f2c",
};
export const SATIN_BAND = `linear-gradient(90deg, ${SATIN.dark} 0%, ${ROSE} 22%, ${SATIN.light} 50%, ${ROSE} 78%, ${SATIN.dark} 100%)`;

// Light and dark backgrounds used across the scenes.
export const LIGHT_BG = `radial-gradient(55% 35% at 50% 70%, rgba(232,54,93,0.09) 0%, rgba(232,54,93,0) 100%), radial-gradient(55% 30% at 50% 22%, rgba(15,92,87,0.08) 0%, rgba(15,92,87,0) 100%), linear-gradient(180deg, ${BLUSH} 0%, ${PAPER} 55%, ${SAND} 100%)`;
export const DARK_BG = `radial-gradient(90% 60% at 50% 35%, ${TEAL_MID} 0%, ${TEAL_DEEP} 60%, ${TEAL_INK} 100%)`;
