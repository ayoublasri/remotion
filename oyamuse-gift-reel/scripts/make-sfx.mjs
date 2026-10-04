// Generates the small UI sound effects used by the reel (all synthesised,
// royalty-free): whoosh, stamp, pop, tick, ding, success.
//   node scripts/make-sfx.mjs  -> public/sfx/*.wav

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const dir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "sfx",
);
fs.mkdirSync(dir, { recursive: true });

let seed = 7;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};

const render = (dur, gen) => {
  const n = Math.floor(dur * SR);
  const buf = new Float32Array(n);
  for (let i = 0; i < n; i++) buf[i] = gen(i / SR, i);
  return buf;
};

const lp = (buf, cutoff) => {
  const a = 1 - Math.exp((-2 * Math.PI * cutoff) / SR);
  let y = 0;
  for (let i = 0; i < buf.length; i++) {
    y += a * (buf[i] - y);
    buf[i] = y;
  }
  return buf;
};

const hp = (buf, cutoff) => {
  const a = 1 - Math.exp((-2 * Math.PI * cutoff) / SR);
  let l = 0;
  for (let i = 0; i < buf.length; i++) {
    l += a * (buf[i] - l);
    buf[i] -= l;
  }
  return buf;
};

// Band-pass whose centre frequency can move over time.
const sweepBandPass = (buf, f0At, q) => {
  let x1 = 0,
    x2 = 0,
    y1 = 0,
    y2 = 0;
  for (let i = 0; i < buf.length; i++) {
    const w0 = (2 * Math.PI * f0At(i / SR)) / SR;
    const alpha = Math.sin(w0) / (2 * q);
    const b0 = alpha / (1 + alpha);
    const b2 = -alpha / (1 + alpha);
    const a1 = (-2 * Math.cos(w0)) / (1 + alpha);
    const a2 = (1 - alpha) / (1 + alpha);
    const x0 = buf[i];
    const y0 = b0 * x0 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1;
    x1 = x0;
    y2 = y1;
    y1 = y0;
    buf[i] = y0;
  }
  return buf;
};

const sum = (...bufs) => {
  const n = Math.max(...bufs.map((b) => b.length));
  const out = new Float32Array(n);
  for (const b of bufs) for (let i = 0; i < b.length; i++) out[i] += b[i];
  return out;
};

const write = (name, buf, peakDb) => {
  let peak = 0;
  for (const v of buf) peak = Math.max(peak, Math.abs(v));
  const g = 10 ** (peakDb / 20) / (peak || 1);
  const data = Buffer.alloc(buf.length * 2);
  for (let i = 0; i < buf.length; i++)
    data.writeInt16LE(
      Math.round(Math.max(-1, Math.min(1, buf[i] * g)) * 32767),
      i * 2,
    );
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + data.length, 4);
  h.write("WAVE", 8);
  h.write("fmt ", 12);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write("data", 36);
  h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(path.join(dir, name), Buffer.concat([h, data]));
  console.log(`wrote ${name} (${(buf.length / SR).toFixed(2)} s)`);
};

// Whoosh: noise through a rising band-pass, fast attack, medium tail.
{
  const dur = 0.5;
  const buf = render(
    dur,
    (t) => (rand() * 2 - 1) * Math.sin(Math.PI * Math.min(1, t / dur)) ** 1.2,
  );
  sweepBandPass(buf, (t) => 500 * 2 ** ((t / dur) * 3.2), 1.4);
  write("whoosh.wav", buf, -6);
}

// Stamp: a low thud plus a short click, for prices and badges landing.
{
  const thud = render(
    0.32,
    (t) =>
      Math.sin(2 * Math.PI * (60 + 90 * Math.exp(-t / 0.03)) * t) *
      Math.exp(-t / 0.09),
  );
  const click = hp(
    render(0.03, (t) => (rand() * 2 - 1) * Math.exp(-t / 0.006)),
    2000,
  );
  write("stamp.wav", sum(thud, click), -4);
}

// Pop: a UI tap, short pitch drop.
{
  const body = render(
    0.16,
    (t) =>
      Math.sin(2 * Math.PI * (300 + 700 * Math.exp(-t / 0.018)) * t) *
      Math.exp(-t / 0.035),
  );
  const click = hp(
    render(0.012, (t) => (rand() * 2 - 1) * Math.exp(-t / 0.003)),
    3000,
  );
  write("pop.wav", sum(body, click), -8);
}

// Tick: tiny click for pills lighting up.
{
  const buf = lp(
    hp(
      render(0.06, (t) => (rand() * 2 - 1) * Math.exp(-t / 0.008)),
      1500,
    ),
    9000,
  );
  write("tick.wav", buf, -12);
}

// Ding: bell for the code arriving.
{
  const f = 1318.5; // E6
  const buf = render(0.9, (t) => {
    const env = Math.min(1, t / 0.002) * Math.exp(-t / 0.28);
    const w = 2 * Math.PI * f * t;
    return (
      env *
      (Math.sin(w) +
        0.35 * Math.sin(2.76 * w) * Math.exp(-t / 0.1) +
        0.2 * Math.sin(5.4 * w) * Math.exp(-t / 0.05))
    );
  });
  write("ding.wav", buf, -8);
}

// Success: two rising bell notes for the confirmed booking.
{
  const note = (f, start) =>
    render(0.7 + start, (t) => {
      const u = t - start;
      if (u < 0) return 0;
      const env = Math.min(1, u / 0.002) * Math.exp(-u / 0.26);
      const w = 2 * Math.PI * f * u;
      return (
        env * (Math.sin(w) + 0.3 * Math.sin(2.76 * w) * Math.exp(-u / 0.09))
      );
    });
  write("success.wav", sum(note(1046.5, 0), note(1568, 0.11)), -8);
}

// Sparkle: a fast ascending bell glissando with a little shimmer, for the
// gift box opening and the card reveal.
{
  const notes = [84, 86, 89, 91, 93, 96, 98, 101, 103, 105];
  const total = 1.1;
  const out = new Float32Array(Math.floor(total * SR));
  notes.forEach((m, k) => {
    const f = 440 * 2 ** ((m - 69) / 12);
    const start = Math.floor(k * 0.042 * SR);
    for (let i = 0; start + i < out.length; i++) {
      const t = i / SR;
      const env = Math.min(1, t / 0.002) * Math.exp(-t / 0.18);
      const w = 2 * Math.PI * f * t;
      out[start + i] +=
        env *
        (Math.sin(w) + 0.3 * Math.sin(2.76 * w) * Math.exp(-t / 0.05)) *
        (0.6 + k * 0.04);
    }
  });
  const shimmer = hp(
    render(
      total,
      (t) =>
        (rand() * 2 - 1) * Math.exp(-t / 0.35) * Math.min(1, t / 0.08) * 0.12,
    ),
    7000,
  );
  write("sparkle.wav", sum(out, shimmer), -7);
}

// Strike: a quick marker swipe for crossing words out.
{
  const dur = 0.2;
  const buf = render(
    dur,
    (t) => (rand() * 2 - 1) * Math.min(1, t / 0.01) * Math.exp(-t / 0.07),
  );
  sweepBandPass(buf, (t) => 1400 + 3200 * (t / dur), 1.6);
  write("strike.wav", buf, -9);
}
