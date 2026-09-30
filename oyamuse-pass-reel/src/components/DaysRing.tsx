import { Easing, interpolate, useCurrentFrame } from "remotion";
import { DISPLAY } from "../fonts";
import { CREAM, GOLD } from "../theme";

// A gold ring drawing itself while the number counts up (Number Counter remix).
export const DaysRing: React.FC<{
  readonly days: number;
  readonly unit: string;
  readonly at: number;
  readonly duration: number;
  readonly size: number;
}> = ({ days, unit, at, duration, size }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [at, at + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        scale: interpolate(frame, [at - 8, at + 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 12, stiffness: 170, mass: 0.8 }),
          output: "perceptual-scale",
        }),
      }}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        style={{ display: "block", rotate: "-90deg" }}
      >
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(246,239,226,0.14)"
          strokeWidth="9"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={GOLD}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: size * 0.4,
            lineHeight: 1,
            color: CREAM,
            fontVariantNumeric: "tabular-nums",
            scale: interpolate(
              frame,
              [at + duration - 2, at + duration + 4, at + duration + 14],
              [1, 1.12, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
          }}
        >
          {Math.round(progress * days)}
        </div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            fontSize: size * 0.11,
            letterSpacing: "0.34em",
            paddingLeft: "0.34em",
            color: GOLD,
          }}
        >
          {unit}
        </div>
      </div>
    </div>
  );
};
