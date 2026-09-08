// Generates the royalty-free soundtrack for the reel: an energetic pop /
// house groove at 128.57 BPM (exactly 14 frames per beat at 30 fps),
// 16 bars (29.9 s) plus a short tail. Everything is synthesised here.
//
//   node scripts/make-music.mjs  -> public/music/oyamuse-theme.wav
//   (convert to mp3 with ffmpeg, see README)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const BEAT = 14 / 30; // seconds; 14 frames at 30 fps -> 128.57 BPM
const BAR = BEAT * 4;
const BARS = 16;
const TAIL = 1.6;
const LENGTH = BARS * BAR + TAIL;
const N = Math.ceil(LENGTH * SR);

const drums = [new Float32Array(N), new Float32Array(N)];
const music = [new Float32Array(N), new Float32Array(N)];
const fx = [new Float32Array(N), new Float32Array(N)];

let seed = 20260909;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const midi = (m) => 440 * 2 ** ((m - 69) / 12);

// Am - F - C - G, one chord per bar, looping.
const PROGRESSION = [
  { chord: [57, 60, 64, 69], root: 33 },
  { chord: [53, 57, 60, 65], root: 29 },
  { chord: [55, 60, 64, 67], root: 36 },
  { chord: [55, 59, 62, 67], root: 31 },
];

// ---------- helpers ----------
const render = (dur, gen) => {
  const n = Math.floor(dur * SR);
  const buf = new Float32Array(n);
  for (let i = 0; i < n; i++) buf[i] = gen(i / SR, i);
  return buf;
};

const mix = (bus, start, buf, { pan = 0, gain = 1 } = {}) => {
  const s0 = Math.floor(start * SR);
  const gl = Math.cos(((pan + 1) * Math.PI) / 4) * gain;
  const gr = Math.sin(((pan + 1) * Math.PI) / 4) * gain;
  for (let i = 0; i < buf.length; i++) {
    const idx = s0 + i;
    if (idx >= N) break;
    bus[0][idx] += buf[i] * gl;
    bus[1][idx] += buf[i] * gr;
  }
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

const bandPass = (buf, f0, q) => {
  const w0 = (2 * Math.PI * f0) / SR;
  const alpha = Math.sin(w0) / (2 * q);
  const b0 = alpha / (1 + alpha);
  const b2 = -alpha / (1 + alpha);
  const a1 = (-2 * Math.cos(w0)) / (1 + alpha);
  const a2 = (1 - alpha) / (1 + alpha);
  let x1 = 0,
    x2 = 0,
    y1 = 0,
    y2 = 0;
  for (let i = 0; i < buf.length; i++) {
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

const noise = (dur, shape) => render(dur, (t) => (rand() * 2 - 1) * shape(t));

// Saw-like additive waveform (band limited).
const saw = (w, partials) => {
  let v = 0;
  for (let n = 1; n <= partials; n++) v += Math.sin(n * w) / n;
  return v * 0.6;
};

// ---------- instruments ----------

// Plucky chord stab (house piano / synth stab).
const stab = (start, dur, chord, vel) => {
  chord.forEach((m, i) => {
    const f = midi(m);
    const pan = (i / (chord.length - 1) - 0.5) * 0.7;
    const buf = render(dur, (t) => {
      const env =
        Math.min(1, t / 0.004) *
        Math.exp(-t / 0.22) *
        (t > dur - 0.02 ? (dur - t) / 0.02 : 1);
      const w1 = 2 * Math.PI * f * 1.003 * t;
      const w2 = 2 * Math.PI * f * 0.997 * t;
      return env * (saw(w1, 9) + saw(w2, 9)) * 0.5;
    });
    lp(buf, 5200);
    mix(music, start + i * 0.004, buf, { pan, gain: vel });
  });
};

// Wide sustained pad under the stabs.
const pad = (start, dur, chord, vel) => {
  chord.forEach((m, i) => {
    const f = midi(m);
    for (const [det, pan] of [
      [0.994, -0.8],
      [1.006, 0.8],
    ]) {
      const buf = render(dur, (t) => {
        const env =
          Math.min(1, t / 0.25) *
          (t > dur - 0.15 ? Math.max(0, (dur - t) / 0.15) : 1);
        return env * saw(2 * Math.PI * f * det * t, 6) * 0.5;
      });
      lp(buf, 1800);
      mix(music, start, buf, { pan, gain: vel * (i === 0 ? 0.8 : 1) });
    }
  });
};

// Driving bass: saw + sub.
const bass = (start, dur, m, vel) => {
  const f = midi(m);
  const buf = render(dur, (t) => {
    const env =
      Math.min(1, t / 0.003) *
      (t > dur - 0.03 ? Math.max(0, (dur - t) / 0.03) : 1) *
      (0.55 + 0.45 * Math.exp(-t / 0.12));
    const w = 2 * Math.PI * f * t;
    return env * (saw(w, 7) * 0.7 + Math.sin(w) * 0.9);
  });
  lp(buf, 900);
  mix(music, start, buf, { gain: vel });
};

// Lead pluck with vibrato.
const lead = (start, dur, m, vel) => {
  const f = midi(m);
  const buf = render(dur, (t) => {
    const env =
      Math.min(1, t / 0.008) *
      Math.exp(-t / 0.35) *
      (t > dur - 0.03 ? Math.max(0, (dur - t) / 0.03) : 1);
    const vib =
      1 + 0.004 * Math.sin(2 * Math.PI * 5.5 * t) * Math.min(1, t / 0.15);
    const w = 2 * Math.PI * f * vib * t;
    return (
      env *
      (Math.sin(w) +
        0.5 * Math.sin(3 * w) +
        0.25 * Math.sin(5 * w) +
        0.12 * Math.sin(7 * w)) *
      0.5
    );
  });
  lp(buf, 7000);
  mix(music, start, buf, { gain: vel, pan: 0.1 });
};

const bell = (start, m, vel, pan) => {
  const f = midi(m);
  const buf = render(0.7, (t) => {
    const env = Math.min(1, t / 0.002) * Math.exp(-t / 0.22);
    const w = 2 * Math.PI * f * t;
    return env * (Math.sin(w) + 0.3 * Math.sin(3 * w) * Math.exp(-t / 0.08));
  });
  mix(music, start, buf, { gain: vel, pan });
};

const kick = (start, vel) => {
  const buf = render(0.35, (t) => {
    const phase =
      2 * Math.PI * (50 * t + 140 * 0.04 * (1 - Math.exp(-t / 0.04)));
    const env = Math.exp(-t / 0.11) * Math.min(1, t / 0.0015);
    const click = t < 0.005 ? (rand() * 2 - 1) * 0.7 * (1 - t / 0.005) : 0;
    return Math.tanh((Math.sin(phase) * env + click) * 1.4) * vel;
  });
  mix(drums, start, buf);
};

const clap = (start, vel) => {
  for (let k = 0; k < 4; k++) {
    const buf = noise(0.28, (t) => Math.exp(-t / (k === 3 ? 0.1 : 0.025)));
    bandPass(buf, 1700, 0.9);
    hp(buf, 700);
    mix(drums, start + k * 0.009, buf, {
      gain: vel * (k === 3 ? 1 : 0.6),
      pan: (k - 1.5) * 0.15,
    });
  }
  const body = render(
    0.1,
    (t) => Math.sin(2 * Math.PI * 200 * t) * Math.exp(-t / 0.035),
  );
  mix(drums, start, body, { gain: vel * 0.5 });
};

const snare = (start, vel) => {
  const buf = noise(0.2, (t) => Math.exp(-t / 0.05));
  bandPass(buf, 2200, 0.8);
  mix(drums, start, buf, { gain: vel });
  const body = render(
    0.12,
    (t) =>
      Math.sin(2 * Math.PI * (180 + 80 * Math.exp(-t / 0.02)) * t) *
      Math.exp(-t / 0.04),
  );
  mix(drums, start, body, { gain: vel * 0.7 });
};

const hat = (start, vel, open) => {
  const buf = noise(open ? 0.3 : 0.06, (t) =>
    Math.exp(-t / (open ? 0.09 : 0.014)),
  );
  hp(buf, 8000);
  hp(buf, 6500);
  mix(drums, start, buf, { gain: vel, pan: 0.22 });
};

const shaker = (start, vel) => {
  const buf = noise(0.05, (t) => Math.exp(-t / 0.014));
  hp(buf, 5500);
  mix(drums, start, buf, { gain: vel, pan: -0.3 });
};

const crash = (start, vel) => {
  const buf = noise(1.8, (t) => Math.exp(-t / 0.6) * Math.min(1, t / 0.003));
  hp(buf, 4000);
  mix(fx, start, buf, { gain: vel, pan: 0.1 });
};

const impact = (start, vel) => {
  const boom = render(
    0.8,
    (t) =>
      Math.sin(2 * Math.PI * (42 + 60 * Math.exp(-t / 0.06)) * t) *
      Math.exp(-t / 0.25),
  );
  mix(fx, start, boom, { gain: vel });
  const air = noise(0.5, (t) => Math.exp(-t / 0.12));
  lp(air, 3000);
  mix(fx, start, air, { gain: vel * 0.35 });
};

const riser = (start, dur, vel) => {
  const buf = noise(dur, (t) => (t / dur) ** 2.4);
  hp(buf, 1200);
  mix(fx, start, buf, { gain: vel });
  const sweep = render(
    dur,
    (t) =>
      Math.sin(2 * Math.PI * 220 * 2 ** ((t / dur) * 2.5) * t) * (t / dur) ** 2,
  );
  mix(fx, start, sweep, { gain: vel * 0.35 });
};

// ---------- arrangement ----------
const at = (bar, beat) => bar * BAR + beat * BEAT; // 0-based bar and beat

// Melody (A minor pentatonic), one note per eighth, used in bars 8-9 and 15-16.
const MELODY = [76, 74, 72, 74, 76, 79, 76, 74, 72, 69, 72, 74, 76, 74, 72, 69];

for (let bar = 0; bar < BARS; bar++) {
  const { chord, root } = PROGRESSION[bar % 4];
  const intro = bar < 2;
  const build = bar === 13; // montage climax build
  const groove = !intro;

  // Chord stabs: syncopated house pattern.
  const stabVel = intro ? 0.16 : 0.2;
  for (const b of [0, 0.75, 1.5, 2, 2.75, 3.5])
    stab(at(bar, b), BEAT * 0.6, chord, stabVel * (b % 1 === 0 ? 1 : 0.85));
  pad(at(bar, 0), BAR, chord, intro ? 0.05 : 0.07);

  // Sparkle arpeggio on sixteenths, second half of the bar.
  if (bar >= 3 && !build) {
    const arp = chord.map((m) => m + 24);
    for (let s = 8; s < 16; s++)
      bell(at(bar, s / 4), arp[s % 4], 0.045, s % 2 ? 0.5 : -0.5);
  }

  if (groove) {
    // Bass: eighth notes, octave bounce.
    for (let e = 0; e < 8; e++) {
      const octave = e % 2 === 1 ? 12 : 0;
      bass(
        at(bar, e / 2),
        BEAT * 0.45,
        root + octave,
        e % 2 === 0 ? 0.5 : 0.36,
      );
    }

    // Drums: four on the floor, claps on 2 and 4, open hats on the off-beats.
    for (let b = 0; b < 4; b++) kick(at(bar, b), 1);
    clap(at(bar, 1), 0.7);
    clap(at(bar, 3), 0.7);
    for (let s = 0; s < 16; s++) {
      const off8 = s % 4 === 2;
      if (off8) hat(at(bar, s / 4), 0.24, true);
      else
        hat(
          at(bar, s / 4),
          (s % 4 === 0 ? 0.13 : 0.09) * (0.85 + rand() * 0.3),
          false,
        );
      if (s % 2 === 1) shaker(at(bar, s / 4), 0.06 * (0.8 + rand() * 0.4));
    }
  } else {
    // Intro: hats and a snare roll into the drop.
    for (let e = 0; e < 8; e++)
      hat(at(bar, e / 2), 0.05 + bar * 0.04 + e * 0.008, false);
    if (bar === 1) {
      for (let e = 0; e < 4; e++) snare(at(bar, 2 + e / 2), 0.18 + e * 0.05);
      for (let s = 0; s < 4; s++) snare(at(bar, 3 + s / 4), 0.35 + s * 0.08);
      kick(at(bar, 0), 0.6);
      kick(at(bar, 2), 0.7);
    }
  }

  // Lead melody.
  if (bar === 7 || bar === 8 || bar === 14 || bar === 15) {
    const phrase = bar % 2 === 1 ? MELODY.slice(0, 8) : MELODY.slice(8, 16);
    phrase.forEach((m, i) => lead(at(bar, i / 2), BEAT * 0.5, m, 0.13));
  }

  // Build in bar 14 (index 13): snare roll accelerating, riser.
  if (build) {
    for (let e = 0; e < 4; e++) snare(at(bar, e / 2), 0.3 + e * 0.04);
    for (let s = 0; s < 8; s++) snare(at(bar, 2 + s / 4), 0.4 + s * 0.05);
    riser(at(bar, 0), BAR, 0.3);
  }

  // Section accents: crashes and impacts on the drops.
  if (bar === 2 || bar === 9 || bar === 12 || bar === 14)
    crash(at(bar, 0), bar === 2 || bar === 14 ? 0.32 : 0.2);
  if (bar === 2 || bar === 14) impact(at(bar, 0), 0.55);
  if (bar === 1 || bar === 8 || bar === 11)
    riser(at(bar, 2), BEAT * 2, bar === 1 ? 0.35 : 0.2);
}

// Final: last chord rings, final hit.
stab(at(BARS - 1, 3.5), BEAT * 3, PROGRESSION[(BARS - 1) % 4].chord, 0.2);
crash(at(BARS, 0) - 0.01, 0.22);

// ---------- sidechain pump on the music bus (from the drop on) ----------
const pumpStart = Math.floor(at(2, 0) * SR);
const beatSamples = BEAT * SR;
for (let i = pumpStart; i < N; i++) {
  const tb = ((i - pumpStart) % beatSamples) / SR;
  const g = 1 - 0.5 * Math.exp(-tb / 0.1);
  music[0][i] *= g;
  music[1][i] *= g;
}

// ---------- intro low-pass sweep on the music bus ----------
const introEnd = Math.floor(at(2, 0) * SR);
for (const ch of music) {
  let y = 0;
  for (let i = 0; i < introEnd; i++) {
    const p = i / introEnd;
    const cutoff = 350 * 2 ** (p * p * 5.2); // 350 Hz -> ~12.9 kHz
    const a = 1 - Math.exp((-2 * Math.PI * cutoff) / SR);
    y += a * (ch[i] - y);
    ch[i] = y;
  }
}

// ---------- eighth-note ping-pong delay on the music bus ----------
const d = Math.floor(BEAT * 0.5 * SR);
const dl = new Float32Array(N);
const dr = new Float32Array(N);
for (let i = 0; i < N; i++) {
  dl[i] = music[0][i] + (i >= d ? dr[i - d] * 0.32 : 0);
  dr[i] = music[1][i] + (i >= d ? dl[i - d] * 0.32 : 0);
}
lp(dl, 4000);
lp(dr, 4000);
for (let i = d; i < N; i++) {
  music[0][i] += dl[i - d] * 0.14;
  music[1][i] += dr[i - d] * 0.14;
}

// ---------- master ----------
const L = new Float32Array(N);
const R = new Float32Array(N);
let peak = 0;
for (let i = 0; i < N; i++) {
  L[i] = Math.tanh(
    (drums[0][i] * 1.0 + music[0][i] * 0.9 + fx[0][i] * 0.9) * 1.35,
  );
  R[i] = Math.tanh(
    (drums[1][i] * 1.0 + music[1][i] * 0.9 + fx[1][i] * 0.9) * 1.35,
  );
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const norm = 0.9 / peak;
const fadeStart = Math.floor((LENGTH - 1.0) * SR);
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
  `length ${LENGTH.toFixed(2)} s, ${BARS} bars at ${(60 / BEAT).toFixed(2)} BPM, rms ${(20 * Math.log10(rms)).toFixed(1)} dBFS`,
);
