import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import "./fonts";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { HowScene } from "./scenes/HowScene";
import { SalonScene } from "./scenes/SalonScene";
import type { HappyHoursReelProps } from "./schema";

// 128.57 BPM soundtrack: 1 beat = 14 frames, 1 bar = 56 frames (timing.ts).
// Every scene starts on a downbeat:
//   bars 1-2   Hook       0 - 112   (quiet intro, snare build)
//   bars 3-6   Salon 1  112 - 336   (drop)
//   bars 7-10  Salon 2  336 - 560
//   bars 11-13 How      560 - 728   (build in bar 13)
//   bars 14-16 CTA      728 - 896   (second drop)
export const HappyHoursReel: React.FC<HappyHoursReelProps> = ({
  site,
  hook,
  salons,
  how,
  cta,
  musicFile,
}) => {
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0f0e" }}>
      <Sequence durationInFrames={112} name="Hook">
        <HookScene hook={hook} />
      </Sequence>
      <Sequence from={112} durationInFrames={224} name="Salon 1">
        <SalonScene salon={salons[0]} />
      </Sequence>
      <Sequence from={336} durationInFrames={224} name="Salon 2">
        <SalonScene salon={salons[1]} />
      </Sequence>
      <Sequence from={560} durationInFrames={168} name="How it works">
        <HowScene how={how} site={site} />
      </Sequence>
      <Sequence from={728} durationInFrames={168} name="CTA">
        <CtaScene cta={cta} salons={salons} />
      </Sequence>
      {musicFile ? (
        <Audio
          name="Music"
          src={staticFile(musicFile)}
          volume={(frame) =>
            interpolate(
              frame,
              [0, 6, durationInFrames - 20, durationInFrames - 1],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          }
        />
      ) : null}
    </AbsoluteFill>
  );
};
