import { AbsoluteFill, Sequence } from "remotion";
import {
  Flash,
  Grain,
  ShineSweep,
  Twinkles,
  Vignette,
} from "../components/Overlays";
import { Photo } from "../components/Photo";
import { SectionLabel } from "../components/Text";
import type { Photo as PhotoProps } from "../schema";

const Shot: React.FC<{
  readonly photo: PhotoProps;
  readonly index: number;
  readonly label: string;
  readonly logo: string;
}> = ({ photo, index, label, logo }) => (
  <AbsoluteFill name="Shot">
    <Photo
      image={photo.image}
      focusX={photo.focusX}
      focusY={photo.focusY}
      zoomFrom={1.08}
      zoomTo={1.18}
      driftX={index % 2 === 0 ? 30 : -30}
      driftY={index % 3 === 0 ? -20 : 12}
      rotation={index % 2 === 0 ? -1.5 : 1.5}
      punch
      pulse
    />
    <ShineSweep at={4} />
    <Twinkles points={photo.sparkles} color="#fff6ea" />
    <AbsoluteFill
      name="Legibility"
      style={{
        background:
          "linear-gradient(180deg, rgba(12,10,8,0.45) 0%, rgba(12,10,8,0) 26%, rgba(12,10,8,0) 70%, rgba(12,10,8,0.45) 100%)",
        pointerEvents: "none",
      }}
    />
    <Vignette />
    <SectionLabel label={label} logo={logo} color="#ffffff" />
    <Grain />
    <Flash at={0} peak={0.55} />
  </AbsoluteFill>
);

// Bars 4-9: six sets, one bar each, every cut on the downbeat.
export const NailsScene: React.FC<{
  readonly nails: PhotoProps[];
  readonly label: string;
  readonly logo: string;
}> = ({ nails, label, logo }) => (
  <AbsoluteFill name="Nails scene" style={{ backgroundColor: "#12100e" }}>
    {nails.map((photo, i) => (
      <Sequence
        key={photo.image}
        from={i * 56}
        durationInFrames={56}
        name={`Set ${i + 1}`}
      >
        <Shot photo={photo} index={i} label={label} logo={logo} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
