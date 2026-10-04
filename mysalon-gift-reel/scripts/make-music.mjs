// Generates the royalty-free soundtrack for the gift reel, produced like a
// club record: a catchy, energetic house track at 120 BPM (exactly 15 frames
// per beat and 60 frames per bar at 30 fps), 12 bars: a 24-second loop.
//
// Sound: a tuned, layered kick; 808-style metallic hats, a swung shaker,
// congas and rims; a rolling tech-house bass; pumping supersaw chords and
// house stabs; the hook as a bright pluck lead doubled by formant "vocal
// chops". Arrangement like a DJ edit: filtered intro, snare-roll builds with
// risers, a high-pass sweep and a stutter before the drops, a beat of silence
// right before each drop, and a record stop at the end that loops back into
// the hook.
// Mix: sidechain pumping, mono low end, ping-pong delay, reverb, soft clip and
// a lookahead limiter. Everything is synthesised here.
//
//   node scripts/make-music.mjs  -> public/music/gift-theme.wav
//   (convert to mp3 with ffmpeg, see README)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const BPM = 120;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const BARS = 12;
const TAIL = 0.4;
const LENGTH = BARS * BAR + TAIL;
const N = Math.ceil(LENGTH * SR);
const SWING = 0.017;

const bus = () => [new Float32Array(N), new Float32Array(N)];
const drums = bus();
const perc = bus();
const bassBus = bus();
const chords = bus();
const leads = bus();
const vox = bus();
const fx = bus();
const reverbSend = bus();
const delaySend = bus();

let seed = 20261006;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const noise = () => rand() * 2 - 1;
const midi = (m) => 440 * 2 ** ((m - 69) / 12);
const at = (bar, beat) => bar * BAR + beat * BEAT;
// Sixteenth-note position with swing on the off-sixteenths.
const at16 = (bar, s) => at(bar, s / 4) + (s % 2 === 1 ? SWING : 0);

// ---------- song map (0-based bars), matching the reel ----------
//   0     hook: the groove from the first frame, music filtered, hook teaser
//   1     build: snare roll, riser, high-pass sweep, a beat of silence
//   2-5   reveal + montage: DROP 1 (full groove, hook + vocal chops)
//   6-7   how it works: rolling groove, house stabs and plucks (room for UI)
//   8     build: roll, riser, high-pass sweep, stutter, silence
//   9-11  call to action: DROP 2, everything plus ride and the octave hook,
//         then a record stop on the last beat (the reel loops to the hook)
const DROP = 2;
const MONTAGE = 4;
const HOW = 6;
const BUILD = 8;
const CTA = 9;

const CHORDS = {
  Am: { notes: [57, 60, 64, 67], root: 33 },
  F: { notes: [53, 57, 60, 64], root: 29 },
  C: { notes: [55, 60, 62, 64], root: 36 },
  G: { notes: [55, 59, 62, 64], root: 31 },
};
const PLAN = ["F", "G", "Am", "F", "C", "G", "Am", "F", "G", "Am", "F", "C"];

// The hook, one bar per chord: [beat, midi, length in beats].
const HOOK = {
  Am: [
    [0, 69, 0.5],
    [0.75, 72, 0.25],
    [1, 76, 0.5],
    [1.75, 74, 0.25],
    [2, 72, 0.5],
    [2.5, 74, 0.5],
    [3, 76, 0.75],
  ],
  F: [
    [0, 77, 0.5],
    [0.75, 76, 0.25],
    [1, 72, 0.5],
    [1.75, 69, 0.25],
    [2, 72, 1],
    [3, 69, 0.5],
    [3.5, 67, 0.5],
  ],
  C: [
    [0, 76, 0.5],
    [0.75, 79, 0.25],
    [1, 76, 0.5],
    [1.75, 74, 0.25],
    [2, 72, 0.5],
    [2.5, 74, 0.5],
    [3, 76, 0.75],
  ],
  G: [
    [0, 74, 0.5],
    [0.75, 71, 0.25],
    [1, 67, 0.5],
    [1.75, 71, 0.25],
    [2, 74, 1.5],
    [3.5, 76, 0.5],
  ],
};
const VOWEL_CYCLE = ["a", "o", "a", "e", "a", "i", "o"];

// ---------- helpers ----------
const mixMono = (target, start, buf, pan = 0, gain = 1) => {
  const s0 = Math.round(start * SR);
  const gl = Math.cos(((pan + 1) * Math.PI) / 4) * gain;
  const gr = Math.sin(((pan + 1) * Math.PI) / 4) * gain;
  for (let i = 0; i < buf.length; i++) {
    const idx = s0 + i;
    if (idx < 0) continue;
    if (idx >= N) break;
    target[0][idx] += buf[i] * gl;
    target[1][idx] += buf[i] * gr;
  }
};

const mixStereo = (target, start, L, R, gain = 1) => {
  const s0 = Math.round(start * SR);
  for (let i = 0; i < L.length; i++) {
    const idx = s0 + i;
    if (idx < 0) continue;
    if (idx >= N) break;
    target[0][idx] += L[i] * gain;
    target[1][idx] += R[i] * gain;
  }
};

// Band-limited step correction (PolyBLEP).
const blep = (t, dt) => {
  if (t < dt) {
    t /= dt;
    return t + t - t * t - 1;
  }
  if (t > 1 - dt) {
    t = (t - 1) / dt;
    return t * t + t + t + 1;
  }
  return 0;
};

// Zero-delay-feedback state-variable filter. Cutoff is a number or a function
// of the sample index. "bp" is normalised to unity gain at the centre.
const svf = (buf, cutoff, q, mode = "lp") => {
  let ic1 = 0;
  let ic2 = 0;
  const k = 1 / q;
  const fixed = typeof cutoff === "number";
  let g = fixed ? Math.tan((Math.PI * Math.min(cutoff, SR * 0.45)) / SR) : 0;
  for (let i = 0; i < buf.length; i++) {
    if (!fixed)
      g = Math.tan(
        (Math.PI * Math.min(Math.max(cutoff(i), 10), SR * 0.45)) / SR,
      );
    const a1 = 1 / (1 + g * (g + k));
    const a2 = g * a1;
    const a3 = g * a2;
    const v0 = buf[i];
    const v3 = v0 - ic2;
    const v1 = a1 * ic1 + a2 * v3;
    const v2 = ic2 + a2 * ic1 + a3 * v3;
    ic1 = 2 * v1 - ic1;
    ic2 = 2 * v2 - ic2;
    buf[i] = mode === "lp" ? v2 : mode === "bp" ? k * v1 : v0 - k * v1 - v2;
  }
  return buf;
};

// ---------- drums ----------
const kickTimes = [];

// Layered kick: a sub body tuned to A (55 Hz), a short knock and a click.
const kick = (t0, vel) => {
  kickTimes.push(t0);
  const n = Math.floor(0.5 * SR);
  const buf = new Float32Array(n);
  let ph = 0;
  let ph2 = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const f = 55 + 140 * Math.exp(-t / 0.028) + 1100 * Math.exp(-t / 0.0022);
    ph += (2 * Math.PI * f) / SR;
    ph2 += (2 * Math.PI * 150) / SR;
    const body = Math.sin(ph) * Math.min(1, t / 0.0008) * Math.exp(-t / 0.24);
    const knock = Math.sin(ph2) * Math.exp(-t / 0.016) * 0.32;
    const click = noise() * Math.exp(-t / 0.0008) * 0.3;
    buf[i] = Math.tanh(1.9 * (body + knock + click));
  }
  mixMono(drums, t0, buf, 0, vel);
};

// Clap with a snare body underneath.
const clap = (t0, vel) => {
  const n = Math.floor(0.45 * SR);
  const buf = new Float32Array(n);
  const body = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let env = 0;
    for (const o of [0, 0.008, 0.017, 0.027])
      if (t >= o) env = Math.max(env, Math.exp(-(t - o) / 0.005));
    if (t >= 0.027) env = Math.max(env, 0.8 * Math.exp(-(t - 0.027) / 0.12));
    buf[i] = noise() * env;
    ph += (2 * Math.PI * (215 + 40 * Math.exp(-t / 0.01))) / SR;
    body[i] = Math.sin(ph) * Math.exp(-t / 0.045);
  }
  svf(buf, 1250, 0.8, "bp");
  svf(buf, 380, 0.7, "hp");
  for (let i = 0; i < n; i++) buf[i] = 2.2 * buf[i] + 0.3 * body[i];
  mixMono(drums, t0, buf, 0.03, vel);
  mixMono(reverbSend, t0, buf, 0, 0.55 * vel);
};

const snare = (t0, vel, pitch = 1) => {
  const n = Math.floor(0.16 * SR);
  const buf = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (210 * pitch + 70 * Math.exp(-t / 0.015))) / SR;
    buf[i] =
      noise() * 0.9 * Math.exp(-t / 0.05) +
      Math.sin(ph) * 0.55 * Math.exp(-t / 0.035);
  }
  svf(buf, 240, 0.7, "hp");
  mixMono(drums, t0, buf, 0, vel);
  mixMono(reverbSend, t0, buf, 0, vel * 0.35);
};

// Snare roll accelerating from eighths to thirty-seconds.
const roll = (t0, beats, from, to) => {
  const end = t0 + beats * BEAT;
  let t = t0;
  while (t < end - 1e-6) {
    const p = (t - t0) / (end - t0);
    const step = p < 0.5 ? BEAT / 2 : p < 0.75 ? BEAT / 4 : BEAT / 8;
    snare(t, from + (to - from) * p ** 1.4, 1 + 0.4 * p);
    t += step;
  }
};

// TR-808 style metallic hat: six detuned square waves, high-passed.
const HAT_F = [205.3, 304.4, 369.6, 522.7, 540, 800];
const hat = (t0, vel, open, pan) => {
  const n = Math.floor((open ? 0.36 : 0.09) * SR);
  const buf = new Float32Array(n);
  const ph = HAT_F.map(() => rand());
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let s = 0;
    for (let k = 0; k < HAT_F.length; k++) {
      ph[k] += HAT_F[k] / SR;
      if (ph[k] >= 1) ph[k] -= 1;
      s += ph[k] < 0.5 ? 1 : -1;
    }
    const env = Math.min(1, t / 0.0006) * Math.exp(-t / (open ? 0.12 : 0.024));
    buf[i] = (s / 6 + 0.35 * noise()) * env;
  }
  svf(buf, 7200, 0.7, "hp");
  svf(buf, 7200, 0.7, "hp");
  mixMono(drums, t0, buf, pan, vel);
};

const shaker = (t0, vel, pan) => {
  const n = Math.floor(0.09 * SR);
  const buf = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    buf[i] = noise() * Math.min(1, t / 0.006) * Math.exp(-t / 0.03);
  }
  svf(buf, 6800, 1, "bp");
  mixMono(perc, t0, buf, pan, vel);
};

const RIDE_F = [523, 787, 1117, 1531, 2033, 3106, 4521, 6011];
const ride = (t0, vel) => {
  const n = Math.floor(1.1 * SR);
  const buf = new Float32Array(n);
  const ph = RIDE_F.map(() => rand() * 2 * Math.PI);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let s = 0;
    for (let k = 0; k < RIDE_F.length; k++)
      s += Math.sin(ph[k] + 2 * Math.PI * RIDE_F[k] * t);
    buf[i] =
      (s / RIDE_F.length) * Math.exp(-t / 0.42) +
      noise() * 0.35 * Math.exp(-t / 0.25);
  }
  svf(buf, 3200, 0.7, "hp");
  mixMono(perc, t0, buf, 0.3, vel);
};

const conga = (t0, vel, f0, pan) => {
  const n = Math.floor(0.3 * SR);
  const buf = new Float32Array(n);
  const slap = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * f0 * (1 + 0.5 * Math.exp(-t / 0.008))) / SR;
    buf[i] = Math.sin(ph) * Math.exp(-t / 0.13);
    slap[i] = noise() * Math.exp(-t / 0.004);
  }
  svf(slap, 1800, 0.7, "hp");
  for (let i = 0; i < n; i++)
    buf[i] = Math.tanh(1.3 * (buf[i] + 0.35 * slap[i]));
  mixMono(perc, t0, buf, pan, vel);
};

const rim = (t0, vel, pan) => {
  const n = Math.floor(0.08 * SR);
  const buf = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    buf[i] =
      Math.sin(2 * Math.PI * 1700 * t) * Math.exp(-t / 0.011) +
      0.6 * Math.sin(2 * Math.PI * 820 * t) * Math.exp(-t / 0.018) +
      0.4 * noise() * Math.exp(-t / 0.003);
  }
  svf(buf, 420, 0.7, "hp");
  mixMono(perc, t0, buf, pan, vel);
};

const crash = (t0, vel) => {
  const n = Math.floor(2.6 * SR);
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const e = Math.exp(-i / SR / 0.75);
    L[i] = noise() * e;
    R[i] = noise() * e;
  }
  svf(L, 4200, 0.7, "hp");
  svf(R, 4200, 0.7, "hp");
  mixStereo(fx, t0, L, R, vel);
};

// ---------- transition effects ----------
const reverseCrash = (tEnd, dur, vel) => {
  const n = Math.floor(dur * SR);
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const e = (i / n) ** 2.4;
    L[i] = noise() * e;
    R[i] = noise() * e;
  }
  svf(L, 3800, 0.7, "hp");
  svf(R, 3800, 0.7, "hp");
  mixStereo(fx, tEnd - dur, L, R, vel);
};

const riser = (t0, dur, vel) => {
  const n = Math.floor(dur * SR);
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  const tone = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const p = i / n;
    const e = p ** 1.7;
    L[i] = noise() * e;
    R[i] = noise() * e;
    ph += (2 * Math.PI * (180 * 2 ** (p * 2.4))) / SR;
    tone[i] =
      (Math.sin(ph) + 0.5 * Math.sin(2 * ph) + 0.25 * Math.sin(3 * ph)) *
      e *
      0.22;
  }
  const sweep = (i) => 300 * (10000 / 300) ** (i / n);
  svf(L, sweep, 2.2, "bp");
  svf(R, sweep, 2.2, "bp");
  mixStereo(fx, t0, L, R, vel * 1.6);
  mixMono(fx, t0, tone, 0, vel);
};

const downlifter = (t0, dur, vel) => {
  const n = Math.floor(dur * SR);
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const e = Math.min(1, i / (0.03 * SR)) * (1 - i / n) ** 1.6;
    L[i] = noise() * e;
    R[i] = noise() * e;
  }
  const sweep = (i) => 7000 * (300 / 7000) ** (i / n);
  svf(L, sweep, 1.8, "bp");
  svf(R, sweep, 1.8, "bp");
  mixStereo(fx, t0, L, R, vel * 1.6);
};

// Drop hit: a distorted sub boom sliding down, with a low noise burst.
const impact = (t0, vel) => {
  const n = Math.floor(1.9 * SR);
  const buf = new Float32Array(n);
  const hit = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (30 + 52 * Math.exp(-t / 0.18))) / SR;
    buf[i] = Math.sin(ph) * Math.exp(-t / 0.6);
    hit[i] = noise() * Math.exp(-t / 0.07);
  }
  svf(hit, 900, 0.7, "lp");
  for (let i = 0; i < n; i++) buf[i] = Math.tanh(1.7 * (buf[i] + 0.8 * hit[i]));
  mixMono(fx, t0, buf, 0, vel);
};

// ---------- instruments ----------
// Rolling tech-house bass: resonant saw/square pluck with a sub underneath.
const bassNote = (t0, dur, m, vel) => {
  const n = Math.floor((dur + 0.02) * SR);
  const buf = new Float32Array(n);
  const f = midi(m);
  const dt = f / SR;
  let ph = rand();
  let sub = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += dt;
    if (ph >= 1) ph -= 1;
    const ph2 = (ph + 0.5) % 1;
    const saw = 2 * ph - 1 - blep(ph, dt);
    const square = saw - (2 * ph2 - 1 - blep(ph2, dt));
    sub += (2 * Math.PI * f) / SR;
    const env =
      Math.min(1, t / 0.002) *
      (0.6 + 0.4 * Math.exp(-t / 0.07)) *
      (t < dur ? 1 : Math.exp(-(t - dur) / 0.006));
    buf[i] = (0.45 * saw + 0.25 * square + 0.9 * Math.sin(sub)) * env;
  }
  svf(buf, (i) => 140 + 2300 * Math.exp(-i / SR / 0.045), 2.6, "lp");
  for (let i = 0; i < n; i++) buf[i] = Math.tanh(1.8 * buf[i]);
  mixMono(bassBus, t0, buf, 0, vel);
};
// [sixteenth, semitones, length in beats, velocity]
const BASS_PATTERN = [
  [2, 0, 0.42, 1],
  [3, 12, 0.14, 0.5],
  [6, 0, 0.42, 1],
  [10, 0, 0.42, 1],
  [11, 12, 0.14, 0.5],
  [14, 0, 0.32, 0.95],
  [15, 7, 0.14, 0.45],
];

const DETUNE = [-0.2, -0.12, -0.05, 0, 0.05, 0.12, 0.2];

// Supersaw chord; cutoff is a function of absolute time in seconds.
const supersaw = (t0, dur, notes, vel, cutoffAt, release = 0.12) => {
  const n = Math.floor((dur + release) * SR);
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  for (const m of notes) {
    DETUNE.forEach((d, v) => {
      const dt = midi(m + d) / SR;
      let ph = rand();
      const pan = ((v / (DETUNE.length - 1)) * 2 - 1) * 0.9;
      const gl = Math.cos(((pan + 1) * Math.PI) / 4);
      const gr = Math.sin(((pan + 1) * Math.PI) / 4);
      for (let i = 0; i < n; i++) {
        ph += dt;
        if (ph >= 1) ph -= 1;
        const s = 2 * ph - 1 - blep(ph, dt);
        L[i] += s * gl;
        R[i] += s * gr;
      }
    });
  }
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env =
      Math.min(1, t / 0.008) *
      (t < dur ? 1 : Math.exp(-(t - dur) / (release / 3)));
    L[i] *= env;
    R[i] *= env;
  }
  const cutoff = (i) => cutoffAt(t0 + i / SR);
  svf(L, cutoff, 0.9, "lp");
  svf(R, cutoff, 0.9, "lp");
  mixStereo(chords, t0, L, R, vel);
};

// Short house chord stab.
const stab = (t0, notes, vel) => {
  const n = Math.floor(0.3 * SR);
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  notes.forEach((m, j) => {
    [-0.08, 0.08].forEach((d, v) => {
      const dt = midi(m + 12 + d) / SR;
      let ph = rand();
      for (let i = 0; i < n; i++) {
        ph += dt;
        if (ph >= 1) ph -= 1;
        const s =
          (2 * ph - 1 - blep(ph, dt)) *
          Math.exp(-i / SR / 0.11) *
          Math.min(1, i / (0.002 * SR));
        if (v === 0) L[i] += s * (j % 2 ? 0.8 : 1);
        else R[i] += s * (j % 2 ? 1 : 0.8);
      }
    });
  });
  const cut = (i) => 400 + 3800 * Math.exp(-i / SR / 0.05);
  svf(L, cut, 1.4, "lp");
  svf(R, cut, 1.4, "lp");
  mixStereo(chords, t0, L, R, vel);
  mixMono(delaySend, t0, L, 0, vel * 0.25);
};
const STAB_PATTERN = [
  [0, 0.7],
  [3, 1],
  [6, 0.8],
  [8, 0.7],
  [11, 1],
  [14, 0.8],
];

const pluck = (t0, m, vel, pan, bright = 1) => {
  const n = Math.floor(0.42 * SR);
  const buf = new Float32Array(n);
  const voices = [-0.07, 0.07].map((d) => ({
    dt: midi(m + d) / SR,
    ph: rand(),
  }));
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let s = 0;
    for (const v of voices) {
      v.ph += v.dt;
      if (v.ph >= 1) v.ph -= 1;
      s += 2 * v.ph - 1 - blep(v.ph, v.dt);
    }
    buf[i] = s * 0.5 * Math.min(1, t / 0.002) * Math.exp(-t / 0.13);
  }
  svf(buf, (i) => 500 + 5200 * bright * Math.exp(-i / SR / 0.045), 1.3, "lp");
  mixMono(chords, t0, buf, pan, vel);
  mixMono(delaySend, t0, buf, pan, vel * 0.4);
  mixMono(reverbSend, t0, buf, 0, vel * 0.3);
};

// The hook lead: two detuned saws and a square with a filter envelope, a
// little vibrato on long notes and a soft bell an octave up.
const leadNote = (t0, dur, m, vel, cutoffMax) => {
  const n = Math.floor((dur + 0.1) * SR);
  const buf = new Float32Array(n);
  const bellBuf = new Float32Array(n);
  const f = midi(m);
  const saws = [-0.09, 0.09].map((d) => ({ r: 2 ** (d / 12), ph: rand() }));
  let sq = rand();
  let bell = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const vib =
      t > 0.14
        ? Math.sin(2 * Math.PI * 5.6 * t) * 0.14 * Math.min(1, (t - 0.14) / 0.2)
        : 0;
    const fm = f * 2 ** (vib / 12);
    let s = 0;
    for (const v of saws) {
      const dt = (fm * v.r) / SR;
      v.ph += dt;
      if (v.ph >= 1) v.ph -= 1;
      s += 2 * v.ph - 1 - blep(v.ph, dt);
    }
    const dq = fm / SR;
    sq += dq;
    if (sq >= 1) sq -= 1;
    const sq2 = (sq + 0.5) % 1;
    const square = 2 * sq - 1 - blep(sq, dq) - (2 * sq2 - 1 - blep(sq2, dq));
    const env =
      Math.min(1, t / 0.004) *
      (0.72 + 0.28 * Math.exp(-t / 0.09)) *
      (t < dur ? 1 : Math.exp(-(t - dur) / 0.025));
    buf[i] = (0.5 * s + 0.35 * square) * env;
    bell += (2 * Math.PI * 2 * f) / SR;
    bellBuf[i] = Math.sin(bell) * Math.exp(-t / 0.25) * Math.min(1, t / 0.002);
  }
  svf(
    buf,
    (i) => 1500 + (cutoffMax - 1500) * Math.exp(-i / SR / 0.16),
    1.1,
    "lp",
  );
  mixMono(leads, t0, buf, 0, vel);
  mixMono(leads, t0, bellBuf, 0.15, vel * 0.2);
  mixMono(delaySend, t0, buf, 0, vel * 0.45);
  mixMono(reverbSend, t0, buf, 0, vel * 0.4);
};

// Formant "vocal chop": a glottal-like saw with a pitch scoop and vibrato
// through three vowel formants, plus a breath of aspiration.
const VOWELS = {
  a: [
    [850, 1, 9],
    [1220, 0.6, 10],
    [2810, 0.28, 12],
  ],
  o: [
    [520, 1, 9],
    [900, 0.65, 10],
    [2700, 0.2, 12],
  ],
  e: [
    [610, 1, 9],
    [2000, 0.5, 12],
    [2900, 0.28, 14],
  ],
  i: [
    [330, 1, 8],
    [2700, 0.5, 14],
    [3300, 0.32, 14],
  ],
};
const voxNote = (t0, dur, m, vel, vowel, pan = 0) => {
  const n = Math.floor((dur + 0.05) * SR);
  const src = new Float32Array(n);
  const f = midi(m);
  let ph = rand();
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const scoop = -1.2 * Math.exp(-t / 0.025);
    const vib =
      t > 0.1
        ? Math.sin(2 * Math.PI * 5.2 * t) * 0.18 * Math.min(1, (t - 0.1) / 0.15)
        : 0;
    const dt = (f * 2 ** ((scoop + vib) / 12)) / SR;
    ph += dt;
    if (ph >= 1) ph -= 1;
    src[i] = 2 * ph - 1 - blep(ph, dt) + 0.12 * noise();
  }
  const out = new Float32Array(n);
  for (const [fc, gain, q] of VOWELS[vowel]) {
    const band = svf(Float32Array.from(src), fc, q, "bp");
    for (let i = 0; i < n; i++) out[i] += band[i] * gain;
  }
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    out[i] *=
      2.4 *
      Math.min(1, t / 0.006) *
      (0.8 + 0.2 * Math.exp(-t / 0.06)) *
      (t < dur ? 1 : Math.exp(-(t - dur) / 0.02));
  }
  mixMono(vox, t0, out, pan, vel);
  mixMono(delaySend, t0, out, pan, vel * 0.35);
  mixMono(reverbSend, t0, out, 0, vel * 0.45);
};

const playHook = (bar, vel, cutoffMax, octave = 0) => {
  for (const [b, m, d] of HOOK[PLAN[bar]])
    leadNote(at(bar, b), d * BEAT * 0.92, m + octave, vel, cutoffMax);
};
const playVox = (bar, vel, octave = 0) => {
  HOOK[PLAN[bar]].forEach(([b, m, d], k) =>
    voxNote(
      at(bar, b),
      d * BEAT * 0.85,
      m + octave,
      vel,
      VOWEL_CYCLE[k % VOWEL_CYCLE.length],
      k % 2 ? 0.12 : -0.12,
    ),
  );
};

// ---------- arrangement ----------
for (let bar = 0; bar < BARS; bar++) {
  const { notes, root } = CHORDS[PLAN[bar]];
  const intro = bar < DROP - 1;
  const build1 = bar === DROP - 1;
  const drop1 = bar >= DROP && bar < HOW;
  const how = bar >= HOW && bar < BUILD;
  const build2 = bar === BUILD;
  const drop2 = bar >= CTA;
  const full = drop1 || drop2;
  const build = build1 || build2;

  // Kick from the very first frame; the builds keep only beats 1-2.
  for (let b = 0; b < 4; b++) {
    if (build && b >= 2) continue;
    kick(at(bar, b), intro ? 0.92 : 1);
  }

  // Clap on 2 and 4.
  if (!build) {
    clap(at(bar, 1), intro ? 0.45 : 0.55);
    clap(at(bar, 3), intro ? 0.45 : 0.55);
  }

  // Hats, shaker, open hats, ride.
  for (let s = 0; s < 16; s++) {
    if (build && s >= 8) continue;
    const t = at16(bar, s);
    const v = s % 4 === 2 ? 0.12 : s % 2 === 1 ? 0.07 : 0.05;
    hat(t, v * (0.85 + rand() * 0.3), false, s % 2 ? 0.22 : -0.18);
    shaker(
      t,
      (s % 2 === 1 ? 0.22 : 0.13) * (0.85 + rand() * 0.3),
      s % 2 ? -0.35 : 0.35,
    );
  }
  if (full || how)
    for (let b = 0; b < 4; b++)
      hat(at(bar, b + 0.5), how ? 0.1 : 0.13, true, 0.12);
  if (drop2) for (let b = 0; b < 4; b++) ride(at(bar, b), 0.09);

  // Congas and rims.
  if (full || how) {
    const hits = [
      [3, 330],
      [6, 247],
      [7, 330],
      [10, 247],
      [12, 220],
      [14, 330],
    ];
    for (const [s, f] of hits)
      conga(at16(bar, s), 0.2, f, f > 300 ? 0.3 : -0.3);
  }
  if (how || drop2) {
    rim(at16(bar, 7), 0.16, 0.4);
    rim(at16(bar, 13), 0.12, -0.4);
  }

  // Bass: rolling everywhere but the builds, which climb in eighths.
  if (!build) {
    for (const [s, semis, len, v] of BASS_PATTERN)
      bassNote(
        at16(bar, s),
        len * BEAT,
        root + semis,
        (intro ? 0.42 : 0.5) * v,
      );
  } else {
    for (let s = 0; s < 6; s++)
      bassNote(
        at(bar, s / 2),
        BEAT * 0.3,
        root + (s >= 4 ? 12 : 0),
        0.36 + s * 0.03,
      );
  }

  // Chords.
  if (intro) {
    supersaw(
      at(bar, 0),
      BAR,
      notes,
      0.032,
      (t) => 420 * (2600 / 420) ** Math.min(1, t / BAR),
    );
  } else if (build) {
    supersaw(
      at(bar, 0),
      BAR,
      notes,
      0.032,
      (t) => 2600 * 2.6 ** ((t - at(bar, 0)) / BAR),
    );
  } else if (drop1) {
    supersaw(at(bar, 0), BAR, notes, 0.034, () => 6400);
  } else if (drop2) {
    supersaw(at(bar, 0), BAR, notes, 0.036, () => 7600);
    for (const [s, v] of STAB_PATTERN) stab(at16(bar, s), notes, 0.05 * v);
  } else if (how) {
    supersaw(at(bar, 0), BAR, notes, 0.016, () => 2000);
    for (const [s, v] of STAB_PATTERN) stab(at16(bar, s), notes, 0.075 * v);
  }

  // Plucks under the how-to and its build.
  if (how || build2) {
    const tones = [...notes.map((m) => m + 12), notes[1] + 24, notes[2] + 24];
    for (let s = 0; s < 16; s++)
      pluck(
        at16(bar, s),
        tones[(s * 3) % tones.length],
        s % 4 === 0 ? 0.15 : 0.09,
        s % 2 ? 0.35 : -0.35,
        0.8,
      );
  }

  // The hook: a filtered teaser in the first bar, then the synth lead doubled
  // by the vocal chops on both drops.
  if (intro) playHook(bar, 0.14, 2200);
  if (build1) playVox(bar, 0.1);
  if (drop1) {
    playHook(bar, 0.2, 7500);
    playVox(bar, 0.16);
  }
  if (drop2) {
    playHook(bar, 0.2, 8000);
    playHook(bar, 0.07, 6000, 12);
    playVox(bar, 0.17);
  }

  // Accents on the scene changes.
  if ([DROP, MONTAGE, HOW, CTA].includes(bar))
    crash(at(bar, 0), bar === DROP || bar === CTA ? 0.28 : 0.18);
  if (bar === DROP || bar === CTA) {
    impact(at(bar, 0), 0.65);
    downlifter(at(bar, 0) + 0.05, 1.6, 0.1);
  }
  if (bar === MONTAGE) impact(at(bar, 0), 0.3);
}

// Builds into the drops.
roll(at(DROP - 1, 1), 2.5, 0.12, 0.5);
riser(at(DROP - 1, 0), BAR, 0.16);
reverseCrash(at(DROP, 0), 1.3, 0.24);
roll(at(BUILD, 0), 3.5, 0.1, 0.55);
riser(at(BUILD, 0), BAR, 0.2);
reverseCrash(at(CTA, 0), 1.3, 0.26);

// ---------- DJ edits on the buses ----------
const ramp = (t, a, b, edge) =>
  Math.min(1, Math.max(0, (t - a) / edge), Math.max(0, (b - t) / edge));

// Silence before a drop (with 3 ms fades), on every bus except the effects.
const gap = (from, to) => {
  const i0 = Math.floor(from * SR);
  const i1 = Math.floor(to * SR);
  for (const b of [
    drums,
    perc,
    bassBus,
    chords,
    leads,
    vox,
    delaySend,
    reverbSend,
  ]) {
    for (let i = i0; i < i1; i++) {
      const g = 1 - ramp(i / SR, from, to, 0.003);
      b[0][i] *= g;
      b[1][i] *= g;
    }
  }
};

// Beat-repeat: replay short slices of a bus, getting shorter.
const stutter = (b, from, to) => {
  const i0 = Math.floor(from * SR);
  const i1 = Math.floor(to * SR);
  const src = [b[0].slice(i0, i1), b[1].slice(i0, i1)];
  const half = Math.floor((i1 - i0) / 2);
  let pos = i0;
  const lens = [Math.floor((BEAT / 4) * SR), Math.floor((BEAT / 8) * SR)];
  while (pos < i1) {
    const len = pos - i0 < half ? lens[0] : lens[1];
    for (let k = 0; k < len && pos + k < i1; k++) {
      const fade = Math.min(1, k / 64, (len - k) / 64);
      b[0][pos + k] = src[0][k] * fade;
      b[1][pos + k] = src[1][k] * fade;
    }
    pos += len;
  }
};

// Time-varying high-pass on a bus (the DJ filter sweep).
const hpSweep = (b, from, to, f0, f1) => {
  const cut = (i) => {
    const t = i / SR;
    if (t < from || t >= to) return 10;
    return f0 * (f1 / f0) ** ((t - from) / (to - from));
  };
  svf(b[0], cut, 0.75, "hp");
  svf(b[1], cut, 0.75, "hp");
};

for (const b of [chords, leads, vox, bassBus]) {
  hpSweep(b, at(DROP - 1, 0), at(DROP, 0), 30, 700);
  hpSweep(b, at(BUILD, 0), at(CTA, 0), 30, 900);
}
stutter(chords, at(BUILD, 3), at(BUILD, 3.875));
stutter(leads, at(BUILD, 3), at(BUILD, 3.875));
gap(at(DROP - 1, 3.5), at(DROP, 0));
gap(at(BUILD, 3.875), at(CTA, 0));

// ---------- sidechain pump ----------
kickTimes.sort((a, b) => a - b);
const pump = (target, depth, recover) => {
  let k = -1;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    while (k + 1 < kickTimes.length && kickTimes[k + 1] <= t) k++;
    if (k < 0) continue;
    const dt = t - kickTimes[k];
    if (dt >= recover) continue;
    const e = 1 - dt / recover;
    const g = 1 - depth * e * e;
    target[0][i] *= g;
    target[1][i] *= g;
  }
};
pump(chords, 0.8, 0.3);
pump(bassBus, 0.6, 0.17);
pump(leads, 0.22, 0.2);
pump(vox, 0.25, 0.2);
pump(perc, 0.3, 0.12);

// Keep the music above the kick and bass.
for (const b of [chords, leads, vox]) {
  svf(b[0], 160, 0.7, "hp");
  svf(b[1], 160, 0.7, "hp");
}

// ---------- delay (ping-pong, dotted eighth) and reverb ----------
const pingPong = (inp, time, fb, lpHz) => {
  const d = Math.floor(time * SR);
  const outL = new Float32Array(N);
  const outR = new Float32Array(N);
  const bufL = new Float32Array(d);
  const bufR = new Float32Array(d);
  const a = 1 - Math.exp((-2 * Math.PI * lpHz) / SR);
  let idx = 0;
  let lpL = 0;
  let lpR = 0;
  for (let i = 0; i < N; i++) {
    const yL = bufL[idx];
    const yR = bufR[idx];
    outL[i] = yL;
    outR[i] = yR;
    lpL += a * (yL - lpL);
    lpR += a * (yR - lpR);
    bufL[idx] = (inp[0][i] + inp[1][i]) * 0.5 + lpR * fb;
    bufR[idx] = lpL * fb;
    idx = (idx + 1) % d;
  }
  return [outL, outR];
};
const echo = pingPong(delaySend, BEAT * 0.75, 0.42, 4200);
svf(echo[0], 250, 0.7, "hp");
svf(echo[1], 250, 0.7, "hp");

const reverb = (inL, inR) => {
  const combT = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617];
  const apT = [556, 441, 341, 225];
  const feedback = 0.8;
  const damp = 0.32;
  const process = (offset) => {
    const out = new Float32Array(N);
    const combs = combT.map((t) => ({
      buf: new Float32Array(t + offset),
      idx: 0,
      store: 0,
    }));
    const aps = apT.map((t) => ({ buf: new Float32Array(t + offset), idx: 0 }));
    for (let i = 0; i < N; i++) {
      const x = (inL[i] + inR[i]) * 0.5;
      let s = 0;
      for (const c of combs) {
        const y = c.buf[c.idx];
        c.store = y * (1 - damp) + c.store * damp;
        c.buf[c.idx] = x + c.store * feedback;
        c.idx = (c.idx + 1) % c.buf.length;
        s += y;
      }
      for (const ap of aps) {
        const b = ap.buf[ap.idx];
        ap.buf[ap.idx] = s + b * 0.5;
        ap.idx = (ap.idx + 1) % ap.buf.length;
        s = b - s;
      }
      out[i] = s;
    }
    return out;
  };
  return [process(0), process(23)];
};
const wet = reverb(reverbSend[0], reverbSend[1]);
svf(wet[0], 300, 0.7, "hp");
svf(wet[1], 300, 0.7, "hp");

const rms = (ch, from = 0, to = LENGTH) => {
  const i0 = Math.floor(from * SR);
  const i1 = Math.min(N, Math.floor(to * SR));
  let s = 0;
  for (let i = i0; i < i1; i++) s += ch[i] * ch[i];
  return Math.sqrt(s / (i1 - i0));
};
const wetGain = (0.5 * rms(leads[0])) / (rms(wet[0]) || 1);

// ---------- mix ----------
const GAIN = {
  drums: 1,
  perc: 1.7,
  bass: 1.15,
  chords: 2,
  leads: 2.6,
  vox: 3.6,
  fx: 1,
  echo: 0.45,
  wet: wetGain,
};
const dB = (x) => (20 * Math.log10(x + 1e-12)).toFixed(1);
const dropWindow = [at(DROP, 0), at(HOW, 0)];
console.log(
  `drop rms dB: drums ${dB(rms(drums[0], ...dropWindow) * GAIN.drums)} perc ${dB(rms(perc[0], ...dropWindow) * GAIN.perc)} bass ${dB(rms(bassBus[0], ...dropWindow) * GAIN.bass)} chords ${dB(rms(chords[0], ...dropWindow) * GAIN.chords)} leads ${dB(rms(leads[0], ...dropWindow) * GAIN.leads)} vox ${dB(rms(vox[0], ...dropWindow) * GAIN.vox)}`,
);

const L = new Float32Array(N);
const R = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const mixAt = (c) =>
    drums[c][i] * GAIN.drums +
    perc[c][i] * GAIN.perc +
    bassBus[c][i] * GAIN.bass +
    chords[c][i] * GAIN.chords +
    leads[c][i] * GAIN.leads +
    vox[c][i] * GAIN.vox +
    fx[c][i] * GAIN.fx +
    echo[c][i] * GAIN.echo +
    wet[c][i] * GAIN.wet;
  L[i] = mixAt(0);
  R[i] = mixAt(1);
}

// ---------- master: mono low end, soft clip, lookahead limiter ----------
const side = new Float32Array(N);
const mid = new Float32Array(N);
for (let i = 0; i < N; i++) {
  mid[i] = (L[i] + R[i]) * 0.5;
  side[i] = (L[i] - R[i]) * 0.5;
}
svf(side, 150, 0.7, "hp");
const drive = 0.46 / rms(mid, ...dropWindow);
for (let i = 0; i < N; i++) {
  L[i] = Math.tanh((mid[i] + side[i]) * drive * 0.9) / 0.9;
  R[i] = Math.tanh((mid[i] - side[i]) * drive * 0.9) / 0.9;
}

// Air: a gentle high shelf (+2.5 dB above ~6.5 kHz) for sparkle.
for (const ch of [L, R]) {
  const air = svf(Float32Array.from(ch), 6500, 0.7, "hp");
  for (let i = 0; i < N; i++) ch[i] += 0.33 * air[i];
}

// Record stop on the last beat: the whole mix slows down to a halt (pitch
// falling), then silence. The reel loops straight back into the hook.
const tapeStop = (from, to) => {
  const i0 = Math.floor(from * SR);
  const i1 = Math.floor(to * SR);
  const len = i1 - i0;
  const srcL = L.slice(i0, i1);
  const srcR = R.slice(i0, i1);
  let pos = 0;
  for (let k = 0; k < len; k++) {
    const p = k / len;
    const j = Math.floor(pos);
    const f = pos - j;
    const a = j + 1 < len ? srcL[j] * (1 - f) + srcL[j + 1] * f : 0;
    const b = j + 1 < len ? srcR[j] * (1 - f) + srcR[j + 1] * f : 0;
    const amp = 1 - p ** 4;
    L[i0 + k] = a * amp;
    R[i0 + k] = b * amp;
    pos += (1 - p) ** 1.4;
  }
  for (let i = i1; i < N; i++) {
    L[i] = 0;
    R[i] = 0;
  }
};
tapeStop(at(BARS - 1, 3), at(BARS, 0));

const limiter = (ceiling, lookahead, release) => {
  const la = Math.max(1, Math.floor(lookahead * SR));
  const need = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const p = Math.max(Math.abs(L[i]), Math.abs(R[i]));
    need[i] = p > ceiling ? ceiling / p : 1;
  }
  const ahead = new Float32Array(N);
  const dq = new Int32Array(N);
  let head = 0;
  let tail = 0;
  for (let i = N - 1; i >= 0; i--) {
    while (tail > head && need[dq[tail - 1]] >= need[i]) tail--;
    dq[tail++] = i;
    while (dq[head] > i + la) head++;
    ahead[i] = need[dq[head]];
  }
  const att = 1 - Math.exp(-3 / la);
  const rel = 1 - Math.exp(-1 / (release * SR));
  let env = 1;
  let reduction = 1;
  for (let i = 0; i < N; i++) {
    env += (ahead[i] - env) * (ahead[i] < env ? att : rel);
    const g = Math.min(env, need[i]);
    reduction = Math.min(reduction, g);
    L[i] *= g;
    R[i] *= g;
  }
  return reduction;
};
const maxReduction = limiter(0.89, 0.005, 0.09);

// ---------- write 16-bit stereo WAV ----------
const out = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "music",
  "gift-theme.wav",
);
fs.mkdirSync(path.dirname(out), { recursive: true });
const data = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), i * 4);
  data.writeInt16LE(
    Math.round(Math.max(-1, Math.min(1, R[i])) * 32767),
    i * 4 + 2,
  );
}
const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + data.length, 4);
header.write("WAVE", 8);
header.write("fmt ", 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(2, 22);
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 4, 28);
header.writeUInt16LE(4, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(data.length, 40);
fs.writeFileSync(out, Buffer.concat([header, data]));
console.log(`wrote ${out}`);
console.log(
  `length ${LENGTH.toFixed(2)} s, ${BARS} bars at ${BPM} BPM, limiter max reduction ${dB(maxReduction)} dB`,
);
