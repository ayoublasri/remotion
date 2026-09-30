import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Grain, Twinkles, Vignette } from "../components/Overlays";
import { Photo } from "../components/Photo";
import { PopLine } from "../components/Text";
import { SERIF } from "../fonts";
import type { PassReelProps } from "../schema";
import { GOLD_SOFT } from "../theme";

// Bars 1-2: the price shock, then the answer, while the music builds.
export const HookScene: React.FC<{ readonly hook: PassReelProps["hook"] }> = ({
  hook,
}) => {
  const frame = useCurrentFrame();
  const shake = interpolate(frame, [56, 112], [0, 7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  return (
    <AbsoluteFill name="Hook scene" style={{ backgroundColor: "#12100e" }}>
      <AbsoluteFill
        name="Shake"
        style={{
          translate: `${Math.sin(frame * 12.9) * shake}px ${Math.cos(frame * 7.3) * shake}px`,
        }}
      >
        <Photo
          image={hook.image}
          focusX={50}
          focusY={40}
          zoomFrom={1.16}
          zoomTo={1.3}
          driftX={0}
          driftY={-30}
          rotation={0}
          punch={false}
          pulse
        />
      </AbsoluteFill>
      <AbsoluteFill
        name="Darken"
        style={{
          background:
            "linear-gradient(180deg, rgba(12,10,8,0.3) 0%, rgba(12,10,8,0.5) 55%, rgba(12,10,8,0.82) 100%)",
        }}
      />
      <Vignette />
      <Twinkles
        points={[
          { x: 64, y: 22 },
          { x: 48, y: 30 },
          { x: 76, y: 60 },
        ]}
        color="#fff3e6"
      />
      <AbsoluteFill
        name="Hook text"
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 80px",
          gap: 26,
          textAlign: "center",
        }}
      >
        <PopLine
          name="Hook line 1"
          text={hook.line1}
          at={2}
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 92,
            lineHeight: 1.08,
            color: "#ffffff",
            textShadow: "0 12px 40px rgba(0,0,0,0.45)",
          }}
        />
        <PopLine
          name="Hook line 2"
          text={hook.line2}
          at={56}
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 92,
            lineHeight: 1.08,
            color: GOLD_SOFT,
            textShadow: "0 12px 40px rgba(0,0,0,0.45)",
          }}
        />
      </AbsoluteFill>
      <Grain />
      <AbsoluteFill
        name="Fade in"
        style={{
          backgroundColor: "#12100e",
          pointerEvents: "none",
          opacity: interpolate(frame, [0, 8], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
