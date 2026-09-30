import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import "./fonts";
import { CodeScene } from "./scenes/CodeScene";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { HowScene } from "./scenes/HowScene";
import { OffersScene } from "./scenes/OffersScene";
import { TitleScene } from "./scenes/TitleScene";
import { ValidityScene } from "./scenes/ValidityScene";
import type { PassReelProps } from "./schema";

// 128.57 BPM soundtrack: 1 beat = 14 frames, 1 bar = 56 frames (timing.ts).
// Every scene starts on a downbeat:
//   bars 1-2   Hook        0 - 112   (music builds, snare roll)
//   bars 3-4   Title     112 - 224   (drop + crash)
//   bars 5-8   Offers    224 - 448   (one card per bar, then hold)
//   bars 9-10  Validity  448 - 560
//   bars 11-13 How       560 - 728   (one step per bar)
//   bars 14-15 Code      728 - 840   (snare build)
//   bars 16-18 CTA       840 - 1008  (second drop)
export const PassReel: React.FC<PassReelProps> = ({
  handle,
  logo,
  hook,
  title,
  offers,
  validity,
  how,
  code,
  cta,
  musicFile,
}) => {
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#12100e" }}>
      <Sequence durationInFrames={112} name="Hook">
        <HookScene hook={hook} />
      </Sequence>
      <Sequence from={112} durationInFrames={112} name="Title">
        <TitleScene title={title} logo={logo} />
      </Sequence>
      <Sequence from={224} durationInFrames={224} name="Offers">
        <OffersScene
          offers={offers}
          label={`${title.line1} ${title.line2}`}
          logo={logo}
          footer={code.reminder}
        />
      </Sequence>
      <Sequence from={448} durationInFrames={112} name="Validity">
        <ValidityScene validity={validity} />
      </Sequence>
      <Sequence from={560} durationInFrames={168} name="How it works">
        <HowScene how={how} site={cta.site} />
      </Sequence>
      <Sequence from={728} durationInFrames={112} name="Code validity">
        <CodeScene code={code} />
      </Sequence>
      <Sequence from={840} durationInFrames={168} name="CTA">
        <CtaScene cta={cta} handle={handle} logo={logo} />
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
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            )
          }
        />
      ) : null}
    </AbsoluteFill>
  );
};
