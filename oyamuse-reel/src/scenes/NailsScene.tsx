import { AbsoluteFill, Sequence } from "remotion";
import {
  Flash,
  Grain,
  ShineSweep,
  Twinkles,
  Vignette,
} from "../components/Overlays";
import { Photo } from "../components/Photo";
import { Caption, SectionHeader } from "../components/Text";
import type { NailSet } from "../schema";

const NailShot: React.FC<{ readonly set: NailSet; readonly index: number }> = ({
  set,
  index,
}) => (
  <AbsoluteFill name="Nail shot">
    <Photo
      image={set.image}
      focusX={set.focusX}
      focusY={set.focusY}
      zoomFrom={1.08}
      zoomTo={1.2}
      driftX={index % 2 === 0 ? 26 : -26}
      driftY={-16}
      pulse
    />
    <ShineSweep at={6} />
    <Twinkles points={set.sparkles} color="#fff6ea" />
    <AbsoluteFill
      name="Legibility"
      style={{
        background:
          "linear-gradient(180deg, rgba(20,12,8,0.45) 0%, rgba(20,12,8,0) 24%, rgba(20,12,8,0) 55%, rgba(20,12,8,0.82) 100%)",
        pointerEvents: "none",
      }}
    />
    <Vignette />
    <AbsoluteFill
      name="Caption slot"
      style={{ justifyContent: "flex-end", padding: "0 80px 480px" }}
    >
      <Caption
        title={set.title}
        descriptor={set.descriptor}
        at={18}
        color="#ffffff"
        accent="#e9c3b6"
        align="left"
        titleSize={86}
      />
    </AbsoluteFill>
    <SectionHeader
      label="NAILS"
      counter={`0${index + 1} — 03`}
      color="#ffffff"
    />
    <Grain />
    <Flash at={0} peak={0.4} />
  </AbsoluteFill>
);

// Bars 4-6: one set per bar, cut on the downbeat.
export const NailsScene: React.FC<{ readonly nails: NailSet[] }> = ({
  nails,
}) => (
  <AbsoluteFill name="Nails scene" style={{ backgroundColor: "#1e130e" }}>
    <Sequence durationInFrames={72} name="Set 1">
      <NailShot set={nails[0]} index={0} />
    </Sequence>
    <Sequence from={72} durationInFrames={72} name="Set 2">
      <NailShot set={nails[1]} index={1} />
    </Sequence>
    <Sequence from={144} durationInFrames={72} name="Set 3">
      <NailShot set={nails[2]} index={2} />
    </Sequence>
  </AbsoluteFill>
);
