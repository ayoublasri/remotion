import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Flash, Grain, Vignette } from "../components/Overlays";
import { Photo } from "../components/Photo";
import { SectionLabel } from "../components/Text";
import { DISPLAY } from "../fonts";
import type { OyamuseReelProps } from "../schema";

const Pill: React.FC<{
  readonly text: string;
  readonly at: number;
  readonly top: number;
  readonly dark: boolean;
}> = ({ text, at, top, dark }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        top,
        padding: "12px 30px 12px 36px",
        borderRadius: 999,
        backgroundColor: dark ? "rgba(31,75,60,0.92)" : "#c4a24f",
        color: dark ? "#f6efe2" : "#1f4b3c",
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: 32,
        letterSpacing: "0.32em",
        scale: interpolate(frame, [at, at + 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 12, stiffness: 180, mass: 0.8 }),
          output: "perceptual-scale",
        }),
      }}
    >
      {text}
    </div>
  );
};

// Bars 10-11: the before/after composite. The lower half is hidden by a cream
// panel that drops away on the downbeat of bar 11.
export const BrowsScene: React.FC<{
  readonly brows: OyamuseReelProps["brows"];
  readonly label: string;
  readonly logo: string;
}> = ({ brows, label, logo }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill name="Brows scene" style={{ backgroundColor: "#12100e" }}>
      <Photo
        image={brows.image}
        focusX={50}
        focusY={50}
        zoomFrom={1.02}
        zoomTo={1.07}
        driftX={0}
        driftY={0}
        rotation={0}
        punch={false}
        pulse={false}
      />
      <Pill text={brows.beforeLabel} at={8} top={452} dark />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 960,
          height: 960,
          backgroundColor: "#f6efe2",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 22,
          boxShadow: "0 -20px 60px rgba(0,0,0,0.2)",
          translate: interpolate(frame, [56, 70], ["0px 0px", "0px 1000px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.6, 0, 0.4, 1),
          }),
        }}
      >
        <Interactive.Div
          name="Cover title"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 104,
            letterSpacing: "0.2em",
            paddingLeft: "0.2em",
            color: "#1f4b3c",
            scale: interpolate(frame, [0, 14], [0.85, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 13, stiffness: 180, mass: 0.8 }),
              output: "perceptual-scale",
            }),
            opacity: interpolate(frame, [0, 6], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {brows.afterLabel}
        </Interactive.Div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            fontSize: 40,
            color: "#c4a24f",
            translate: interpolate(
              frame % 14,
              [0, 7, 14],
              ["0px 0px", "0px 10px", "0px 0px"],
            ),
          }}
        >
          ↓
        </div>
      </div>
      <Pill text={brows.afterLabel} at={62} top={1416} dark={false} />
      <SectionLabel label={label} logo={logo} color="#1f4b3c" />
      <Vignette />
      <Grain />
      <Flash at={0} peak={0.5} />
      <Flash at={56} peak={0.6} />
    </AbsoluteFill>
  );
};
