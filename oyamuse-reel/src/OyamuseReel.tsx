import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import "./fonts";
import { BrandScene } from "./scenes/BrandScene";
import { BrowsScene } from "./scenes/BrowsScene";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { NailsScene } from "./scenes/NailsScene";
import { ServicesScene } from "./scenes/ServicesScene";
import type { OyamuseReelProps } from "./schema";

// 100 BPM soundtrack: 1 beat = 18 frames, 1 bar = 72 frames (see timing.ts).
// Every scene starts on a downbeat, so the cuts land on the music:
//   bars 1-2  Hook        0 - 144
//   bar  3    Brand     144 - 216   (drums drop)
//   bars 4-6  Nails     216 - 432   (one set per bar)
//   bars 7-9  Brows     432 - 648   (before/after, then lashes)
//   bar  10   Services  648 - 720
//   bars 11-12 CTA      720 - 864
export const OyamuseReel: React.FC<OyamuseReelProps> = ({
  handle,
  hook,
  brand,
  nails,
  brows,
  services,
  cta,
  musicFile,
}) => {
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#1e130e" }}>
      <Sequence durationInFrames={144} name="Hook">
        <HookScene hook={hook} image={nails[0].image} />
      </Sequence>
      <Sequence from={144} durationInFrames={72} name="Brand">
        <BrandScene brand={brand} handle={handle} />
      </Sequence>
      <Sequence from={216} durationInFrames={216} name="Nails">
        <NailsScene nails={nails} />
      </Sequence>
      <Sequence from={432} durationInFrames={216} name="Brows & lashes">
        <BrowsScene brows={brows} />
      </Sequence>
      <Sequence from={648} durationInFrames={72} name="Services">
        <ServicesScene services={services} />
      </Sequence>
      <Sequence from={720} durationInFrames={144} name="CTA">
        <CtaScene
          cta={cta}
          handle={handle}
          images={[
            nails[0].image,
            brows.lashImage,
            nails[1].image,
            brows.image,
            nails[2].image,
          ]}
        />
      </Sequence>
      {musicFile ? (
        <Audio
          name="Music"
          src={staticFile(musicFile)}
          volume={(frame) =>
            interpolate(
              frame,
              [0, 8, durationInFrames - 24, durationInFrames - 1],
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
