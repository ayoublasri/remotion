// Instagram Reels safe area, for a 1080 x 1920 reel. Tall phones crop about
// 9% of the width on each side, the "Reels" header covers the top, the
// caption block covers the bottom, and the action icons sit on the right
// from about y = 950 down. Text stays inside these limits; full-bleed photos
// may go beyond them.
export const SAFE = {
  left: 110,
  right: 970,
  top: 290,
  bottom: 1450,
  // Text that sits in the icon band (y >= iconsTop) stops at iconsRight.
  iconsTop: 950,
  iconsRight: 870,
} as const;

export const SAFE_WIDTH = SAFE.right - SAFE.left;
