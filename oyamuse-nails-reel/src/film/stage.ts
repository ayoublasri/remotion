import beats from "./beats.json";
import {
  camera,
  ease,
  float2,
  seg,
  shake,
  type CamKey,
  type Knot,
} from "./motion";

// The beat table, in seconds.
export const B = beats;
export const FPS = beats.fps;
export const W = 1080;
export const H = 1920;
export const CENTER = { x: 540, y: 900 };

// Prints: photos on paper with a white border and a soft shadow.
export const BORDER = 14;
export const PORTRAIT = { w: 760, h: 950 };
export const LANDSCAPE = { w: 800, h: 613 };

export type Pose = { x: number; y: number; s: number; rot: number };
// Where each print rests on the table once the finger has pushed it aside.
export const PARKED: Record<string, Pose> = {
  hero: { x: 190, y: 430, s: 0.42, rot: -9 },
  prep: { x: 900, y: 390, s: 0.42, rot: 8 },
  flip: { x: 130, y: 1430, s: 0.42, rot: -6 },
  closeup: { x: 950, y: 1450, s: 0.42, rot: 7 },
  pair: { x: 540, y: 900, s: 1, rot: 1.5 },
};
export const GATHER_TO = { x: 540, y: 700 };

// The fingertip's path and presses.
export const HAND_KNOTS: Knot[] = [
  { t: 2.3, x: 1150, y: 1750 },
  { t: 2.55, x: 830, y: 1270, curve: "expoOut" },
  { t: 2.62, x: 830, y: 1270 },
  { t: 3.0, x: 470, y: 850, curve: "expoInOut" },
  { t: 3.25, x: 640, y: 2000 },
  { t: 3.5, x: 640, y: 1500, curve: "expoOut" },
  { t: 3.7, x: 640, y: 1500 },
  { t: 4.1, x: 700, y: 2050, curve: "sineIn" },
  { t: 5.6, x: 700, y: 2050 },
  { t: 5.9, x: 250, y: 1250 },
  { t: 5.97, x: 250, y: 1250 },
  { t: 6.35, x: 610, y: 730, curve: "expoInOut" },
  { t: 6.55, x: 540, y: 2000 },
  { t: 6.8, x: 540, y: 1500, curve: "expoOut" },
  { t: 7.0, x: 540, y: 1500 },
  { t: 7.4, x: 560, y: 2050, curve: "sineIn" },
  { t: 8.9, x: 560, y: 2050 },
  { t: 9.2, x: 925, y: 905 },
  { t: 9.5, x: 925, y: 905 },
  { t: 10.2, x: 1150, y: 1300 },
  { t: 12.5, x: 1150, y: 1300 },
  { t: 12.8, x: 900, y: 600 },
  { t: 12.87, x: 900, y: 600 },
  { t: 13.25, x: 490, y: 1130, curve: "expoInOut" },
  { t: 13.45, x: 1160, y: 900 },
  { t: 13.7, x: 760, y: 900, curve: "expoOut" },
  { t: 13.9, x: 760, y: 900 },
  { t: 14.3, x: 1180, y: 1000, curve: "sineIn" },
  { t: 16.2, x: 1180, y: 1000 },
  { t: 16.45, x: 200, y: 470 },
  { t: 16.52, x: 200, y: 470 },
  { t: 16.9, x: 610, y: 1020, curve: "expoInOut" },
  { t: 17.1, x: -90, y: 900 },
  { t: 17.35, x: 300, y: 900, curve: "expoOut" },
  { t: 17.5, x: 300, y: 900 },
  { t: 18.1, x: -200, y: 1950, curve: "sineIn" },
];

export const HAND_SPAN = [2.3, 18.1] as const;
export const PRESSES = [2.6, 5.95, 9.25, 12.85, 16.5];

// Camera: still on every print; a slow push on the close-up, a pull-out to
// the whole table, a push back as the prints gather into the mark.
export const CAM_KEYS: CamKey[] = [
  { t: 0, x: 540, y: 960, z: 1 },
  { t: B.push[0], x: 540, y: 960, z: 1 },
  { t: B.push[1], x: 540, y: 905, z: 1.06, curve: "sineInOut" },
  { t: B.pair.land, x: 540, y: 960, z: 1, curve: "sineInOut" },
  { t: B.pull[0], x: 540, y: 960, z: 1 },
  { t: B.pull[1], x: 540, y: 940, z: 0.62, curve: "expoInOut" },
  { t: B.gather[0], x: 540, y: 940, z: 0.62 },
  { t: B.gather[1], x: 540, y: 960, z: 1, curve: "sineInOut" },
];
export const SHAKES = [
  { t: B.hero.land, amp: 4 },
  { t: B.prep.land, amp: 5 },
  { t: B.before.land, amp: 5 },
  { t: B.flip[1], amp: 7 },
  { t: B.closeup.land, amp: 5 },
  { t: B.pair.land, amp: 5 },
  { t: B.logo, amp: 6 },
];
export const FLOAT_SPANS: [number, number][] = [
  [2.5, 3.9],
  [5.9, 7.2],
  [9.2, 10.2],
  [12.8, 14.1],
  [B.push[0], B.pair.land],
  [B.pull[0], B.pull[1]],
  [B.gather[0], B.gather[1]],
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

export const viewTransform = (t: number) => {
  const cam = cameraAt(t);
  const f = float2(t, 3 * floatEnvelope(t));
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
export const shutterSamples = (t: number) => (inStill(t) ? 1 : 6);
