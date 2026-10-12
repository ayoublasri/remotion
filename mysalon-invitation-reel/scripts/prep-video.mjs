// Prepares the ad video for the reel: motion-interpolates assets/source.mp4
// (720 x 1280, 24 fps) to 60 fps and scales it to 1080 x 1920, so that the
// slowed-down shots stay smooth. Output: public/video/source-60.mp4.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const input = path.join(root, "assets/source.mp4");
const outDir = path.join(root, "public/video");
const output = path.join(outDir, "source-60.mp4");

const candidates = [
  "ffmpeg",
  ...[
    "linux-x64-gnu",
    "linux-x64-musl",
    "linux-arm64-gnu",
    "linux-arm64-musl",
    "darwin-arm64",
    "darwin-x64",
    "win32-x64-msvc",
  ].map((p) =>
    path.join(
      root,
      "node_modules/@remotion/compositor-" + p,
      p.startsWith("win32") ? "ffmpeg.exe" : "ffmpeg",
    ),
  ),
];

const interpolate =
  "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1:scd=fdiff:scd_threshold=8";
const scale = "scale=1080:1920:flags=lanczos";

const run = (ffmpeg, filter) =>
  execFileSync(
    ffmpeg,
    [
      "-y",
      "-v",
      "error",
      "-i",
      input,
      "-vf",
      filter,
      "-an",
      "-c:v",
      "libx264",
      "-crf",
      "16",
      "-preset",
      "medium",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      output,
    ],
    { stdio: "inherit" },
  );

mkdirSync(outDir, { recursive: true });
let done = false;
for (const ffmpeg of candidates) {
  if (ffmpeg !== "ffmpeg" && !existsSync(ffmpeg)) continue;
  try {
    console.log(`Interpolating with ${ffmpeg} (a few minutes)…`);
    run(ffmpeg, `${interpolate},${scale}`);
    done = true;
    break;
  } catch {
    try {
      console.warn("No minterpolate in this ffmpeg; scaling only.");
      run(ffmpeg, scale);
      done = true;
      break;
    } catch {
      // try the next binary
    }
  }
}
if (!done) {
  console.error("No working ffmpeg found. Install ffmpeg and run again.");
  process.exit(1);
}
console.log(`wrote ${output}`);

// Frozen frames of the ad, for the scenes drawn on top of it: the DMs, the
// confirmed booking, the phone in hand (WhatsApp and check-in), the
// Instagram profile, the booking page and the agenda.
const stills = [
  ["still-dms.jpg", 2.05],
  ["still-confirm.jpg", 5.4],
  ["still-phone.jpg", 7.7],
  ["still-profile.jpg", 2.45],
  ["still-booking.jpg", 4.3],
  ["still-agenda.jpg", 6.5],
];
const ffmpeg = candidates.find((c) => c === "ffmpeg" || existsSync(c));
for (const [name, second] of stills) {
  execFileSync(
    ffmpeg,
    [
      "-y",
      "-v",
      "error",
      "-ss",
      String(second),
      "-i",
      output,
      "-frames:v",
      "1",
      "-q:v",
      "2",
      path.join(outDir, name),
    ],
    { stdio: "inherit" },
  );
  console.log(`wrote ${path.join(outDir, name)}`);
}
