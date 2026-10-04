// Generates the royalty-free soundtrack for the gift reel: a warm, elegant
// lounge-house groove at 120 BPM (exactly 15 frames per beat and 60 frames
// per bar at 30 fps), 16 bars plus a tail. Rhodes-style electric piano,
// music-box intro over a heartbeat, harp arpeggios, soft drums, a lead
// melody and a stereo reverb. Everything is synthesised here.
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
const music = bus();
const fx = bus();
const send = bus();

let seed = 20261004;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const midi = (m) => 440 * 2 ** ((m - 69) / 12);

// Fmaj7 - Am7 - Bbmaj7 - Cadd9, one chord per bar, close voicings.
const PROGRESSION = [
  { chord: [53, 57, 60, 64], root: 41 },
  { chord: [52, 55, 57, 60], root: 45 },
  { chord: [53, 57, 58, 62], root: 46 },
  { chord: [52, 55, 60, 62], root: 48 },
];

// Sections (0-based bars), matching the reel:
//   0-1 hook (music box + heartbeat), 2-4 reveal (drop), 5-6 for whom,
//   7-8 offer (melody), 9-12 how it works (lighter, build in 12),
//   13-15 call to action (second drop, melody).
const DROP = 2;
const FOR_WHOM = 5;
const OFFER = 7;
const HOW = 9;
const BUILD = 12;
const CTA = 13;

// Melody: [beat, midi, length in beats].
const MELODY = {
  7: [
    [0, 76, 1],
    [1, 74, 0.5],
    [1.5, 72, 0.5],
    [2, 74, 1],
    [3, 79, 1],
  ],
  8: [
    [0, 81, 1.5],
    [1.5, 79, 0.5],
    [2, 77, 1],
    [3, 76, 0.5],
    [3.5, 72, 0.5],
  ],
  13: [
    [0, 76, 1],
    [1, 79, 0.5],
    [1.5, 81, 0.5],
    [2, 84, 1],
    [3, 81, 1],
  ],
  14: [
    [0, 77, 1.5],
    [1.5, 74, 0.5],
    [2, 69, 1],
    [3, 72, 0.5],
    [3.5, 74, 0.5],
  ],
  15: [
    [0, 76, 2],
    [2, 79, 2],
  ],
};

// ---------- helpers ----------
const render = (dur, gen) => {
  const n = Math.floor(dur * SR);
  const buf = new Float32Array(n);
  for (let i = 0; i < n; i++) buf[i] = gen(i / SR, i);
  return buf;
};

const mix = (target, start, buf, { pan = 0, gain = 1 } = {}) => {
  const s0 = Math.floor(start * SR);
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

const saw = (w, partials) => {
  let v = 0;
  for (let n = 1; n <= partials; n++) v += Math.sin(n * w) / n;
  return v * 0.6;
};

// ---------- instruments ----------

// Rhodes-style electric piano: FM tine with a decaying index and tremolo.
const ep = (start, dur, m, vel, pan = 0, wet = 0.22) => {
  const f = midi(m);
  const buf = render(dur + 0.7, (t) => {
    const release = t > dur ? Math.exp(-(t - dur) / 0.14) : 1;
    const env = Math.min(1, t / 0.004) * Math.exp(-t / 1.6) * release;
    const index = 1.5 * Math.exp(-t / 0.3) + 0.35;
    const mod = Math.sin(2 * Math.PI * f * t) * index;
    const car = Math.sin(2 * Math.PI * f * t + mod);
    const tine =
      Math.sin(2 * Math.PI * f * 7.1 * t) * 0.07 * Math.exp(-t / 0.04);
    const trem = 1 - 0.1 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 4.6 * t));
    return (car + tine) * env * trem;
  });
  mix(music, start, buf, { pan, gain: vel });
  mix(send, start, buf, { pan, gain: vel * wet });
};

// Warm pad: detuned saws, low-passed, slow attack.
const pad = (start, dur, chord, vel) => {
  chord.forEach((m) => {
    const f = midi(m - 12);
    for (const [det, pan] of [
      [0.995, -0.7],
      [1.005, 0.7],
    ]) {
      const buf = render(dur + 0.4, (t) => {
        const env =
          Math.min(1, t / 0.45) *
          (t > dur ? Math.max(0, 1 - (t - dur) / 0.4) : 1);
        return env * saw(2 * Math.PI * f * det * t, 6) * 0.5;
      });
      lp(buf, 1300);
      mix(music, start, buf, { pan, gain: vel });
      mix(send, start, buf, { pan, gain: vel * 0.35 });
    }
  });
};

// Music box / celesta: inharmonic partials, fast decay, lots of reverb.
const bell = (start, m, vel, pan = 0, wet = 0.5) => {
  const f = midi(m);
  const buf = render(1.4, (t) => {
    const env = Math.min(1, t / 0.002) * Math.exp(-t / 0.55);
    const w = 2 * Math.PI * f * t;
    return (
      env *
      (Math.sin(w) +
        0.32 * Math.sin(2.756 * w) * Math.exp(-t / 0.12) +
        0.12 * Math.sin(5.404 * w) * Math.exp(-t / 0.05))
    );
  });
  mix(music, start, buf, { pan, gain: vel });
  mix(send, start, buf, { pan, gain: vel * wet });
};

// Harp: Karplus-Strong plucked string.
const harp = (start, m, vel, pan = 0) => {
  const f = midi(m);
  const period = Math.max(2, Math.round(SR / f));
  const line = new Float32Array(period);
  let l = 0;
  for (let i = 0; i < period; i++) {
    l += 0.55 * (rand() * 2 - 1 - l);
    line[i] = l;
  }
  const n = Math.floor(1.8 * SR);
  const buf = new Float32Array(n);
  let idx = 0;
  for (let i = 0; i < n; i++) {
    const cur = line[idx];
    const next = line[(idx + 1) % period];
    line[idx] = 0.997 * 0.5 * (cur + next);
    buf[i] = cur * Math.min(1, i / 40);
    idx = (idx + 1) % period;
  }
  mix(music, start, buf, { pan, gain: vel });
  mix(send, start, buf, { pan, gain: vel * 0.45 });
};

// Bass: rounded sine with a little second harmonic, softly saturated.
const bass = (start, dur, m, vel) => {
  const f = midi(m);
  const buf = render(dur + 0.05, (t) => {
    const env =
      Math.min(1, t / 0.006) *
      (t > dur ? Math.max(0, 1 - (t - dur) / 0.05) : 1) *
      (0.6 + 0.4 * Math.exp(-t / 0.15));
    const w = 2 * Math.PI * f * t;
    return Math.tanh(1.4 * env * (Math.sin(w) + 0.3 * Math.sin(2 * w)));
  });
  lp(buf, 700);
  mix(music, start, buf, { gain: vel });
};

const kick = (start, vel) => {
  const buf = render(0.32, (t) => {
    const phase =
      2 * Math.PI * (48 * t + 100 * 0.035 * (1 - Math.exp(-t / 0.035)));
    const env = Math.exp(-t / 0.12) * Math.min(1, t / 0.0015);
    const click = t < 0.004 ? (rand() * 2 - 1) * 0.35 * (1 - t / 0.004) : 0;
    return Math.tanh((Math.sin(phase) * env + click) * 1.3) * vel;
  });
  mix(drums, start, buf);
};

// Finger snap: short band-passed noise with a body.
const snap = (start, vel) => {
  const buf = noise(0.16, (t) => Math.exp(-t / 0.035) * Math.min(1, t / 0.001));
  bandPass(buf, 2300, 1.3);
  hp(buf, 900);
  mix(drums, start, buf, { gain: vel, pan: 0.08 });
  mix(send, start, buf, { gain: vel * 0.25 });
  const body = render(
    0.06,
    (t) => Math.sin(2 * Math.PI * 1600 * t) * Math.exp(-t / 0.012),
  );
  mix(drums, start, body, { gain: vel * 0.3 });
};

const shaker = (start, vel) => {
  const buf = noise(0.06, (t) => Math.exp(-t / 0.016) * Math.min(1, t / 0.004));
  hp(buf, 6000);
  mix(drums, start, buf, { gain: vel, pan: -0.3 });
};

const openHat = (start, vel) => {
  const buf = noise(0.25, (t) => Math.exp(-t / 0.08));
  hp(buf, 8000);
  hp(buf, 7000);
  mix(drums, start, buf, { gain: vel, pan: 0.25 });
};

const crash = (start, vel) => {
  const buf = noise(2.2, (t) => Math.exp(-t / 0.8) * Math.min(1, t / 0.004));
  hp(buf, 4500);
  mix(fx, start, buf, { gain: vel, pan: 0.1 });
  mix(send, start, buf, { gain: vel * 0.3 });
};

const impact = (start, vel) => {
  const boom = render(
    1.0,
    (t) =>
      Math.sin(2 * Math.PI * (40 + 50 * Math.exp(-t / 0.07)) * t) *
      Math.exp(-t / 0.35),
  );
  mix(fx, start, boom, { gain: vel });
  mix(send, start, boom, { gain: vel * 0.3 });
};

// Reverse cymbal swell ending exactly at `end`.
const swell = (end, dur, vel) => {
  const buf = noise(dur, (t) => (t / dur) ** 2.6);
  hp(buf, 1800);
  mix(fx, end - dur, buf, { gain: vel });
  mix(send, end - dur, buf, { gain: vel * 0.4 });
};

// A reversed electric-piano chord that swells into `end`.
const reverseChord = (end, chord, dur, vel) => {
  const tmp = new Float32Array(Math.floor(dur * SR));
  chord.forEach((m) => {
    const f = midi(m);
    for (let i = 0; i < tmp.length; i++) {
      const t = i / SR;
      const env = Math.exp(-t / 0.7);
      tmp[i] +=
        Math.sin(
          2 * Math.PI * f * t +
            Math.sin(2 * Math.PI * f * t) * 0.6 * Math.exp(-t / 0.3),
        ) * env;
    }
  });
  tmp.reverse();
  mix(music, end - dur, tmp, { gain: vel });
  mix(send, end - dur, tmp, { gain: vel * 0.6 });
};

// Fast ascending bell glissando.
const sparkle = (start, vel) => {
  [84, 86, 89, 91, 93, 96, 98, 101].forEach((m, k) =>
    bell(start + k * 0.045, m, vel * (0.7 + k * 0.04), k % 2 ? 0.4 : -0.4, 0.6),
  );
};

// ---------- arrangement ----------
const at = (bar, beat) => bar * BAR + beat * BEAT;

for (let bar = 0; bar < BARS; bar++) {
  const { chord, root } = PROGRESSION[bar % 4];
  const intro = bar < DROP;
  const how = bar >= HOW && bar < CTA;
  const cta = bar >= CTA;

  pad(at(bar, 0), BAR, chord, intro ? 0.05 : 0.045);

  if (intro) {
    // Music box arpeggio in eighths, two octaves up.
    const tones = chord.map((m) => m + 24);
    const seq = [
      tones[0],
      tones[1],
      tones[2],
      tones[3],
      tones[0] + 12,
      tones[3],
      tones[2],
      tones[1],
    ];
    seq.forEach((m, i) =>
      bell(at(bar, i / 2), m, i === 0 ? 0.12 : 0.085, i % 2 ? 0.35 : -0.35),
    );
    chord.forEach((m, i) =>
      ep(at(bar, 0) + i * 0.01, BEAT * 3, m + 12, 0.06, (i - 1.5) * 0.2, 0.35),
    );
    // Heartbeat: lub-dub.
    const beats = bar === 0 ? [0, 2] : [0];
    for (const b of beats) {
      kick(at(bar, b), 0.5);
      kick(at(bar, b + 0.4), 0.3);
    }
    if (bar === 1) {
      swell(at(DROP, 0), BEAT * 2.5, 0.3);
      reverseChord(
        at(DROP, 0),
        PROGRESSION[DROP % 4].chord.map((m) => m + 12),
        1.3,
        0.12,
      );
    }
    continue;
  }

  // Drums.
  for (let b = 0; b < 4; b++) {
    if (bar === BUILD && b >= 2) continue;
    kick(at(bar, b), how ? 0.85 : 0.95);
  }
  snap(at(bar, 1), 0.45);
  snap(at(bar, 3), 0.45);
  for (let s = 0; s < 16; s++) {
    shaker(
      at(bar, s / 4),
      (s % 4 === 2 ? 0.07 : s % 2 ? 0.045 : 0.03) * (0.85 + rand() * 0.3),
    );
  }
  if (cta) for (let e = 0; e < 4; e++) openHat(at(bar, e + 0.5), 0.08);

  // Bass.
  bass(at(bar, 0), BEAT * 0.9, root, 0.55);
  bass(at(bar, 1.5), BEAT * 0.45, root + 12, 0.32);
  bass(at(bar, 2), BEAT * 0.9, root, 0.5);
  bass(at(bar, 3.5), BEAT * 0.45, root + 7, 0.32);

  // Electric piano: comping, lighter under the how-it-works section.
  if (how && bar !== BUILD) {
    chord.forEach((m, i) =>
      ep(at(bar, 0) + i * 0.01, BAR * 0.85, m + 12, 0.075, (i - 1.5) * 0.2),
    );
  } else {
    const comp = [
      [0, 1.4, 0.12],
      [1.5, 0.4, 0.08],
      [2.5, 0.4, 0.075],
      [3, 0.9, 0.09],
    ];
    for (const [b, d, v] of comp) {
      chord.forEach((m, i) =>
        ep(at(bar, b) + i * 0.006, BEAT * d, m + 12, v, (i - 1.5) * 0.2),
      );
    }
  }

  // Harp arpeggios: for-whom section and the call to action.
  if ((bar >= FOR_WHOM && bar < OFFER) || cta) {
    const tones = chord.map((m) => m + 12);
    const seq = [
      tones[0],
      tones[1],
      tones[2],
      tones[3],
      tones[0] + 12,
      tones[1] + 12,
      tones[2] + 12,
      tones[3] + 12,
    ];
    seq.forEach((m, i) =>
      harp(at(bar, i / 2), m, cta ? 0.16 : 0.2, i % 2 ? 0.45 : -0.45),
    );
  }

  // Lead melody (electric piano, doubled softly by the music box).
  if (MELODY[bar]) {
    for (const [b, m, d] of MELODY[bar]) {
      ep(at(bar, b), BEAT * d, m, 0.16, 0.1, 0.35);
      bell(at(bar, b), m + 12, 0.03, -0.2, 0.5);
    }
  }

  // Accents on the scene changes.
  if ([DROP, FOR_WHOM, OFFER, HOW, CTA].includes(bar))
    crash(at(bar, 0), bar === DROP || bar === CTA ? 0.22 : 0.14);
  if (bar === DROP || bar === CTA) {
    impact(at(bar, 0), 0.5);
    sparkle(at(bar, 0), 0.09);
  }
  if (bar === BUILD) {
    swell(at(CTA, 0), BEAT * 2, 0.3);
    reverseChord(
      at(CTA, 0),
      PROGRESSION[CTA % 4].chord.map((m) => m + 12),
      1.0,
      0.12,
    );
    [0, 1, 2, 3, 4, 5, 6, 7].forEach((k) =>
      harp(
        at(bar, 2 + k / 4),
        chord[k % 4] + 12 + 12 * Math.floor(k / 4),
        0.14,
        k % 2 ? 0.4 : -0.4,
      ),
    );
  }
}

// Ending: a last chord that rings, a final sparkle.
PROGRESSION[(BARS - 1) % 4].chord.forEach((m, i) =>
  ep(
    at(BARS - 1, 3.5) + i * 0.012,
    BEAT * 4,
    m + 12,
    0.12,
    (i - 1.5) * 0.25,
    0.4,
  ),
);
bell(at(BARS, 0), 88, 0.06, 0, 0.6);
crash(at(BARS, 0), 0.12);

// ---------- sidechain pump on the music bus ----------
const pumpStart = Math.floor(at(DROP, 0) * SR);
const beatSamples = BEAT * SR;
for (let i = pumpStart; i < N; i++) {
  const tb = ((i - pumpStart) % beatSamples) / SR;
  const g = 1 - 0.3 * Math.exp(-tb / 0.11);
  music[0][i] *= g;
  music[1][i] *= g;
}

// ---------- reverb (Freeverb-style) on the send bus ----------
const reverb = (inL, inR) => {
  const combT = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617];
  const apT = [556, 441, 341, 225];
  const feedback = 0.84;
  const damp = 0.25;
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
      for (const a of aps) {
        const b = a.buf[a.idx];
        a.buf[a.idx] = s + b * 0.5;
        a.idx = (a.idx + 1) % a.buf.length;
        s = b - s;
      }
      out[i] = s;
    }
    return out;
  };
  return [process(0), process(23)];
};
const wet = reverb(send[0], send[1]);

const rms = (ch) => {
  let s = 0;
  for (let i = 0; i < N; i++) s += ch[i] * ch[i];
  return Math.sqrt(s / N);
};
const wetGain = (0.4 * rms(music[0])) / (rms(wet[0]) || 1);

// ---------- master ----------
const L = new Float32Array(N);
const R = new Float32Array(N);
let peak = 0;
for (let i = 0; i < N; i++) {
  L[i] = Math.tanh(
    (drums[0][i] + music[0][i] * 0.9 + fx[0][i] * 0.9 + wet[0][i] * wetGain) *
      1.2,
  );
  R[i] = Math.tanh(
    (drums[1][i] + music[1][i] * 0.9 + fx[1][i] * 0.9 + wet[1][i] * wetGain) *
      1.2,
  );
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
console.log(
  `length ${LENGTH.toFixed(2)} s, ${BARS} bars at ${BPM} BPM, reverb gain ${wetGain.toFixed(2)}`,
);
