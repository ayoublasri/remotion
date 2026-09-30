import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Clock } from "../components/Clock";
import { Flash, Twinkles } from "../components/Overlays";
import { Sfx } from "../components/Sfx";
import { PopLine, RiseLine } from "../components/Text";
import { WeekStrip } from "../components/WeekStrip";
import { DISPLAY, SANS } from "../fonts";
import type { PassReelProps } from "../schema";
import { BLUSH, PLUM, PLUM_DEEP, ROSE_SOFT } from "../theme";

const HoursRow: React.FC<{
  readonly row: PassReelProps["validity"]["rows"][number];
  readonly at: number;
}> = ({ row, at }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 30,
        opacity: interpolate(frame, [at, at + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(frame, [at, at + 16], ["0px 30px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <Sfx name="stamp" at={at} volume={0.6} />
      <Clock
        size={150}
        fromHour={row.fromHour}
        toHour={row.toHour}
        at={at + 4}
        duration={36}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 6,
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: "0.34em",
            color: ROSE_SOFT,
          }}
        >
          {row.label}
        </div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 68,
            lineHeight: 1,
            letterSpacing: "0.02em",
            color: BLUSH,
            whiteSpace: "nowrap",
          }}
        >
          {row.hours}
        </div>
      </div>
    </div>
  );
};

// Bars 15-16: when the prices apply. Days light up on the beat, then the two windows.
export const ValidityScene: React.FC<{
  readonly validity: PassReelProps["validity"];
}> = ({ validity }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Validity scene"
      style={{
        background: `radial-gradient(80% 55% at 50% 35%, ${PLUM} 0%, ${PLUM_DEEP} 100%)`,
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
        color={ROSE_SOFT}
      />
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
            color: "rgba(236,213,206,0.85)",
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
            fontSize: 96,
            lineHeight: 1,
            letterSpacing: "0.08em",
            color: ROSE_SOFT,
          }}
        />
        <div style={{ marginTop: 50 }}>
          <WeekStrip activeDays={validity.activeDays} at={14} spacing={14} />
        </div>
        <RiseLine
          name="Validity days"
          text={validity.days}
          at={42}
          style={{
            marginTop: 30,
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 54,
            letterSpacing: "0.08em",
            color: BLUSH,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 26,
            marginTop: 44,
            alignItems: "flex-start",
          }}
        >
          <HoursRow row={validity.rows[0]} at={56} />
          <HoursRow row={validity.rows[1]} at={70} />
        </div>
        <div
          style={{
            marginTop: 50,
            padding: "18px 40px",
            borderRadius: 999,
            backgroundColor: BLUSH,
            color: PLUM_DEEP,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 34,
            scale: interpolate(frame, [88, 102], [0, 1], {
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
