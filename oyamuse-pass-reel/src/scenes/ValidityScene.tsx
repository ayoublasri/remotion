import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Clock } from "../components/Clock";
import { Flash, Twinkles } from "../components/Overlays";
import { Sfx } from "../components/Sfx";
import { PopLine, RiseLine } from "../components/Text";
import { WeekStrip } from "../components/WeekStrip";
import { DISPLAY, SANS } from "../fonts";
import type { PassReelProps } from "../schema";
import { CREAM, GOLD, GREEN, GREEN_DEEP } from "../theme";

// Bars 9-10: when the prices apply. Days light up on the beat, then the hours.
export const ValidityScene: React.FC<{
  readonly validity: PassReelProps["validity"];
}> = ({ validity }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Validity scene"
      style={{
        background: `radial-gradient(80% 55% at 50% 35%, ${GREEN} 0%, ${GREEN_DEEP} 100%)`,
        scale: interpolate(frame, [0, 12], [1.05, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }),
      }}
    >
      <Twinkles
        points={[
          { x: 8, y: 9 },
          { x: 92, y: 8 },
          { x: 8, y: 91 },
          { x: 92, y: 90 },
        ]}
        color={GOLD}
      />
      <Sfx name="stamp" at={56} volume={0.8} />
      <AbsoluteFill
        name="Copy"
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 80px 0",
          textAlign: "center",
        }}
      >
        <RiseLine
          name="Validity intro"
          text={validity.intro}
          at={0}
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 44,
            color: "rgba(246,239,226,0.85)",
          }}
        />
        <PopLine
          name="Validity only"
          text={validity.only}
          at={4}
          style={{
            marginTop: 14,
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 104,
            lineHeight: 1,
            letterSpacing: "0.08em",
            color: GOLD,
          }}
        />
        <div style={{ marginTop: 70 }}>
          <WeekStrip activeDays={validity.activeDays} at={14} spacing={14} />
        </div>
        <RiseLine
          name="Validity days"
          text={validity.days}
          at={42}
          style={{
            marginTop: 34,
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 56,
            letterSpacing: "0.08em",
            color: CREAM,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 40,
            marginTop: 64,
          }}
        >
          <Clock
            size={230}
            fromHour={validity.fromHour}
            toHour={validity.toHour}
            at={60}
            duration={40}
          />
          <PopLine
            name="Validity hours"
            text={validity.hours}
            at={56}
            style={{
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: 120,
              lineHeight: 1,
              letterSpacing: "0.02em",
              color: GOLD,
              whiteSpace: "nowrap",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 64,
            padding: "18px 40px",
            borderRadius: 999,
            backgroundColor: CREAM,
            color: GREEN_DEEP,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 36,
            scale: interpolate(frame, [84, 98], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 12, stiffness: 180, mass: 0.8 }),
              output: "perceptual-scale",
            }),
          }}
        >
          {validity.note}
        </div>
      </AbsoluteFill>
      <Flash at={0} peak={0.5} />
    </AbsoluteFill>
  );
};
