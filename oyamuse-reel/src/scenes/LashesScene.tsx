import { AbsoluteFill } from "remotion";
import { Flash, Grain, Twinkles, Vignette } from "../components/Overlays";
import { Photo } from "../components/Photo";
import { SectionLabel } from "../components/Text";
import type { Photo as PhotoProps } from "../schema";

// Bar 12: lash lift close-ups.
export const LashesScene: React.FC<{
  readonly photo: PhotoProps;
  readonly label: string;
  readonly logo: string;
}> = ({ photo, label, logo }) => (
  <AbsoluteFill name="Lashes scene" style={{ backgroundColor: "#12100e" }}>
    <Photo
      image={photo.image}
      focusX={photo.focusX}
      focusY={photo.focusY}
      zoomFrom={1.06}
      zoomTo={1.16}
      driftX={-20}
      driftY={-24}
      rotation={0}
      punch
      pulse
    />
    <Twinkles points={photo.sparkles} color="#fff6ea" />
    <Vignette />
    <SectionLabel label={label} logo={logo} color="#ffffff" />
    <Grain />
    <Flash at={0} peak={0.55} />
  </AbsoluteFill>
);
