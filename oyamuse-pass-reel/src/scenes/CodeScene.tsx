import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { DaysRing } from "../components/DaysRing";
import { Flash, Twinkles } from "../components/Overlays";
import { Sfx } from "../components/Sfx";
import { RiseLine } from "../components/Text";
import { SANS, SERIF } from "../fonts";
import type { PassReelProps } from "../schema";
import { CREAM, GOLD, GREEN, GREEN_DEEP } from "../theme";

// Bars 14-15: the code stays valid for 45 days. The snare roll builds underneath.
export const CodeScene: React.FC<{ readonly code: PassReelProps["code"] }> = ({
  code,
}) => {
  const frame = useCurrentFrame();
  const shake = interpolate(frame, [70, 112], [0, 5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  return (
    <AbsoluteFill
      name="Code scene"
      style={{
        background: `radial-gradient(80% 55% at 50% 40%, ${GREEN} 0%, ${GREEN_DEEP} 100%)`,
        translate: `${Math.sin(frame * 12.9) * shake}px ${Math.cos(frame * 7.3) * shake}px`,
        scale: interpolate(frame, [0, 12], [1.05, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }),
      }}
    >
      <Twinkles
        points={[
          { x: 14, y: 24 },
          { x: 86, y: 20 },
          { x: 12, y: 74 },
          { x: 88, y: 70 },
        ]}
        color={GOLD}
      />
      <Sfx name="stamp" at={50} volume={0.7} />
      <AbsoluteFill
        name="Copy"
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          textAlign: "center",
        }}
      >
        <RiseLine
          name="Code intro"
          text={code.intro}
          at={0}
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 48,
            color: "rgba(246,239,226,0.9)",
          }}
        />
        <div style={{ marginTop: 60 }}>
          <DaysRing
            days={code.days}
            unit={code.unit}
            at={10}
            duration={40}
            size={560}
          />
        </div>
        <RiseLine
          name="Code outro"
          text={code.outro}
          at={52}
          style={{
            marginTop: 56,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 64,
            lineHeight: 1.1,
            color: CREAM,
          }}
        />
        <RiseLine
          name="Code reminder"
          text={code.reminder}
          at={66}
          style={{
            marginTop: 26,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 32,
            letterSpacing: "0.08em",
            color: GOLD,
          }}
        />
      </AbsoluteFill>
      <Flash at={0} peak={0.5} />
    </AbsoluteFill>
  );
};
