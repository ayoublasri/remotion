// Generates the royalty-free soundtrack for the gift reel: an energetic,
// catchy electro-house track at 120 BPM (exactly 15 frames per beat and 60
// frames per bar at 30 fps), 16 bars plus a tail. Punchy four-on-the-floor
// drums, an offbeat bass, pumping supersaw chords, a syncopated synth hook,
// pluck arpeggios, risers, snare rolls and two drops. Everything is
// synthesised here.
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
const BARS = 16;
const TAIL = 3;
const LENGTH = BARS * BAR + TAIL;
const N = Math.ceil(LENGTH * SR);

const bus = () => [new Float32Array(N), new Float32Array(N)];
const drums = bus();
const bassBus = bus();
const chords = bus();
const leads = bus();
const fx = bus();
const reverbSend = bus();
const delaySend = bus();

let seed = 20261005;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const noise = () => rand() * 2 - 1;
const midi = (m) => 440 * 2 ** ((m - 69) / 12);
const at = (bar, beat) => bar * BAR + beat * BEAT;

// ---------- song map (0-based bars), matching the reel ----------
//   0-1   hook: filtered intro over a driving kick, snare roll and riser
//   2-4   reveal: DROP 1 (full groove, synth hook)
//   5-6   for whom: plucks over the groove, no hook
//   7-8   offer: the hook returns
//   9-11  how it works: driving groove with plucks (room for the UI sounds)
//   12    build: snare roll, riser, filter sweep
//   13-15 call to action: DROP 2, hook doubled an octave up
//   16    final hit, rings out
const DROP = 2;
const FOR_WHOM = 5;
const OFFER = 7;
const HOW = 9;
const BUILD = 12;
const CTA = 13;

const CHORDS = {
  Am: { notes: [57, 60, 64, 69], root: 33 },
  F: { notes: [57, 60, 65, 69], root: 29 },
  C: { notes: [55, 60, 64, 67], root: 36 },
  G: { notes: [55, 59, 62, 67], root: 31 },
};
const PLAN = [
  "F",
  "G",
  "Am",
  "F",
  "C",
  "G",
  "Am",
  "F",
  "C",
  "G",
  "Am",
  "F",
  "G",
  "Am",
  "F",
  "C",
];

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

// Band-limited sawtooth correction (PolyBLEP).
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

// Zero-delay-feedback state-variable filter; cutoff is a number or a
// function of the sample index.
const svf = (buf, cutoff, q, mode = "lp") => {
  let ic1 = 0;
  let ic2 = 0;
  const k = 1 / q;
  const fixed = typeof cutoff === "number";
  let g = fixed ? Math.tan((Math.PI * Math.min(cutoff, SR * 0.45)) / SR) : 0;
  for (let i = 0; i < buf.length; i++) {
    if (!fixed)
      g = Math.tan(
        (Math.PI * Math.min(Math.max(cutoff(i), 20), SR * 0.45)) / SR,
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
    buf[i] = mode === "lp" ? v2 : mode === "bp" ? v1 : v0 - k * v1 - v2;
  }
  return buf;
};

// ---------- drums ----------
const kickTimes = [];

const kick = (t0, vel) => {
  kickTimes.push(t0);
  const n = Math.floor(0.45 * SR);
  const buf = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const f = 47 + 125 * Math.exp(-t / 0.032) + 280 * Math.exp(-t / 0.004);
    ph += (2 * Math.PI * f) / SR;
    const body = Math.sin(ph) * Math.min(1, t / 0.0012) * Math.exp(-t / 0.2);
    const click = noise() * Math.exp(-t / 0.0012) * 0.45;
    buf[i] = Math.tanh(2.4 * (body + click));
  }
  mixMono(drums, t0, buf, 0, 0.82 * vel);
};

const clap = (t0, vel) => {
  const n = Math.floor(0.4 * SR);
  const buf = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let env = 0;
    for (const o of [0, 0.01, 0.021])
      if (t >= o) env = Math.max(env, Math.exp(-(t - o) / 0.0055));
    if (t >= 0.028) env = Math.max(env, 0.75 * Math.exp(-(t - 0.028) / 0.1));
    buf[i] = noise() * env;
  }
  svf(buf, 1350, 0.8, "bp");
  mixMono(drums, t0, buf, 0.04, 1.9 * vel);
  mixMono(reverbSend, t0, buf, 0, 0.7 * vel);
};

const hat = (t0, vel, open, pan) => {
  const n = Math.floor((open ? 0.32 : 0.07) * SR);
  const buf = new Float32Array(n);
  for (let i = 0; i < n; i++)
    buf[i] = noise() * Math.exp(-i / SR / (open ? 0.11 : 0.02));
  svf(buf, 7800, 0.75, "hp");
  mixMono(drums, t0, buf, pan, vel);
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
  svf(buf, 220, 0.7, "hp");
  mixMono(drums, t0, buf, 0, vel);
  mixMono(reverbSend, t0, buf, 0, vel * 0.35);
};

// Snare roll accelerating from eighths to thirty-seconds over `beats` beats.
const roll = (t0, beats, from, to) => {
  const end = t0 + beats * BEAT;
  let t = t0;
  while (t < end - 1e-6) {
    const p = (t - t0) / (end - t0);
    const step = p < 0.5 ? BEAT / 2 : p < 0.75 ? BEAT / 4 : BEAT / 8;
    snare(t, from + (to - from) * p ** 1.5, 1 + 0.35 * p);
    t += step;
  }
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

// ---------- effects ----------
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
    ph += (2 * Math.PI * (180 * 2 ** (p * 2.2))) / SR;
    tone[i] = (Math.sin(ph) + 0.5 * Math.sin(2 * ph)) * e * 0.25;
  }
  const sweep = (i) => 350 * (9500 / 350) ** (i / n);
  svf(L, sweep, 2.2, "bp");
  svf(R, sweep, 2.2, "bp");
  mixStereo(fx, t0, L, R, vel);
  mixMono(fx, t0, tone, 0, vel);
};

const impact = (t0, vel) => {
  const n = Math.floor(1.8 * SR);
  const buf = new Float32Array(n);
  const hit = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (34 + 46 * Math.exp(-t / 0.12))) / SR;
    buf[i] = Math.sin(ph) * Math.exp(-t / 0.55);
    hit[i] = noise() * Math.exp(-t / 0.07);
  }
  svf(hit, 900, 0.7, "lp");
  for (let i = 0; i < n; i++) buf[i] = Math.tanh(1.6 * (buf[i] + 0.8 * hit[i]));
  mixMono(fx, t0, buf, 0, vel);
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
  mixStereo(fx, t0, L, R, vel);
};

// ---------- instruments ----------
const bassNote = (t0, dur, m, vel) => {
  const n = Math.floor((dur + 0.03) * SR);
  const buf = new Float32Array(n);
  const f = midi(m);
  const dt = f / SR;
  let ph = rand();
  let sub = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += dt;
    if (ph >= 1) ph -= 1;
    const saw = 2 * ph - 1 - blep(ph, dt);
    sub += (2 * Math.PI * f) / SR;
    const env =
      Math.min(1, t / 0.003) *
      Math.exp(-t / 0.28) *
      (t < dur ? 1 : Math.exp(-(t - dur) / 0.008));
    buf[i] = (0.6 * saw + 0.85 * Math.sin(sub)) * env;
  }
  svf(buf, (i) => 160 + 2600 * Math.exp(-i / SR / 0.05), 1.6, "lp");
  for (let i = 0; i < n; i++) buf[i] = Math.tanh(1.7 * buf[i]);
  mixMono(bassBus, t0, buf, 0, vel);
};

const DETUNE = [-0.2, -0.12, -0.05, 0, 0.05, 0.12, 0.2];

// Supersaw chord; cutoff is a function of the absolute time in seconds.
const supersaw = (t0, dur, notes, vel, cutoffAt, release = 0.12) => {
  const n = Math.floor((dur + release) * SR);
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  for (const m of notes) {
    DETUNE.forEach((d, v) => {
      const dt = midi(m + d) / SR;
      let ph = rand();
      const pan = ((v / (DETUNE.length - 1)) * 2 - 1) * 0.85;
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

// The hook: two detuned saws and a square, a filter envelope and a little
// vibrato on long notes, with a soft bell an octave up for sparkle.
const leadNote = (t0, dur, m, vel, cutoffMax) => {
  const n = Math.floor((dur + 0.1) * SR);
  const buf = new Float32Array(n);
  const f = midi(m);
  const saws = [-0.09, 0.09].map((d) => ({ r: 2 ** (d / 12), ph: rand() }));
  let sq = rand();
  let bell = 0;
  const bellBuf = new Float32Array(n);
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
  mixMono(leads, t0, bellBuf, 0.15, vel * 0.22);
  mixMono(delaySend, t0, buf, 0, vel * 0.45);
  mixMono(reverbSend, t0, buf, 0, vel * 0.4);
};

const playHook = (bar, vel, cutoffMax, octave = 0) => {
  for (const [b, m, d] of HOOK[PLAN[bar]])
    leadNote(at(bar, b), d * BEAT * 0.92, m + octave, vel, cutoffMax);
};

// ---------- arrangement ----------
for (let bar = 0; bar < BARS; bar++) {
  const name = PLAN[bar];
  const { notes, root } = CHORDS[name];
  const intro = bar < DROP;
  const drop = (bar >= DROP && bar < FOR_WHOM) || bar >= CTA;
  const forWhom = bar >= FOR_WHOM && bar < OFFER;
  const offer = bar >= OFFER && bar < HOW;
  const how = bar >= HOW && bar < BUILD;
  const build = bar === BUILD;

  // Kick: four on the floor; the build keeps only beats 1-2, the intro drops
  // the last beat before the first drop.
  for (let b = 0; b < 4; b++) {
    if (build && b >= 2) continue;
    if (bar === DROP - 1 && b === 3) continue;
    kick(at(bar, b), intro ? 0.85 : 1);
  }

  // Claps on 2 and 4 from the first drop.
  if (!intro && !build) {
    clap(at(bar, 1), 0.5);
    clap(at(bar, 3), 0.5);
  }

  // Hats: sixteenths everywhere, open hats on the offbeats when it is full.
  for (let s = 0; s < 16; s++) {
    if (build && s >= 8) continue;
    const accent = s % 4 === 2 ? 0.11 : s % 2 === 1 ? 0.06 : 0.045;
    hat(
      at(bar, s / 4),
      accent * (intro ? 0.8 : 1) * (0.85 + rand() * 0.3),
      false,
      s % 2 ? 0.25 : -0.2,
    );
  }
  if (drop || offer || how) {
    for (let b = 0; b < 4; b++)
      hat(at(bar, b + 0.5), how ? 0.1 : 0.14, true, 0.1);
  }

  // Offbeat bass, the electro-house pump.
  if (!intro && !build) {
    for (let b = 0; b < 4; b++)
      bassNote(at(bar, b + 0.5), BEAT * 0.42, root, 0.5);
  }
  if (build) {
    for (let s = 0; s < 8; s++)
      bassNote(
        at(bar, s / 2),
        BEAT * 0.3,
        root + (s >= 4 ? 12 : 0),
        0.32 + s * 0.03,
      );
  }

  // Supersaw chords: filtered in the intro, wide open on the drops.
  if (intro) {
    supersaw(
      at(bar, 0),
      BAR,
      notes,
      0.03,
      (t) => 320 * (3600 / 320) ** Math.min(1, t / (DROP * BAR)),
    );
  } else if (drop) {
    supersaw(at(bar, 0), BAR, notes, 0.034, () => (bar >= CTA ? 7200 : 6200));
  } else if (offer) {
    supersaw(at(bar, 0), BAR, notes, 0.03, () => 5200);
  } else if (forWhom || how) {
    supersaw(at(bar, 0), BAR, notes, 0.022, () => 2400);
  } else if (build) {
    supersaw(
      at(bar, 0),
      BAR,
      notes,
      0.028,
      (t) => 1500 * 4.5 ** ((t - at(BUILD, 0)) / BAR),
    );
  }

  // Pluck arpeggios in the calmer sections.
  if (forWhom || how || build) {
    const tones = [...notes.map((m) => m + 12), notes[1] + 24, notes[2] + 24];
    for (let s = 0; s < 16; s++) {
      const m = tones[(s * 3) % tones.length];
      pluck(
        at(bar, s / 4),
        m,
        s % 4 === 0 ? 0.16 : 0.1,
        s % 2 ? 0.35 : -0.35,
        how ? 0.8 : 1,
      );
    }
  }

  // The hook.
  if (intro) playHook(bar, 0.13, 1600 + bar * 900);
  if ((bar >= DROP && bar < FOR_WHOM) || offer) playHook(bar, 0.2, 7500);
  if (bar >= CTA) {
    playHook(bar, 0.2, 8000);
    playHook(bar, 0.08, 6000, 12);
  }

  // Accents.
  if ([DROP, FOR_WHOM, OFFER, HOW, CTA].includes(bar))
    crash(at(bar, 0), bar === DROP || bar === CTA ? 0.26 : 0.15);
  if (bar === DROP || bar === CTA) {
    impact(at(bar, 0), 0.62);
    downlifter(at(bar, 0) + 0.05, 1.6, 0.1);
  }
}

// Builds into the two drops.
roll(at(DROP - 1, 1), 3, 0.12, 0.5);
riser(at(DROP - 1, 0), BAR, 0.16);
reverseCrash(at(DROP, 0), 1.3, 0.22);
roll(at(BUILD, 0), 4, 0.1, 0.55);
riser(at(BUILD, 0), BAR, 0.2);
reverseCrash(at(CTA, 0), 1.3, 0.24);

// Ending: a last big chord with the kick, the hook's final note, a crash.
kick(at(BARS, 0), 1);
impact(at(BARS, 0), 0.4);
supersaw(
  at(BARS, 0),
  1.6,
  CHORDS.C.notes,
  0.034,
  (t) => 6500 * Math.exp(-(t - at(BARS, 0)) / 1.2) + 600,
  0.6,
);
leadNote(at(BARS, 0), 1.2, 72, 0.18, 7000);
crash(at(BARS, 0), 0.24);

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
pump(chords, 0.78, 0.3);
pump(bassBus, 0.4, 0.16);
pump(leads, 0.22, 0.2);

// ---------- delay (ping-pong, dotted eighth) ----------
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
const echo = pingPong(delaySend, BEAT * 0.75, 0.38, 4500);

// ---------- reverb (Freeverb-style) ----------
const reverb = (inL, inR) => {
  const combT = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617];
  const apT = [556, 441, 341, 225];
  const feedback = 0.8;
  const damp = 0.3;
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

const rms = (ch) => {
  let s = 0;
  for (let i = 0; i < N; i++) s += ch[i] * ch[i];
  return Math.sqrt(s / N);
};
const wetGain = (0.6 * rms(leads[0])) / (rms(wet[0]) || 1);

// ---------- master ----------
const GAIN = { drums: 1, bass: 1.1, chords: 2.1, leads: 2.8, fx: 1, echo: 0.4 };
const windowRms = (b, gain, from, to) => {
  let s = 0;
  const i0 = Math.floor(from * SR);
  const i1 = Math.floor(to * SR);
  for (let i = i0; i < i1; i++) s += (b[0][i] * gain) ** 2;
  return (10 * Math.log10(s / (i1 - i0) + 1e-12)).toFixed(1);
};
console.log(
  `drop rms dB: drums ${windowRms(drums, GAIN.drums, at(DROP, 0), at(FOR_WHOM, 0))} bass ${windowRms(bassBus, GAIN.bass, at(DROP, 0), at(FOR_WHOM, 0))} chords ${windowRms(chords, GAIN.chords, at(DROP, 0), at(FOR_WHOM, 0))} leads ${windowRms(leads, GAIN.leads, at(DROP, 0), at(FOR_WHOM, 0))}`,
);
const L = new Float32Array(N);
const R = new Float32Array(N);
let peak = 0;
for (let i = 0; i < N; i++) {
  const mixAt = (c) =>
    drums[c][i] * GAIN.drums +
    bassBus[c][i] * GAIN.bass +
    chords[c][i] * GAIN.chords +
    leads[c][i] * GAIN.leads +
    fx[c][i] * GAIN.fx +
    echo[c][i] * GAIN.echo +
    wet[c][i] * wetGain;
  L[i] = Math.tanh(1.3 * mixAt(0));
  R[i] = Math.tanh(1.3 * mixAt(1));
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const norm = 0.89 / peak;
const fadeStart = Math.floor((LENGTH - 1.6) * SR);
for (let i = 0; i < N; i++) {
  const fade =
    i > fadeStart ? Math.max(0, 1 - (i - fadeStart) / (N - fadeStart)) : 1;
  L[i] *= norm * fade;
  R[i] *= norm * fade;
}

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
console.log(`length ${LENGTH.toFixed(2)} s, ${BARS} bars at ${BPM} BPM`);
const busRms = (b) => (20 * Math.log10(rms(b[0]) + 1e-9)).toFixed(1);
console.log(
  `bus rms dB: drums ${busRms(drums)} bass ${busRms(bassBus)} chords ${busRms(chords)} leads ${busRms(leads)} fx ${busRms(fx)}`,
);
