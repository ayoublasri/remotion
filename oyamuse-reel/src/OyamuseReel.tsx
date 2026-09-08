import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import "./fonts";
import { BrowsScene } from "./scenes/BrowsScene";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { LashesScene } from "./scenes/LashesScene";
import { LogoScene } from "./scenes/LogoScene";
import { MontageScene } from "./scenes/MontageScene";
import { NailsScene } from "./scenes/NailsScene";
import type { OyamuseReelProps } from "./schema";

// 128.57 BPM soundtrack: 1 beat = 14 frames, 1 bar = 56 frames (timing.ts).
// Every scene starts on a downbeat:
//   bars 1-2   Hook       0 - 112   (music builds, snare roll)
//   bar  3     Logo     112 - 168   (drop + crash)
//   bars 4-9   Nails    168 - 504   (one set per bar)
//   bars 10-11 Brows    504 - 616   (before, then after on bar 11)
//   bar  12    Lashes   616 - 672
//   bars 13-14 Montage  672 - 784   (one photo per beat, snare build)
//   bars 15-16 CTA      784 - 896   (second drop: the invite)
export const OyamuseReel: React.FC<OyamuseReelProps> = ({
  handle,
  logo,
  hook,
  labels,
  nails,
  brows,
  lashes,
  montage,
  cta,
  musicFile,
}) => {
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#12100e" }}>
      <Sequence durationInFrames={112} name="Hook">
        <HookScene hook={hook} photo={nails[0]} />
      </Sequence>
      <Sequence from={112} durationInFrames={56} name="Logo">
        <LogoScene logo={logo} handle={handle} />
      </Sequence>
      <Sequence from={168} durationInFrames={336} name="Nails">
        <NailsScene nails={nails} label={labels.nails} logo={logo} />
      </Sequence>
      <Sequence from={504} durationInFrames={112} name="Brows">
        <BrowsScene brows={brows} label={labels.brows} logo={logo} />
      </Sequence>
      <Sequence from={616} durationInFrames={56} name="Lashes">
        <LashesScene photo={lashes} label={labels.lashes} logo={logo} />
      </Sequence>
      <Sequence from={672} durationInFrames={112} name="Montage">
        <MontageScene images={montage} logo={logo} />
      </Sequence>
      <Sequence from={784} durationInFrames={112} name="CTA">
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
