// Generates the sound of the "47" film: a royalty-free Afrobeats score and a
// separate sound-effects track, both synthesised from scratch and timed from
// the film's own beat table (src/film/beats.json), so a retimed beat takes
// its sound with it.
//
// Music, 100 BPM, 12 bars (28.8 s): a low A-minor pad and the clave while the
// number counts, the torrent into the hit at 4.8 s, near silence for the
// hold, a heartbeat under the question, the drop in C major on the tap, the
// full groove through the booking and the week, a build under the result and
// the final chord under the lockup. The effects are five materials (air,
// glass, wood, bubble, sub) in the same room as the music, fewer than the
// beats: pops for the first DMs, a whoosh for the iris, two wood hits per
// tap, glass for the confirmation and the week's blocks.
//
//   node scripts/make-sound.mjs
//     -> public/music/47-theme.wav + .mp3, public/music/47-sfx.wav + .mp3

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import beats from "../src/film/beats.json" with { type: "json" };

const SR = 44100;
const BPM = beats.bpm;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const BARS = beats.bars;
const LENGTH = BARS * BAR;
const N = Math.ceil(LENGTH * SR);
const SWING = 0.028;

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
const sfxBus = bus();
const sfxSend = bus();

let seed = 20261013;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const noise = () => rand() * 2 - 1;
const midi = (m) => 440 * 2 ** ((m - 69) / 12);
const at = (bar, beat) => bar * BAR + beat * BEAT;
// Sixteenth-note position with swing on the off-sixteenths.
const at16 = (bar, s) => at(bar, s / 4) + (s % 2 === 1 ? SWING : 0);

// ---------- song map (0-based bars, 2.4 s each), following the film ----------
//   0-1    the count: a low Am pad, the clave, a shaker; bar 1 is the
//          torrent (kick four to the floor, riser, roll) into the hit at 4.8 s
//   2      the hold: near silence, one Rhodes chord when "DM" lands at 6.0 s
//   3      the question: a heartbeat, a riser into the drop
//   4-8    DROP at 9.6 s: the tap, the link, the booking, the week (C major)
//   9      build on G under the result
//   10-11  the final chord on C under the lockup, fade
const DROP = 4;
const BUILD = 9;
const END = 10;

const CHORDS = {
  C: [55, 60, 64, 67],
  G: [55, 59, 62, 67],
  Am: [57, 60, 64, 69],
  F: [53, 57, 60, 65],
  Cend: [48, 55, 60, 64, 67, 72],
};
const ROOT = { C: 36, G: 31, Am: 33, F: 29, Cend: 36 };
const PLAN = [
  "Am",
  "Am",
  "Am",
  "G",
  "C",
  "F",
  "G",
  "Am",
  "F",
  "G",
  "Cend",
  "Cend",
];
// Marimba riff, two bars, C major pentatonic, bouncing on the off-beats:
// [sixteenth, midi, velocity].
const RIFF = [
  [
    [0, 79, 0.5],
    [2, 76, 0.4],
    [3, 79, 0.45],
    [6, 81, 0.5],
    [8, 79, 0.45],
    [10, 76, 0.4],
    [12, 74, 0.45],
    [14, 76, 0.4],
  ],
  [
    [0, 84, 0.5],
    [2, 81, 0.4],
    [3, 79, 0.45],
    [6, 76, 0.45],
    [8, 79, 0.45],
    [10, 81, 0.5],
    [12, 79, 0.4],
    [14, 76, 0.4],
  ],
];

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

// ---------- Afrobeats instruments ----------
// Log drum: a hollow sine "doom" with a fast pitch drop, lightly saturated.
const logDrum = (t0, m, vel) => {
  const n = Math.floor(0.5 * SR);
  const buf = new Float32Array(n);
  const f = midi(m);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * f * (1 + 0.7 * Math.exp(-t / 0.014))) / SR;
    const body = Math.sin(ph) + 0.18 * Math.sin(2 * ph);
    const click = noise() * Math.exp(-t / 0.0012) * 0.25;
    buf[i] =
      Math.tanh(1.6 * (body * Math.exp(-t / 0.24) + click)) *
      Math.min(1, t / 0.0015);
  }
  mixMono(bassBus, t0, buf, 0, vel);
};
// [sixteenth, semitones, velocity]
const LOG_PATTERN = [
  [0, 0, 1],
  [6, 0, 0.85],
  [8, 7, 0.75],
  [11, 0, 0.9],
  [14, 12, 0.45],
];

// Rhodes-style electric piano: FM tine (modulator at 2x, index decaying),
// a touch of chorus, tremolo, a soft attack.
const rhodes = (t0, dur, notes, vel) => {
  const n = Math.floor((dur + 0.4) * SR);
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  notes.forEach((m, j) => {
    const f = midi(m);
    const pan = ((j / Math.max(1, notes.length - 1)) * 2 - 1) * 0.5;
    const gl = Math.cos(((pan + 1) * Math.PI) / 4);
    const gr = Math.sin(((pan + 1) * Math.PI) / 4);
    let ph = rand() * 2 * Math.PI;
    let ph2 = rand() * 2 * Math.PI;
    let mod = 0;
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      mod += (2 * Math.PI * 2 * f) / SR;
      const index = 1.1 * Math.exp(-t / 0.18) + 0.08;
      ph += (2 * Math.PI * f) / SR;
      ph2 += (2 * Math.PI * f * 1.0007) / SR;
      const trem = 1 - 0.12 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 4.2 * t));
      const env =
        Math.min(1, t / 0.006) *
        (0.35 + 0.65 * Math.exp(-t / 0.9)) *
        (t < dur ? 1 : Math.exp(-(t - dur) / 0.12));
      const s =
        (Math.sin(ph + index * Math.sin(mod)) * 0.7 + Math.sin(ph2) * 0.3) *
        env *
        trem;
      L[i] += s * gl;
      R[i] += s * gr;
    }
  });
  mixStereo(chords, t0, L, R, vel / Math.sqrt(notes.length));
  mixMono(reverbSend, t0, L, -0.2, vel * 0.35);
  mixMono(reverbSend, t0, R, 0.2, vel * 0.35);
};

// Marimba: the fundamental with its 4th and 10th partials, a woody click.
const marimba = (t0, m, vel, pan) => {
  const n = Math.floor(0.6 * SR);
  const buf = new Float32Array(n);
  const f = midi(m);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    buf[i] =
      (Math.sin(2 * Math.PI * f * t) * Math.exp(-t / 0.3) +
        0.5 * Math.sin(2 * Math.PI * 4 * f * t) * Math.exp(-t / 0.06) +
        0.2 * Math.sin(2 * Math.PI * 10 * f * t) * Math.exp(-t / 0.02) +
        0.3 * noise() * Math.exp(-t / 0.002)) *
      Math.min(1, t / 0.0015);
  }
  mixMono(leads, t0, buf, pan, vel);
  mixMono(delaySend, t0, buf, pan, vel * 0.5);
  mixMono(reverbSend, t0, buf, 0, vel * 0.35);
};

const playRiff = (bar, vel, octave = 0) => {
  for (const [s, m, v] of RIFF[bar % 2])
    marimba(at16(bar, s), m + octave, vel * v, s % 2 ? 0.25 : -0.25);
};

// ---------- sound effects: five materials, one room ----------
const normalize = (buf) => {
  let peak = 0;
  for (const v of buf) peak = Math.max(peak, Math.abs(v));
  if (peak > 0) for (let i = 0; i < buf.length; i++) buf[i] /= peak;
  return buf;
};
const place = (buf, t0, gain, pan, send) => {
  mixMono(sfxBus, t0, buf, pan, gain);
  mixMono(sfxSend, t0, buf, pan, gain * send);
};
const panOf = (x) => ((x - 540) / 540) * 0.6;

// Air: noise through a band-pass whose centre glides f0 -> f1, sine envelope.
const sfxAir = (t0, dur, f0, f1, q, gain, pan = 0, send = 0.55) => {
  const n = Math.floor(dur * SR);
  const buf = new Float32Array(n);
  for (let i = 0; i < n; i++) buf[i] = noise();
  svf(buf, (i) => f0 * (f1 / f0) ** (i / n), q, "bp");
  svf(buf, 5500, 0.7, "lp");
  for (let i = 0; i < n; i++) buf[i] *= Math.sin(Math.PI * (i / n)) ** 1.6;
  place(normalize(buf), t0, gain, pan, send);
};
// Glass: a fundamental with inharmonic partials and a noise transient.
const sfxGlass = (t0, f, dur, gain, pan = 0, send = 0.45) => {
  const n = Math.floor(dur * SR);
  const buf = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    buf[i] =
      Math.sin(2 * Math.PI * f * t) * Math.exp(-t / (dur * 0.33)) +
      0.45 *
        Math.sin(2 * Math.PI * 2.76 * f * t) *
        Math.exp(-t / (dur * 0.16)) +
      0.22 * Math.sin(2 * Math.PI * 5.4 * f * t) * Math.exp(-t / (dur * 0.08)) +
      0.5 * noise() * Math.exp(-t / 0.003);
  }
  place(normalize(buf), t0, gain, pan, send);
};
// Wood: a low knock with a pitch drop and a filtered snap.
const sfxWood = (t0, f, dur, gain, pan = 0, send = 0.25) => {
  const n = Math.floor(dur * SR);
  const buf = new Float32Array(n);
  const snap = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * f * (1 + 1.2 * Math.exp(-t / 0.01))) / SR;
    buf[i] = Math.sin(ph) * Math.exp(-t / (dur * 0.25));
    snap[i] = noise() * Math.exp(-t / 0.0025);
  }
  svf(snap, 3200, 1.2, "bp");
  for (let i = 0; i < n; i++) buf[i] = buf[i] + 0.9 * snap[i];
  place(normalize(buf), t0, gain, pan, send);
};
// Bubble: a resonance rising as it closes, with a tiny noise onset.
const sfxBubble = (t0, f, dur, gain, pan = 0, send = 0.35) => {
  const n = Math.floor(dur * SR);
  const buf = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * f * (1 + 0.7 * (t / dur))) / SR;
    buf[i] =
      Math.sin(ph) * Math.exp(-t / (dur * 0.3)) +
      0.3 * noise() * Math.exp(-t / 0.002);
  }
  place(normalize(buf), t0, gain, pan, send);
};
// A tap: press and release, two wood hits 65 ms apart.
const sfxTap = (t0, gain, pan) => {
  sfxWood(t0, 190, 0.12, gain, pan);
  sfxWood(t0 + 0.065, 150, 0.1, gain * 0.7, pan);
};

// ---------- arrangement ----------
for (let bar = 0; bar < BARS; bar++) {
  const name = PLAN[bar];
  const notes = CHORDS[name];
  const root = ROOT[name];
  const count = bar === 0;
  const torrent = bar === 1;
  const hold = bar === 2;
  const question = bar === 3;
  const groove = bar >= DROP && bar < END;
  const second = bar >= DROP + 2 && bar < END;
  const build2 = bar === BUILD;
  const ending = bar >= END;

  // Kick: afro bounce in the groove, four to the floor in the torrent, a
  // heartbeat under the question.
  if (groove) {
    for (const [s, v] of [
      [0, 1],
      [6, 0.85],
      [8, 0.55],
      [10, 0.9],
    ])
      kick(at16(bar, s), v);
  } else if (torrent) {
    for (let b = 0; b < 4; b++) kick(at(bar, b), 0.5 + 0.1 * b);
    kick(at16(bar, 10), 0.5);
    kick(at16(bar, 14), 0.62);
  } else if (question) {
    kick(at(bar, 0), 0.5);
    kick(at(bar, 0) + 0.18, 0.36);
    kick(at(bar, 2), 0.55);
    kick(at(bar, 2) + 0.18, 0.4);
  }

  // Snare, clap and rim on 2 and 4, the clave (3-3-2) on the rim.
  if (groove) {
    for (const s of [4, 12]) {
      snare(at16(bar, s), 0.5, 1);
      clap(at16(bar, s), 0.42);
      rim(at16(bar, s), 0.4, 0.1);
    }
  }
  if (groove || torrent || count) {
    for (const s of [0, 3, 6, 10, 13])
      rim(
        at16(bar, s),
        groove ? 0.32 : count ? 0.2 : 0.26,
        s % 2 ? 0.35 : -0.35,
      );
  }
  if (torrent) {
    clap(at(bar, 1), 0.3);
    clap(at(bar, 3), 0.32);
  }
  if (question) {
    rim(at(bar, 1), 0.2, -0.3);
    rim(at(bar, 3), 0.2, 0.3);
  }

  // Hats, shaker, open hats, ride. Nothing in the hold.
  for (let s = 0; s < 16; s++) {
    const t = at16(bar, s);
    if (hold || (ending && bar > END)) continue;
    const quiet = count || question || ending;
    if (torrent && s % 2 === 0)
      hat(t, 0.18 + 0.012 * s, false, s % 4 ? 0.2 : -0.2);
    if (groove && s % 2 === 0)
      hat(t, s % 8 === 0 ? 0.36 : 0.26, false, s % 4 ? 0.2 : -0.2);
    if (groove && second && s % 4 === 3) hat(t, 0.16, false, 0.3);
    if (quiet && s % 2) continue;
    shaker(
      t,
      (quiet ? 0.12 : s % 2 ? 0.26 : 0.15) * (0.85 + rand() * 0.3),
      s % 2 ? -0.4 : 0.4,
    );
  }
  if (groove) hat(at16(bar, 14), 0.26, true, 0.1);
  if (groove && second) hat(at16(bar, 6), 0.18, true, -0.1);
  if (second) for (let b = 0; b < 4; b++) ride(at(bar, b), 0.08);

  // Congas, syncopated, more of them in the second half of the groove.
  if (groove) {
    const hits = second
      ? [
          [2, 330],
          [5, 247],
          [7, 247],
          [11, 330],
          [15, 247],
        ]
      : [
          [2, 330],
          [7, 247],
          [11, 330],
          [15, 247],
        ];
    for (const [s, f] of hits)
      conga(at16(bar, s), f > 300 ? 0.48 : 0.42, f, f > 300 ? 0.35 : -0.35);
  }
  // Conga fill into the hit and into the final chord.
  if (torrent || build2) {
    for (let s = 8; s < 16; s++)
      conga(
        at16(bar, s),
        0.25 + 0.04 * (s - 8),
        s % 2 ? 247 : 330,
        s % 2 ? -0.3 : 0.3,
      );
  }

  // Log-drum bass.
  if (groove) {
    for (const [s, semis, v] of LOG_PATTERN)
      logDrum(at16(bar, s), root + semis, v);
  } else if (torrent) {
    logDrum(at(bar, 0), root, 0.7);
    logDrum(at16(bar, 6), root, 0.45);
    logDrum(at16(bar, 11), root, 0.55);
  } else if (question) {
    logDrum(at(bar, 0), root, 0.6);
    logDrum(at(bar, 2), root, 0.5);
  } else if (bar === END) {
    logDrum(at(bar, 0), root, 1);
  }

  // Chords: a pad that opens towards the drop, Rhodes, plucks in the week.
  if (count) {
    rhodes(at(bar, 0), BEAT * 1.6, notes, 0.3);
    supersaw(at(bar, 0), BAR, notes, 0.011, () => 700);
    marimba(at16(bar, 6), 76, 0.22, 0.2);
    marimba(at16(bar, 12), 72, 0.18, -0.2);
  } else if (torrent) {
    rhodes(at(bar, 0), BEAT * 1.6, notes, 0.34);
    rhodes(at16(bar, 8), BEAT * 0.8, notes, 0.3);
    supersaw(
      at(bar, 0),
      BAR,
      notes,
      0.014,
      (t) => 700 * 3 ** ((t - at(bar, 0)) / BAR),
    );
    playRiff(bar, 0.28);
  } else if (hold) {
    // One breath: the low pad, and a single chord when "DM" lands.
    supersaw(at(bar, 0), BAR, notes, 0.006, () => 500, 0.8);
    rhodes(at(bar, 2), BEAT * 2, notes, 0.24);
  } else if (question) {
    supersaw(
      at(bar, 0),
      BAR,
      notes,
      0.012,
      (t) => 600 * 2.5 ** ((t - at(bar, 0)) / BAR),
    );
    rhodes(at(bar, 0), BEAT * 1.6, notes, 0.3);
    rhodes(at(bar, 2), BEAT * 1.2, notes, 0.32);
  } else if (groove) {
    rhodes(at(bar, 0), BEAT * 1.6, notes, 0.42);
    rhodes(at16(bar, 7), BEAT * 0.45, notes, 0.3);
    rhodes(at16(bar, 12), BEAT * 0.8, notes, 0.34);
    supersaw(at(bar, 0), BAR, notes, 0.018, () => 2200);
    if (second)
      for (const s of [2, 5, 9, 13])
        pluck(
          at16(bar, s),
          notes[(s + bar) % notes.length] + 12,
          0.13,
          s % 2 ? 0.4 : -0.4,
          1.1,
        );
  } else if (bar === END) {
    rhodes(at(bar, 0), BAR * 2, notes, 0.5);
    supersaw(at(bar, 0), BAR * 1.8, notes, 0.02, () => 1800, 0.6);
  }

  // The marimba riff and the "eh-eh" chops answering it.
  if (groove && !build2) {
    playRiff(bar, second ? 0.5 : 0.45);
    if (bar === DROP + 4) playRiff(bar, 0.2, 12);
    if (bar % 2 === 1) {
      voxNote(at16(bar, 12), BEAT * 0.3, 72, second ? 0.15 : 0.12, "e", 0.15);
      voxNote(at16(bar, 14), BEAT * 0.4, 69, second ? 0.17 : 0.14, "e", 0.15);
    }
    if (bar % 2 === 0 && second)
      voxNote(at16(bar, 6), BEAT * 0.35, 67, 0.14, "o", -0.15);
  }
  if (build2) {
    playRiff(bar, 0.4, 12);
    for (let s = 8; s < 16; s++)
      marimba(at16(bar, s), 79 + (s % 2) * 2, 0.25, 0);
  }
  if (bar === END) {
    for (const [b, m] of [
      [0, 72],
      [0.5, 76],
      [1, 79],
      [1.5, 84],
      [2.5, 79],
      [3, 84],
    ])
      marimba(at(bar, b), m, 0.42, b % 1 ? 0.3 : -0.3);
    voxNote(at(bar, 2), BEAT * 0.5, 72, 0.14, "e", 0.1);
  }
  if (bar === END + 1) {
    marimba(at(bar, 0), 84, 0.3, 0.2);
    marimba(at(bar, 1), 79, 0.22, -0.2);
  }
}

// Builds and accents, on the film's own beats.
riser(at(1, 0), BAR, 0.14);
roll(at(1, 2), 2, 0.18, 0.55);
reverseCrash(beats.hit47, 1.0, 0.2);
crash(beats.hit47, 0.26);
impact(beats.hit47, 0.75);
riser(at(3, 2), BEAT * 2, 0.16);
roll(at(3, 3), 1, 0.22, 0.5);
reverseCrash(at(DROP, 0), 1.1, 0.22);
crash(at(DROP, 0), 0.3);
impact(at(DROP, 0), 0.6);
downlifter(at(DROP, 0) + 0.05, 1.4, 0.07);
riser(at(BUILD, 0), BAR, 0.15);
reverseCrash(at(END, 0), 1.3, 0.22);
crash(at(END, 0), 0.3);
impact(at(END, 0), 0.6);

// ---------- the effects score, from the beat table ----------
beats.landings
  .slice(0, 4)
  .forEach((t, i) => sfxBubble(t, 440 * 1.12 ** i, 0.16, 0.5, 0.15));
beats.landings
  .slice(4, 12)
  .forEach((t, i) =>
    sfxBubble(t, 700 * 1.06 ** i, 0.12, 0.36 - i * 0.035, 0.2),
  );
sfxAir(beats.dmLine, 0.5, 500, 1800, 2.5, 0.28, 0, 0.6);
sfxWood(beats.question, 220, 0.14, 0.22, -0.1);
sfxWood(beats.question + 0.14, 200, 0.14, 0.22, 0.1);
sfxTap(beats.tap47, 0.6, panOf(612));
sfxAir(beats.iris[0], 0.5, 300, 2600, 2, 0.4, 0, 0.6);
sfxBubble(beats.chip[1], 280, 0.2, 0.3, 0);
sfxTap(beats.tapChip, 0.55, panOf(600));
sfxAir(beats.card[0], 0.55, 400, 1400, 2.5, 0.25, 0, 0.5);
sfxBubble(beats.card[1], 240, 0.22, 0.4, 0);
for (const [t, x] of [
  [beats.tapService, 700],
  [beats.tapDay, 581],
  [beats.tapSlot, 399],
  [beats.tapConfirm, 490],
])
  sfxTap(t, 0.5, panOf(x));
sfxAir(beats.step2, 0.4, 600, 1600, 2.5, 0.22, 0.3, 0.5);
sfxGlass(beats.confirmed, midi(84), 0.9, 0.42, 0);
sfxGlass(beats.confirmed + 0.06, midi(88), 0.9, 0.3, 0.1);
sfxAir(beats.hop[0], 0.6, 400, 1700, 2.5, 0.3, 0, 0.5);
sfxWood(beats.hop[1], 180, 0.16, 0.6, 0.1);
sfxGlass(beats.hop[1], midi(79), 0.5, 0.3, 0.1);
const SCALE = [72, 74, 76, 79, 81, 84, 86, 88, 91, 93, 96];
beats.burst.forEach((t, i) =>
  sfxGlass(t, midi(SCALE[i]), 0.45, 0.38, ((i % 4) - 1.5) * 0.25),
);
sfxAir(beats.result[0], 0.8, 1800, 400, 2.5, 0.28, 0, 0.5);
sfxAir(beats.gather[0], 0.55, 500, 2200, 2.5, 0.32, 0, 0.6);
sfxWood(beats.logo, 120, 0.22, 0.6, 0);
[72, 76, 79].forEach((m, i) =>
  sfxGlass(beats.logo + i * 0.03, midi(m), 1.1, 0.3, (i - 1) * 0.3),
);
sfxWood(beats.pill, 160, 0.18, 0.5, 0);
sfxGlass(beats.site, midi(91), 0.5, 0.18, 0);

// ---------- sidechain pump (light, Afrobeats breathes rather than pumps) ----------
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
pump(chords, 0.4, 0.22);
pump(bassBus, 0.35, 0.14);
pump(leads, 0.12, 0.18);
pump(vox, 0.18, 0.18);
pump(perc, 0.18, 0.1);

// Keep the music above the kick and bass.
for (const b of [chords, leads, vox]) {
  svf(b[0], 150, 0.7, "hp");
  svf(b[1], 150, 0.7, "hp");
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
  perc: 1.5,
  bass: 1.35,
  chords: 1.7,
  leads: 2.2,
  vox: 3.6,
  fx: 0.9,
  echo: 0.35,
  wet: wetGain,
};
const dB = (x) => (20 * Math.log10(x + 1e-12)).toFixed(1);
const grooveWindow = [at(DROP, 0), at(10, 0)];
console.log(
  `groove rms dB: drums ${dB(rms(drums[0], ...grooveWindow) * GAIN.drums)} perc ${dB(rms(perc[0], ...grooveWindow) * GAIN.perc)} bass ${dB(rms(bassBus[0], ...grooveWindow) * GAIN.bass)} chords ${dB(rms(chords[0], ...grooveWindow) * GAIN.chords)} leads ${dB(rms(leads[0], ...grooveWindow) * GAIN.leads)} vox ${dB(rms(vox[0], ...grooveWindow) * GAIN.vox)}`,
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

// ---------- duck the music under the taps and the hits ----------
const DUCKS = [
  beats.tap47,
  beats.tapChip,
  beats.tapService,
  beats.tapDay,
  beats.tapSlot,
  beats.tapConfirm,
  beats.confirmed,
  beats.hop[1],
  beats.logo,
];
for (const td of DUCKS) {
  const i0 = Math.max(0, Math.floor((td - 0.012) * SR));
  const i1 = Math.min(N, Math.floor((td + 0.34) * SR));
  for (let i = i0; i < i1; i++) {
    const dt = i / SR - td;
    const e =
      dt < 0 ? 1 + dt / 0.012 : dt < 0.08 ? 1 : Math.exp(-(dt - 0.08) / 0.09);
    const g = 1 - 0.45 * e;
    L[i] *= g;
    R[i] *= g;
  }
}

// ---------- master: mono low end, soft clip, air, fade, limiter ----------
const side = new Float32Array(N);
const mid = new Float32Array(N);
for (let i = 0; i < N; i++) {
  mid[i] = (L[i] + R[i]) * 0.5;
  side[i] = (L[i] - R[i]) * 0.5;
}
svf(side, 150, 0.7, "hp");
const drive = 0.42 / rms(mid, ...grooveWindow);
for (let i = 0; i < N; i++) {
  L[i] = Math.tanh((mid[i] + side[i]) * drive * 0.9) / 0.9;
  R[i] = Math.tanh((mid[i] - side[i]) * drive * 0.9) / 0.9;
}
for (const ch of [L, R]) {
  const air = svf(Float32Array.from(ch), 6500, 0.7, "hp");
  for (let i = 0; i < N; i++) ch[i] += 0.32 * air[i];
}
// Fade out over the last 1.4 s, so the end card lands in silence.
const fadeFrom = Math.floor((LENGTH - 1.4) * SR);
for (let i = fadeFrom; i < N; i++) {
  const g = 1 - (i - fadeFrom) / (N - fadeFrom);
  L[i] *= g * g;
  R[i] *= g * g;
}

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

// ---------- the effects in the same room, peaks at -6 dBFS ----------
const sfxWet = reverb(sfxSend[0], sfxSend[1]);
svf(sfxWet[0], 300, 0.7, "hp");
svf(sfxWet[1], 300, 0.7, "hp");
const SL = new Float32Array(N);
const SRr = new Float32Array(N);
let sfxPeak = 0;
for (let i = 0; i < N; i++) {
  SL[i] = sfxBus[0][i] + 0.9 * sfxWet[0][i];
  SRr[i] = sfxBus[1][i] + 0.9 * sfxWet[1][i];
  sfxPeak = Math.max(sfxPeak, Math.abs(SL[i]), Math.abs(SRr[i]));
}
const sfxGain = sfxPeak > 0 ? 0.7 / sfxPeak : 1;
for (let i = 0; i < N; i++) {
  SL[i] = Math.tanh(SL[i] * sfxGain * 1.3) / 1.3;
  SRr[i] = Math.tanh(SRr[i] * sfxGain * 1.3) / 1.3;
}

// ---------- write 16-bit stereo WAVs, then mp3s when ffmpeg is around ----------
const musicDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "music",
);
fs.mkdirSync(musicDir, { recursive: true });
const writeWav = (file, A, Bc) => {
  const data = Buffer.alloc(N * 4);
  for (let i = 0; i < N; i++) {
    data.writeInt16LE(
      Math.round(Math.max(-1, Math.min(1, A[i])) * 32767),
      i * 4,
    );
    data.writeInt16LE(
      Math.round(Math.max(-1, Math.min(1, Bc[i])) * 32767),
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
  fs.writeFileSync(file, Buffer.concat([header, data]));
  console.log(`wrote ${file}`);
};
writeWav(path.join(musicDir, "47-theme.wav"), L, R);
writeWav(path.join(musicDir, "47-sfx.wav"), SL, SRr);
console.log(
  `length ${LENGTH.toFixed(2)} s, ${BARS} bars at ${BPM} BPM, limiter max reduction ${dB(maxReduction)} dB, sfx peak ${dB(sfxPeak * sfxGain)} dBFS before the soft clip`,
);

const ffmpegCandidates = [
  "ffmpeg",
  path.join(
    musicDir,
    "..",
    "..",
    "node_modules",
    "@remotion",
    "compositor-linux-x64-gnu",
    "ffmpeg",
  ),
];
const ffmpeg = ffmpegCandidates.find(
  (bin) => spawnSync(bin, ["-version"]).status === 0,
);
if (ffmpeg) {
  for (const name of ["47-theme", "47-sfx"]) {
    const res = spawnSync(ffmpeg, [
      "-y",
      "-loglevel",
      "error",
      "-i",
      path.join(musicDir, `${name}.wav`),
      "-codec:a",
      "libmp3lame",
      "-b:a",
      "192k",
      path.join(musicDir, `${name}.mp3`),
    ]);
    console.log(
      res.status === 0
        ? `wrote ${name}.mp3`
        : `mp3 failed for ${name}: ${res.stderr}`,
    );
  }
} else {
  console.log("ffmpeg not found: convert the WAVs to mp3 yourself");
}
