// Generates the royalty-free soundtrack for the reel: a warm, dreamy
// lo-fi / R&B groove at 100 BPM, 12 bars (28.8 s) plus a short tail.
// Everything is synthesised here, so the track is free to use and the
// tempo is known exactly (1 beat = 18 frames at 30 fps).
//
//   node scripts/make-music.mjs            -> public/music/oyamuse-theme.wav
//   (the render script / README converts it to mp3 with ffmpeg)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const BPM = 100;
const BEAT = 60 / BPM; // 0.6 s
const BAR = BEAT * 4; // 2.4 s
const BARS = 12;
const TAIL = 2.2;
const LENGTH = BARS * BAR + TAIL;
const N = Math.ceil(LENGTH * SR);

const L = new Float32Array(N);
const R = new Float32Array(N);

// Deterministic pseudo random for humanisation.
let seed = 20260908;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};

const midi = (m) => 440 * 2 ** ((m - 69) / 12);
const db = (x) => 10 ** (x / 20);

// Chords (one per bar), looping every 4 bars: Fmaj7 - Em7 - Dm7 - Cmaj7.
const PROGRESSION = [
  { chord: [53, 57, 60, 64], root: 41 },
  { chord: [52, 55, 59, 62], root: 40 },
  { chord: [50, 53, 57, 60], root: 38 },
  { chord: [48, 52, 55, 59], root: 36 },
];

// ---------- helpers ----------

// Add a mono signal produced by `gen(t, i)` for `dur` seconds at `start`,
// panned with constant power.
const add = (start, dur, gen, { pan = 0, gain = 1 } = {}) => {
  const s0 = Math.floor(start * SR);
  const n = Math.floor(dur * SR);
  const gl = Math.cos(((pan + 1) * Math.PI) / 4) * gain;
  const gr = Math.sin(((pan + 1) * Math.PI) / 4) * gain;
  for (let i = 0; i < n; i++) {
    const idx = s0 + i;
    if (idx >= N) break;
    const v = gen(i / SR, i);
    L[idx] += v * gl;
    R[idx] += v * gr;
  }
};

const onePoleLP = (buf, cutoff) => {
  const a = 1 - Math.exp((-2 * Math.PI * cutoff) / SR);
  let y = 0;
  for (let i = 0; i < buf.length; i++) {
    y += a * (buf[i] - y);
    buf[i] = y;
  }
};

const onePoleHP = (buf, cutoff) => {
  const a = 1 - Math.exp((-2 * Math.PI * cutoff) / SR);
  let lp = 0;
  for (let i = 0; i < buf.length; i++) {
    lp += a * (buf[i] - lp);
    buf[i] = buf[i] - lp;
  }
};

// Biquad band-pass (constant skirt gain).
const bandPass = (buf, f0, q) => {
  const w0 = (2 * Math.PI * f0) / SR;
  const alpha = Math.sin(w0) / (2 * q);
  const b0 = alpha,
    b1 = 0,
    b2 = -alpha;
  const a0 = 1 + alpha,
    a1 = -2 * Math.cos(w0),
    a2 = 1 - alpha;
  let x1 = 0,
    x2 = 0,
    y1 = 0,
    y2 = 0;
  for (let i = 0; i < buf.length; i++) {
    const x0 = buf[i];
    const y0 =
      (b0 / a0) * x0 +
      (b1 / a0) * x1 +
      (b2 / a0) * x2 -
      (a1 / a0) * y1 -
      (a2 / a0) * y2;
    x2 = x1;
    x1 = x0;
    y2 = y1;
    y1 = y0;
    buf[i] = y0;
  }
};

// Render a noise burst through a filter chain, then add it.
const noiseHit = (start, dur, shape, filters, opts) => {
  const n = Math.floor(dur * SR);
  const buf = new Float32Array(n);
  for (let i = 0; i < n; i++) buf[i] = (rand() * 2 - 1) * shape(i / SR);
  for (const f of filters) f(buf);
  add(start, dur, (_, i) => buf[i], opts);
};

// ---------- instruments ----------

// Electric-piano-like chord note: additive partials, soft attack, slow decay, light tremolo + detune.
const keysNote = (start, dur, m, vel) => {
  const f = midi(m);
  const det = 1.0025;
  add(
    start,
    dur,
    (t) => {
      const env =
        Math.min(1, t / 0.012) *
        Math.exp(-t / 0.9) *
        (t > dur - 0.08 ? (dur - t) / 0.08 : 1);
      const trem = 1 - 0.08 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 4.3 * t));
      const w = 2 * Math.PI * f * t;
      const w2 = 2 * Math.PI * f * det * t;
      const a =
        Math.sin(w) +
        0.42 * Math.sin(2 * w) * Math.exp(-t / 0.5) +
        0.16 * Math.sin(3 * w) * Math.exp(-t / 0.3) +
        0.06 * Math.sin(4 * w) * Math.exp(-t / 0.2);
      const b = Math.sin(w2) + 0.3 * Math.sin(2 * w2) * Math.exp(-t / 0.5);
      return env * trem * (0.7 * a + 0.3 * b) * vel;
    },
    { pan: (rand() - 0.5) * 0.5 },
  );
};

const keysChord = (start, dur, chord, vel) => {
  chord.forEach((m, i) =>
    keysNote(start + i * 0.012, dur, m, vel * (i === 0 ? 0.9 : 0.8)),
  );
};

// Sub bass: sine with a touch of 2nd harmonic.
const bassNote = (start, dur, m, vel) => {
  const f = midi(m);
  add(start, dur, (t) => {
    const env =
      Math.min(1, t / 0.006) *
      (t > dur - 0.06 ? Math.max(0, (dur - t) / 0.06) : 1) *
      Math.exp(-t / 1.4);
    const w = 2 * Math.PI * f * t;
    return env * (Math.sin(w) + 0.18 * Math.sin(2 * w)) * vel;
  });
};

// Bell / sparkle: high sine with a 3rd partial, fast decay.
const bellNote = (start, m, vel, pan) => {
  const f = midi(m);
  add(
    start,
    0.9,
    (t) => {
      const env = Math.min(1, t / 0.003) * Math.exp(-t / 0.32);
      const w = 2 * Math.PI * f * t;
      return (
        env * (Math.sin(w) + 0.25 * Math.sin(3 * w) * Math.exp(-t / 0.12)) * vel
      );
    },
    { pan },
  );
};

const kick = (start, vel) => {
  add(start, 0.4, (t) => {
    const f = 46 + 130 * Math.exp(-t / 0.045);
    const phase =
      2 * Math.PI * (46 * t + 130 * 0.045 * (1 - Math.exp(-t / 0.045)));
    const env = Math.exp(-t / 0.13) * Math.min(1, t / 0.002);
    const click = t < 0.004 ? (rand() * 2 - 1) * 0.5 * (1 - t / 0.004) : 0;
    void f;
    return (Math.sin(phase) * env + click) * vel;
  });
};

const clap = (start, vel) => {
  for (let k = 0; k < 3; k++) {
    noiseHit(
      start + k * 0.011,
      0.25,
      (t) => Math.exp(-t / (k === 2 ? 0.09 : 0.03)),
      [(b) => bandPass(b, 1900, 1.1), (b) => onePoleHP(b, 900)],
      { gain: vel * (k === 2 ? 1 : 0.7), pan: 0.05 },
    );
  }
  add(
    start,
    0.12,
    (t) => Math.sin(2 * Math.PI * 190 * t) * Math.exp(-t / 0.04) * vel * 0.6,
  );
};

const hat = (start, vel, open) => {
  noiseHit(
    start,
    open ? 0.35 : 0.08,
    (t) => Math.exp(-t / (open ? 0.11 : 0.018)),
    [(b) => onePoleHP(b, 7500), (b) => onePoleHP(b, 6000)],
    { gain: vel, pan: 0.25 },
  );
};

const shaker = (start, vel) => {
  noiseHit(
    start,
    0.07,
    (t) => Math.exp(-t / 0.02),
    [(b) => onePoleHP(b, 5000)],
    { gain: vel, pan: -0.35 },
  );
};

const crash = (start, vel) => {
  noiseHit(
    start,
    1.6,
    (t) => Math.exp(-t / 0.55) * Math.min(1, t / 0.004),
    [(b) => onePoleHP(b, 4200)],
    {
      gain: vel,
      pan: 0.1,
    },
  );
};

const riser = (start, dur, vel) => {
  noiseHit(
    start,
    dur,
    (t) => (t / dur) ** 2.2,
    [(b) => onePoleHP(b, 1500), (b) => onePoleLP(b, 9000)],
    { gain: vel },
  );
  add(start, dur, (t) => {
    const f = 180 * 2 ** ((t / dur) * 2.2);
    return Math.sin(2 * Math.PI * f * t) * (t / dur) ** 2 * vel * 0.35;
  });
};

// ---------- arrangement ----------

const beatAt = (bar, beat) => bar * BAR + beat * BEAT; // bar and beat are 0-based

for (let bar = 0; bar < BARS; bar++) {
  const { chord, root } = PROGRESSION[bar % 4];
  const intro = bar < 2;
  const last = bar === BARS - 1;

  // Keys: 1, the "and" of 2, and 4.
  keysChord(beatAt(bar, 0), BEAT * 1.6, chord, intro ? 0.11 : 0.13);
  keysChord(beatAt(bar, 1.5), BEAT * 0.9, chord, intro ? 0.08 : 0.1);
  keysChord(beatAt(bar, 3), BEAT * 0.9, chord, intro ? 0.09 : 0.11);
  if (last) keysChord(beatAt(bar, 3), BEAT * 5, chord, 0.13); // ring out

  // Sparkle arpeggio in the second half of each bar.
  const arp = [chord[0] + 24, chord[1] + 24, chord[2] + 24, chord[3] + 24];
  [2, 2.5, 3, 3.5].forEach((b, i) =>
    bellNote(beatAt(bar, b), arp[i], intro ? 0.05 : 0.04, i % 2 ? 0.45 : -0.45),
  );
  if (bar % 2 === 1) bellNote(beatAt(bar, 1.75), chord[3] + 24, 0.035, 0);

  if (!intro) {
    // Bass.
    bassNote(beatAt(bar, 0), BEAT * 0.95, root, 0.5);
    bassNote(beatAt(bar, 1.5), BEAT * 0.45, root, 0.34);
    bassNote(beatAt(bar, 2), BEAT * 0.95, root, 0.46);
    bassNote(
      beatAt(bar, 3.5),
      BEAT * 0.45,
      root + (bar % 4 === 3 ? 7 : 0),
      0.3,
    );

    // Drums.
    kick(beatAt(bar, 0), 0.9);
    kick(beatAt(bar, 2), 0.82);
    kick(beatAt(bar, 3.5), 0.5);
    clap(beatAt(bar, 1), 0.55);
    clap(beatAt(bar, 3), 0.55);
    for (let e = 0; e < 8; e++) {
      const open = e === 7;
      hat(
        beatAt(bar, e / 2),
        (e % 2 === 0 ? 0.16 : 0.1) * (0.9 + rand() * 0.2),
        open,
      );
    }
    if (bar >= 4) {
      for (let s = 0; s < 16; s++) {
        if (s % 2 === 1)
          shaker(beatAt(bar, s / 4), 0.035 * (0.8 + rand() * 0.4));
      }
    }
  } else if (bar === 1) {
    // Bar 2: hats sneak in, riser into the drop.
    for (let e = 0; e < 8; e++) hat(beatAt(bar, e / 2), 0.07 + e * 0.01, false);
    riser(beatAt(bar, 2), BEAT * 2, 0.22);
  }

  // Section accents.
  if (bar === 2 || bar === 6 || bar === 10)
    crash(beatAt(bar, 0), bar === 2 ? 0.2 : 0.14);
  if (bar === 5 || bar === 9) {
    // small fill into the next section
    kick(beatAt(bar, 3.25), 0.45);
    clap(beatAt(bar, 3.75), 0.4);
  }
}

// Final hit at the end of bar 12 (beat 4 of the last bar) + soft crash.
kick(beatAt(BARS - 1, 3), 0.85);
crash(beatAt(BARS - 1, 3), 0.16);

// ---------- send effects: ping-pong delay on the mix (light) ----------
const delaySamples = Math.floor(BEAT * 0.75 * SR); // dotted eighth
const dl = new Float32Array(N);
const dr = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const inL = L[i] + (i >= delaySamples ? dr[i - delaySamples] * 0.38 : 0);
  const inR = R[i] + (i >= delaySamples ? dl[i - delaySamples] * 0.38 : 0);
  dl[i] = inL;
  dr[i] = inR;
}
onePoleLP(dl, 3200);
onePoleLP(dr, 3200);
for (let i = 0; i < N; i++) {
  if (i >= delaySamples) {
    L[i] += dl[i - delaySamples] * 0.16;
    R[i] += dr[i - delaySamples] * 0.16;
  }
}

// ---------- master: gentle tone, soft clip, normalise, fade out ----------
onePoleLP(L, 15500);
onePoleLP(R, 15500);
let peak = 0;
for (let i = 0; i < N; i++) {
  L[i] = Math.tanh(L[i] * 1.6);
  R[i] = Math.tanh(R[i] * 1.6);
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const norm = 0.89 / peak;
const fadeStart = Math.floor((LENGTH - 1.2) * SR);
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
  "oyamuse-theme.wav",
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

let rms = 0;
for (let i = 0; i < N; i++) rms += L[i] * L[i] + R[i] * R[i];
rms = Math.sqrt(rms / (2 * N));
console.log(`wrote ${out}`);
console.log(
  `length ${LENGTH.toFixed(2)} s, ${BARS} bars at ${BPM} BPM, peak ${(20 * Math.log10(0.89)).toFixed(1)} dBFS, rms ${(20 * Math.log10(rms)).toFixed(1)} dBFS`,
);
