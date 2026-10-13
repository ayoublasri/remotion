import beats from "./beats.json";
import {
  camera,
  ease,
  float2,
  seg,
  shake,
  type CamKey,
  type Knot,
  type Rect,
} from "./motion";

// The beat table shared with scripts/make-sound.mjs: every time in seconds.
export const B = beats;
export const FPS = beats.fps;
export const W = 1080;
export const H = 1920;
// The day world is laid out on the centre of Instagram's safe column
// (x 110..870, clear of the action icons); the night number sits on the
// frame's own axis, above the icon band.
export const AXIS = 490;

// The big number's box (Playfair Display 900 at 560 px, "47").
export const NUMBER = { x: 540, y: 760, w: 660, h: 400 };
// What the number collapses into, then the link chip, then the page card.
export const BAR_RECT: Rect = { x: 540, y: 760, w: 560, h: 12, r: 6 };
export const CHIP: Rect = { x: AXIS, y: 760, w: 560, h: 78, r: 39 };
export const CARD: Rect = { x: AXIS, y: 940, w: 760, h: 920, r: 36 };
export const CARD_LEFT = CARD.x - CARD.w / 2; // 110
export const CARD_TOP = CARD.y - CARD.h / 2; // 480
export const PAD = 24;
export const CONTENT_LEFT = CARD_LEFT + PAD; // 134
export const CONTENT_W = CARD.w - 2 * PAD; // 712

// Booking page layout (world y).
export const HEADER_TOP = CARD_TOP + PAD; // 504
export const HEADER_H = 100;
export const TITLE_Y = 634; // section title centre
export const ROW_TOP = 660;
export const ROW_H = 100;
export const rowCenterY = (i: number) => ROW_TOP + ROW_H * i + ROW_H / 2;
export const PILL_W = (CONTENT_W - 3 * 16) / 4; // 166
export const pillCenterX = (i: number) =>
  CONTENT_LEFT + PILL_W / 2 + i * (PILL_W + 16);
export const DAYS_TOP = 668;
export const DAYS_H = 96;
export const SLOTS_TITLE_Y = 804;
export const SLOTS_TOP = 830;
export const SLOTS_H = 80;
export const BUTTON_H = 84;
export const BUTTON_TOP = CARD_TOP + CARD.h - PAD - BUTTON_H; // 1292
export const BUTTON_Y = BUTTON_TOP + BUTTON_H / 2; // 1334

// The week grid, inside the same card, under the card header.
export const GRID = {
  titleY: 640,
  dayRowTop: 668,
  dayRowH: 48,
  top: 724,
  rowH: 84,
  gutter: 60,
  colW: 163,
};
export const cellX = (day: number) =>
  CONTENT_LEFT + GRID.gutter + day * GRID.colW;
export const cellY = (hour: number) => GRID.top + (hour - 10) * GRID.rowH;
export const cellCenter = (day: number, start: number, hours: number) => ({
  x: cellX(day) + GRID.colW / 2,
  y: cellY(start) + (hours * GRID.rowH) / 2,
});
// The "N RDV" badge: right edge and centre line of the agenda title row.
export const BADGE = {
  right: CARD_LEFT + CARD.w - PAD,
  y: GRID.titleY,
  w: 112,
  h: 40,
};

// Where the confirmation's check sits before it hops into the grid.
export const CHECK_HOME = { x: AXIS, y: 800 };
export const CHECK_SIZE = 180;

// The result and the lockup.
export const ZERO = { x: 330, y: 700 };
export const TWELVE = { x: 690, y: 700 };
export const LABEL_Y = 870;
export const GHOST = { x: AXIS, y: 1180, s: 0.5 };
export const LOGO = { x: AXIS, y: 720 };

// Bubble stack.
export const STACK = {
  top: 1040,
  x: AXIS,
  w: 620,
  h: 118,
  pitch: 132,
  fromX: 1340,
};
export const landedCount = (t: number) =>
  B.landings.filter((l) => l <= t).length;
export const lastLanding = (t: number) => {
  let last = -Infinity;
  for (const l of B.landings) if (l <= t) last = l;
  return last;
};

// The hand: where it is, when it presses.
export const HAND_KNOTS: Knot[] = [
  { t: 9.0, x: 1200, y: 1850 },
  { t: 9.55, x: 612, y: 806, curve: "expoOut" },
  { t: 9.78, x: 612, y: 806 },
  { t: 10.3, x: 840, y: 1040 },
  { t: 11.3, x: 840, y: 1040 },
  { t: 11.66, x: 600, y: 772 },
  { t: 11.9, x: 600, y: 772 },
  { t: 12.85, x: 700, y: rowCenterY(0) + 2 },
  { t: 13.1, x: 700, y: rowCenterY(0) + 2 },
  { t: 13.85, x: pillCenterX(2), y: DAYS_TOP + DAYS_H / 2 },
  { t: 14.1, x: pillCenterX(2), y: DAYS_TOP + DAYS_H / 2 },
  { t: 14.45, x: pillCenterX(1), y: SLOTS_TOP + SLOTS_H / 2 },
  { t: 14.7, x: pillCenterX(1), y: SLOTS_TOP + SLOTS_H / 2 },
  { t: 15.05, x: AXIS, y: BUTTON_Y },
  { t: 15.3, x: AXIS, y: BUTTON_Y },
  { t: 16.1, x: 1250, y: 1900, curve: "sineIn" },
];
export const HAND_SPAN = [9.0, 16.1] as const;
export const PRESSES = [
  B.tap47,
  B.tapChip,
  B.tapService,
  B.tapDay,
  B.tapSlot,
  B.tapConfirm,
];

// Camera: operated, not animated. Push into the burst, snap back on the hit,
// kick on the tap, chase the hand through the booking, follow the hop.
export const CAM_KEYS: CamKey[] = [
  { t: 0, x: 540, y: 960, z: 1 },
  { t: 2.4, x: 540, y: 960, z: 1 },
  { t: 4.8, x: 540, y: 870, z: 1.1, curve: "sineIn" },
  { t: 4.8, x: 540, y: 960, z: 1 },
  { t: 9.6, x: 540, y: 960, z: 1 },
  { t: 9.74, x: 556, y: 910, z: 1.045, curve: "expoOut" },
  { t: 10.35, x: AXIS, y: 960, z: 1, curve: "sineInOut" },
  { t: 12.3, x: AXIS, y: 960, z: 1 },
  { t: 12.8, x: AXIS, y: 900, z: 1.12, curve: "sineInOut" },
  { t: 13.3, x: AXIS, y: 900, z: 1.12 },
  { t: 13.8, x: AXIS, y: 920, z: 1.12, curve: "sineInOut" },
  { t: 14.0, x: AXIS, y: 920, z: 1.12 },
  { t: 14.4, x: AXIS, y: 980, z: 1.12, curve: "sineInOut" },
  { t: 14.6, x: AXIS, y: 980, z: 1.12 },
  { t: 15.0, x: AXIS, y: 1000, z: 1.1, curve: "sineInOut" },
  { t: 15.35, x: AXIS, y: 1000, z: 1.1 },
  { t: 15.9, x: AXIS, y: 960, z: 1, curve: "expoInOut" },
  { t: 16.8, x: AXIS, y: 960, z: 1 },
  { t: 17.35, x: 530, y: 900, z: 1.06, curve: "sineInOut" },
  { t: 17.42, x: AXIS, y: 960, z: 1, curve: "expoOut" },
  { t: 18.0, x: AXIS, y: 960, z: 1 },
  { t: 19.4, x: AXIS, y: 940, z: 1.04, curve: "sineIn" },
  { t: 19.4, x: AXIS, y: 960, z: 1 },
];
export const SHAKES = [
  { t: B.hit47, amp: 16 },
  { t: B.tap47, amp: 9 },
  { t: B.card[1], amp: 5 },
  { t: B.confirmed, amp: 6 },
  { t: B.hop[1], amp: 8 },
  { t: B.logo, amp: 6 },
];
// Where the operator's hand floats (zero in the holds).
export const FLOAT_SPANS: [number, number][] = [
  [2.4, 4.8],
  [9.6, 10.35],
  [12.3, 15.9],
  [16.8, 17.4],
  [18.0, 19.4],
];
const floatEnvelope = (t: number) => {
  let e = 0;
  for (const [a, b] of FLOAT_SPANS) {
    e = Math.max(
      e,
      Math.min(
        ease.sineInOut(seg(t, a, a + 0.25)),
        1 - ease.sineInOut(seg(t, b - 0.25, b)),
      ),
    );
  }
  return e;
};

export const cameraAt = (t: number) => camera(t, CAM_KEYS);

// The world layer's CSS transform: screen = (world - camera) * zoom + centre,
// plus the shake in screen pixels and the hand's float on the camera.
export const viewTransform = (t: number) => {
  const cam = cameraAt(t);
  const f = float2(t, 4 * floatEnvelope(t));
  let sx = 0;
  let sy = 0;
  let rot = 0;
  for (const s of SHAKES) {
    const k = shake(t, s.t, { amp: s.amp });
    sx += k.x;
    sy += k.y;
    rot += k.rot;
  }
  return `translate(${W / 2 + sx}px, ${H / 2 + sy}px) rotate(${rot}deg) scale(${cam.z}) translate(${-(cam.x + f.x)}px, ${-(cam.y + f.y)}px)`;
};

export const inStill = (t: number) =>
  B.stills.some(([a, b]) => t >= a && t <= b);
// Shutter samples per frame: one in the dead-still holds, six where it moves.
export const shutterSamples = (t: number) => (inStill(t) ? 1 : 6);
