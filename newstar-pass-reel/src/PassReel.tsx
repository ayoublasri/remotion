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
//   bars 5-7   Title     224 - 392   (drop + crash, then hold)
//   bars 8-12  Lissage   392 - 672   (one card per bar, then two bars hold)
//   bars 13-17 Ongles    672 - 952   (one card per bar, then two bars hold)
//   bars 18-20 Validity  952 - 1120
//   bars 21-24 How      1120 - 1344  (one step per bar, then hold)
//   bars 25-26 Code     1344 - 1456  (snare build)
//   bars 27-29 CTA      1456 - 1624  (second drop)
export const PassReel: React.FC<PassReelProps> = ({
  site,
  logo,
  hook,
  collab,
  title,
  lissage,
  ongles,
  validity,
  how,
  code,
  cta,
  musicFile,
}) => {
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#2a0c1a" }}>
      <Sequence durationInFrames={112} name="Hook">
        <HookScene hook={hook} />
      </Sequence>
      <Sequence from={112} durationInFrames={112} name="Collab">
        <CollabScene collab={collab} logo={logo} />
      </Sequence>
      <Sequence from={224} durationInFrames={168} name="Title">
        <TitleScene title={title} logo={logo} site={site} />
      </Sequence>
      <Sequence from={392} durationInFrames={280} name="Lissage">
        <OffersScene section={lissage} logo={logo} />
      </Sequence>
      <Sequence from={672} durationInFrames={280} name="Ongles">
        <OffersScene section={ongles} logo={logo} />
      </Sequence>
      <Sequence from={952} durationInFrames={168} name="Validity">
        <ValidityScene validity={validity} />
      </Sequence>
      <Sequence from={1120} durationInFrames={224} name="How it works">
        <HowScene how={how} site={site} />
      </Sequence>
      <Sequence from={1344} durationInFrames={112} name="Code validity">
        <CodeScene code={code} />
      </Sequence>
      <Sequence from={1456} durationInFrames={168} name="CTA">
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
