import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { Flash, Grain, Vignette } from "../components/Overlays";
import { Photo } from "../components/Photo";
import { Caption, SectionHeader } from "../components/Text";
import { SANS, SERIF } from "../fonts";
import type { OyamuseReelProps } from "../schema";

const Label: React.FC<{
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
        padding: "12px 26px",
        borderRadius: 999,
        backgroundColor: dark ? "rgba(42,27,20,0.85)" : "#e9c3b6",
        color: dark ? "#ffffff" : "#2a1b14",
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 30,
        letterSpacing: "0.3em",
        paddingLeft: 32,
        scale: interpolate(frame, [at, at + 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 12, stiffness: 170, mass: 0.8 }),
          output: "perceptual-scale",
        }),
      }}
    >
      {text}
    </div>
  );
};

// Bars 7-8: the before/after composite; the "after" half is covered by a
// cream panel that drops away on the downbeat of bar 8.
const BeforeAfter: React.FC<{ readonly brows: OyamuseReelProps["brows"] }> = ({
  brows,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill name="Before after">
      <Photo
        image={brows.image}
        focusX={50}
        focusY={50}
        zoomFrom={1}
        zoomTo={1.06}
        driftX={0}
        driftY={0}
        pulse={false}
      />
      <AbsoluteFill name="Caption slot" style={{ padding: "236px 80px 0" }}>
        <Caption
          title={brows.title}
          descriptor={brows.descriptor}
          at={6}
          color="#2a1b14"
          accent="#7a4a34"
          align="left"
          titleSize={80}
        />
      </AbsoluteFill>
      <Label text={brows.beforeLabel} at={12} top={452} dark />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 960,
          height: 960,
          backgroundColor: "#f5eee6",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          boxShadow: "0 -20px 60px rgba(0,0,0,0.18)",
          translate: interpolate(frame, [72, 90], ["0px 0px", "0px 1000px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.6, 0, 0.4, 1),
          }),
        }}
      >
        <Interactive.Div
          name="Cover title"
          style={{
            fontFamily: SERIF,
            fontWeight: 900,
            fontSize: 110,
            letterSpacing: "0.12em",
            paddingLeft: "0.12em",
            color: "#2a1b14",
            scale: interpolate(frame, [0, 16], [0.85, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 13, stiffness: 170, mass: 0.8 }),
              output: "perceptual-scale",
            }),
            opacity: interpolate(frame, [0, 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {brows.coverTitle}
        </Interactive.Div>
        <Interactive.Div
          name="Cover subtitle"
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 28,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#c9a36a",
            opacity: interpolate(frame, [18, 28], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {brows.coverSubtitle}
        </Interactive.Div>
        <div
          style={{
            marginTop: 30,
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 30,
            color: "rgba(42,27,20,0.55)",
            opacity: interpolate(frame % 36, [0, 18, 36], [0.4, 1, 0.4]),
          }}
        >
          ↓
        </div>
      </div>
      <Label text={brows.afterLabel} at={80} top={1420} dark={false} />
      <Vignette />
      <Grain />
      <Flash at={0} peak={0.4} />
      <Flash at={72} peak={0.5} />
    </AbsoluteFill>
  );
};

const LashShot: React.FC<{ readonly brows: OyamuseReelProps["brows"] }> = ({
  brows,
}) => (
  <AbsoluteFill name="Lash shot">
    <Photo
      image={brows.lashImage}
      focusX={50}
      focusY={45}
      zoomFrom={1.02}
      zoomTo={1.1}
      driftX={-14}
      driftY={-10}
      pulse
    />
    <AbsoluteFill
      name="Legibility"
      style={{
        background:
          "linear-gradient(180deg, rgba(20,12,8,0.4) 0%, rgba(20,12,8,0) 24%, rgba(20,12,8,0) 55%, rgba(20,12,8,0.8) 100%)",
        pointerEvents: "none",
      }}
    />
    <Vignette />
    <AbsoluteFill
      name="Caption slot"
      style={{ justifyContent: "flex-end", padding: "0 80px 480px" }}
    >
      <Caption
        title={brows.lashTitle}
        descriptor={brows.lashDescriptor}
        at={12}
        color="#ffffff"
        accent="#e9c3b6"
        align="left"
        titleSize={78}
      />
    </AbsoluteFill>
    <SectionHeader label="LASHES & BROWS" counter="02 — 02" color="#ffffff" />
    <Grain />
    <Flash at={0} peak={0.4} />
  </AbsoluteFill>
);

// Bars 7-9.
export const BrowsScene: React.FC<{
  readonly brows: OyamuseReelProps["brows"];
}> = ({ brows }) => (
  <AbsoluteFill name="Brows scene" style={{ backgroundColor: "#1e130e" }}>
    <Sequence durationInFrames={144} name="Before after">
      <BeforeAfter brows={brows} />
    </Sequence>
    <Sequence from={144} durationInFrames={72} name="Lash lift">
      <LashShot brows={brows} />
    </Sequence>
  </AbsoluteFill>
);
