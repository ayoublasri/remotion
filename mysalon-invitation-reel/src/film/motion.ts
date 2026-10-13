// The move library of the "47" film: every function is pure in absolute film
// time (seconds) and returns plain numbers for a CSS transform or a style.
// Written from first principles (springs, eases, a keyed camera) so that any
// frame, including the fractional frames of the shutter, is deterministic.

export const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
// Progress 0..1 of t through [t0, t1].
export const seg = (t: number, t0: number, t1: number) =>
  t1 <= t0 ? (t >= t1 ? 1 : 0) : clamp((t - t0) / (t1 - t0), 0, 1);

export type Curve = (u: number) => number;
export const ease = {
  linear: (u: number) => u,
  sineIn: (u: number) => 1 - Math.cos((u * Math.PI) / 2),
  sineOut: (u: number) => Math.sin((u * Math.PI) / 2),
  sineInOut: (u: number) => 0.5 - 0.5 * Math.cos(u * Math.PI),
  quadOut: (u: number) => 1 - (1 - u) * (1 - u),
  cubicOut: (u: number) => 1 - (1 - u) ** 3,
  cubicInOut: (u: number) =>
    u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2,
  quartOut: (u: number) => 1 - (1 - u) ** 4,
  // Snaps: fast start, long settle (t80 about 0.23).
  expoOut: (u: number) => (u >= 1 ? 1 : 1 - 2 ** (-10 * u)),
  expoInOut: (u: number) =>
    u <= 0
      ? 0
      : u >= 1
        ? 1
        : u < 0.5
          ? 2 ** (20 * u - 10) / 2
          : (2 - 2 ** (-20 * u + 10)) / 2,
  backOut: (u: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * (u - 1) ** 3 + c1 * (u - 1) ** 2;
  },
} satisfies Record<string, Curve>;

// Step response of a damped spring from 0 to 1, tau seconds after release.
export const spring = (tau: number, zeta = 0.6, omega = 18) => {
  if (tau <= 0) return 0;
  if (zeta >= 1) {
    const e = Math.exp(-omega * tau);
    return 1 - e * (1 + omega * tau);
  }
  const wd = omega * Math.sqrt(1 - zeta * zeta);
  const e = Math.exp(-zeta * omega * tau);
  return (
    1 - e * (Math.cos(wd * tau) + ((zeta * omega) / wd) * Math.sin(wd * tau))
  );
};

// A landing: squash on the hit, ring out. Identity before the hit.
export const impact = (
  t: number,
  tHit: number,
  { amount = 0.14, decay = 9, omega = 24 } = {},
) => {
  const dt = t - tHit;
  if (dt < 0) return { sx: 1, sy: 1, k: 0 };
  const k = amount * Math.exp(-decay * dt) * Math.cos(omega * dt);
  return { sx: 1 + 0.6 * k, sy: 1 - k, k };
};

// A tap: a dip over `dur`, and a ring that expands and fades after it.
export const press = (
  t: number,
  tc: number,
  { dur = 0.16, depth = 0.16 } = {},
) => {
  const u = seg(t, tc - dur / 2, tc + dur / 2);
  const dip = Math.sin(u * Math.PI);
  const ring = seg(t, tc, tc + 0.4);
  return { s: 1 - depth * dip, ring, down: t >= tc };
};

// Something arrives: opacity leads the spring so it never reads as a fade.
export const popIn = (
  t: number,
  t0: number,
  { s0 = 0.72, zeta = 0.58, omega = 20, rise = 0 } = {},
) => {
  const tau = t - t0;
  const sp = spring(tau, zeta, omega);
  return {
    op: seg(t, t0, t0 + 0.1),
    s: tau <= 0 ? s0 : lerp(s0, 1, sp),
    dy: tau <= 0 ? rise : rise * (1 - sp),
  };
};

// A word lands: spring rise and scale.
export const wordRise = (
  t: number,
  t0: number,
  { dist = 34, zeta = 0.68, omega = 16 } = {},
) => {
  const tau = t - t0;
  const sp = spring(tau, zeta, omega);
  return {
    op: seg(t, t0, t0 + 0.14),
    y: tau <= 0 ? dist : dist * (1 - sp),
    s: tau <= 0 ? 0.96 : lerp(0.96, 1, sp),
  };
};

// Something leaves: lifts, grows a touch, fades.
export const liftOut = (
  t: number,
  t1: number,
  { dur = 0.28, dist = 40 } = {},
) => {
  const u = ease.cubicOut(seg(t, t1, t1 + dur));
  return { op: 1 - u, dy: -dist * u, s: 1 + 0.04 * u, gone: t >= t1 + dur };
};

// Lines rise into place from behind a clip.
export const maskRise = (
  t: number,
  t0: number,
  { dur = 0.55, dist = 70 } = {},
) => {
  const u = ease.expoOut(seg(t, t0, t0 + dur));
  return { y: dist * (1 - u), visible: t >= t0 };
};

// Typing at a steady rate; the caret is solid while typing, blinks after.
export const typeOn = (t: number, t0: number, text: string, cps = 28) => {
  const n = clamp(Math.floor((t - t0) * cps), 0, text.length);
  const done = n >= text.length;
  const tDone = t0 + text.length / cps;
  const caret =
    t < t0
      ? false
      : !done
        ? true
        : t < tDone + 1.1
          ? Math.floor((t - tDone) * 2.5) % 2 === 0
          : false;
  return { n, str: text.slice(0, n), done, caret };
};

export type Rect = { x: number; y: number; w: number; h: number; r: number };
// Container transform: one rect (by centre) becomes another.
export const morphRect = (
  t: number,
  t0: number,
  t1: number,
  a: Rect,
  b: Rect,
  curve: Curve = ease.expoInOut,
): Rect & { k: number } => {
  const k = curve(seg(t, t0, t1));
  return {
    x: lerp(a.x, b.x, k),
    y: lerp(a.y, b.y, k),
    w: lerp(a.w, b.w, k),
    h: lerp(a.h, b.h, k),
    r: lerp(a.r, b.r, k),
    k,
  };
};

// A circle opens from a point until it covers the frame.
export const iris = (
  t: number,
  t0: number,
  t1: number,
  cx: number,
  cy: number,
  w = 1080,
  h = 1920,
) => {
  const far = Math.max(
    Math.hypot(cx, cy),
    Math.hypot(w - cx, cy),
    Math.hypot(cx, h - cy),
    Math.hypot(w - cx, h - cy),
  );
  const u = ease.cubicInOut(seg(t, t0, t1));
  return { r: far * u, covered: t >= t1, started: t >= t0 };
};

// An arc from one slot to the next; land it with `impact`.
export const hop = (
  t: number,
  t0: number,
  t1: number,
  from: { x: number; y: number },
  to: { x: number; y: number },
  height = 180,
) => {
  const k = seg(t, t0, t1);
  const kx = ease.sineInOut(k);
  return {
    x: lerp(from.x, to.x, kx),
    y: lerp(from.y, to.y, kx) - height * 4 * k * (1 - k),
    k,
  };
};

// Many become one: item i of n travels on a fanned arc into a point, shrinking.
export const gather = (
  t: number,
  t0: number,
  t1: number,
  i: number,
  n: number,
  from: { x: number; y: number },
  to: { x: number; y: number },
  { stagger = 0.05, arc = 140 } = {},
) => {
  const start = t0 + i * stagger;
  const dur = t1 - t0 - stagger * (n - 1);
  const k = ease.expoInOut(seg(t, start, start + dur));
  const side = i % 2 === 0 ? 1 : -1;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  // Perpendicular bulge, strongest mid-way.
  const bulge = arc * side * 4 * k * (1 - k);
  return {
    x: lerp(from.x, to.x, k) + (-dy / len) * bulge,
    y: lerp(from.y, to.y, k) + (dx / len) * bulge,
    s: lerp(1, 0.08, k),
    op: 1 - ease.sineIn(seg(k, 0.6, 1)),
    k,
  };
};

// Decaying, deterministic shake; zero before the hit.
export const shake = (
  t: number,
  tHit: number,
  { amp = 12, decay = 7, freq = 19 } = {},
) => {
  const dt = t - tHit;
  if (dt < 0 || dt > 1.2) return { x: 0, y: 0, rot: 0 };
  const e = Math.exp(-decay * dt);
  return {
    x: amp * e * Math.sin(2 * Math.PI * freq * dt + 0.4),
    y: 0.75 * amp * e * Math.sin(2 * Math.PI * freq * 1.37 * dt + 1.9),
    rot: 0.08 * amp * e * Math.sin(2 * Math.PI * freq * 0.73 * dt + 0.9) * 0.1,
  };
};

// The operator's hand: a slow two-sine float, scaled by an envelope.
export const float2 = (t: number, amp: number) => ({
  x: amp * (Math.sin(t * 1.7) * 0.6 + Math.sin(t * 2.9 + 1.3) * 0.4),
  y: amp * (Math.sin(t * 1.3 + 0.7) * 0.6 + Math.sin(t * 2.3 + 2.1) * 0.4),
});

// A counter rolling from one value to another.
export const roll = (
  t: number,
  t0: number,
  t1: number,
  from: number,
  to: number,
  curve: Curve = ease.expoOut,
) => Math.round(lerp(from, to, curve(seg(t, t0, t1))));

export type CamKey = {
  t: number;
  x: number;
  y: number;
  z: number;
  curve?: keyof typeof ease;
};
export type Cam = { x: number; y: number; z: number };
// Keyed camera; zoom interpolated in log space, the segment's curve named on
// its end key. Two keys at the same time are a snap.
export const camera = (t: number, keys: CamKey[]): Cam => {
  if (t <= keys[0].t) return { x: keys[0].x, y: keys[0].y, z: keys[0].z };
  for (let i = 1; i < keys.length; i++) {
    const b = keys[i];
    if (t <= b.t) {
      const a = keys[i - 1];
      const k = ease[b.curve ?? "sineInOut"](seg(t, a.t, b.t));
      return {
        x: lerp(a.x, b.x, k),
        y: lerp(a.y, b.y, k),
        z: Math.exp(lerp(Math.log(a.z), Math.log(b.z), k)),
      };
    }
  }
  const last = keys[keys.length - 1];
  return { x: last.x, y: last.y, z: last.z };
};

export type Knot = {
  t: number;
  x: number;
  y: number;
  curve?: keyof typeof ease;
};
// A path through knots, eased per segment, held between them.
export const path = (t: number, knots: Knot[]) => {
  if (t <= knots[0].t) return { x: knots[0].x, y: knots[0].y };
  for (let i = 1; i < knots.length; i++) {
    const b = knots[i];
    if (t <= b.t) {
      const a = knots[i - 1];
      const k = ease[b.curve ?? "sineInOut"](seg(t, a.t, b.t));
      return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k) };
    }
  }
  const last = knots[knots.length - 1];
  return { x: last.x, y: last.y };
};

// French typography: no-break spaces before ? ! : ; » and after «.
export const fr = (s: string) =>
  s.replace(/ ([?!:;»])/g, " $1").replace(/« /g, "« ");
