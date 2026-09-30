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
import { CollabScene } from "./scenes/CollabScene";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { HowScene } from "./scenes/HowScene";
import { OffersScene } from "./scenes/OffersScene";
import { TitleScene } from "./scenes/TitleScene";
import { ValidityScene } from "./scenes/ValidityScene";
import type { PassReelProps } from "./schema";

// 128.57 BPM soundtrack: 1 beat = 14 frames, 1 bar = 56 frames (timing.ts).
// Every scene starts on a downbeat:
//   bars 1-2   Hook        0 - 112   (quiet intro)
//   bars 3-4   Collab    112 - 224   (pre-drop groove, snare build)
//   bars 5-6   Title     224 - 336   (drop + crash)
//   bars 7-10  Offers    336 - 560   (one card per bar, then hold)
//   bars 11-12 Validity  560 - 672
//   bars 13-15 How       672 - 840   (one step per bar)
//   bars 16-17 Code      840 - 952   (snare build)
//   bars 18-20 CTA       952 - 1120  (second drop)
export const PassReel: React.FC<PassReelProps> = ({
  site,
  logo,
  hook,
  collab,
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
      <Sequence from={112} durationInFrames={112} name="Collab">
        <CollabScene collab={collab} logo={logo} />
      </Sequence>
      <Sequence from={224} durationInFrames={112} name="Title">
        <TitleScene title={title} logo={logo} site={site} />
      </Sequence>
      <Sequence from={336} durationInFrames={224} name="Offers">
        <OffersScene
          offers={offers}
          label={`${title.line1} ${title.line2}`}
          logo={logo}
          footer={code.reminder}
        />
      </Sequence>
      <Sequence from={560} durationInFrames={112} name="Validity">
        <ValidityScene validity={validity} />
      </Sequence>
      <Sequence from={672} durationInFrames={168} name="How it works">
        <HowScene how={how} site={site} />
      </Sequence>
      <Sequence from={840} durationInFrames={112} name="Code validity">
        <CodeScene code={code} />
      </Sequence>
      <Sequence from={952} durationInFrames={168} name="CTA">
        <CtaScene cta={cta} logo={logo} site={site} />
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
