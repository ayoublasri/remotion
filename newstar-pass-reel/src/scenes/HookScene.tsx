import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Grain, Twinkles, Vignette } from "../components/Overlays";
import { PopLine } from "../components/Text";
import { SERIF } from "../fonts";
import type { PassReelProps } from "../schema";
import { ROSE_SOFT } from "../theme";

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
    <AbsoluteFill name="Hook scene" style={{ backgroundColor: "#2a0c1a" }}>
      <AbsoluteFill
        name="Shake"
        style={{
          translate: `${Math.sin(frame * 12.9) * shake}px ${Math.cos(frame * 7.3) * shake}px`,
        }}
      >
        <Backdrop
          image={hook.image}
          blur={6}
          tint="rgba(42,12,26,0.5)"
          opacity={1}
        />
      </AbsoluteFill>
      <AbsoluteFill
        name="Darken"
        style={{
          background:
            "linear-gradient(180deg, rgba(42,12,26,0.2) 0%, rgba(42,12,26,0.45) 55%, rgba(42,12,26,0.85) 100%)",
        }}
      />
      <Vignette />
      <Twinkles
        points={[
          { x: 16, y: 22 },
          { x: 84, y: 28 },
          { x: 74, y: 70 },
        ]}
        color={ROSE_SOFT}
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
            color: ROSE_SOFT,
            textShadow: "0 12px 40px rgba(0,0,0,0.45)",
          }}
        />
      </AbsoluteFill>
      <Grain />
      <AbsoluteFill
        name="Fade in"
        style={{
          backgroundColor: "#2a0c1a",
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
