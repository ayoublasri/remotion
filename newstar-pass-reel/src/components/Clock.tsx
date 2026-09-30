import { Easing, interpolate, useCurrentFrame } from "remotion";
import { BLUSH, ROSE, PLUM_DEEP } from "../theme";

// A clock face whose hands sweep from `fromHour` to `toHour`.
export const Clock: React.FC<{
  readonly size: number;
  readonly fromHour: number;
  readonly toHour: number;
  readonly at: number;
  readonly duration: number;
}> = ({ size, fromHour, toHour, at, duration }) => {
  const frame = useCurrentFrame();
  const hour = interpolate(frame, [at, at + duration], [fromHour, toHour], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const hourAngle = (hour % 12) * 30;
  const minuteAngle = (hour % 1) * 360;

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      style={{
        display: "block",
        scale: interpolate(frame, [at - 10, at + 4], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 12, stiffness: 170, mass: 0.8 }),
          output: "perceptual-scale",
        }),
      }}
    >
      <circle
        cx="100"
        cy="100"
        r="94"
        fill={BLUSH}
        stroke={ROSE}
        strokeWidth="5"
      />
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          x1="100"
          y1="14"
          x2="100"
          y2={i % 3 === 0 ? 30 : 22}
          stroke={PLUM_DEEP}
          strokeWidth={i % 3 === 0 ? 5 : 3}
          strokeLinecap="round"
          transform={`rotate(${i * 30} 100 100)`}
        />
      ))}
      <line
        x1="100"
        y1="100"
        x2="100"
        y2="48"
        stroke={PLUM_DEEP}
        strokeWidth="9"
        strokeLinecap="round"
        transform={`rotate(${hourAngle} 100 100)`}
      />
      <line
        x1="100"
        y1="100"
        x2="100"
        y2="30"
        stroke={ROSE}
        strokeWidth="6"
        strokeLinecap="round"
        transform={`rotate(${minuteAngle} 100 100)`}
      />
      <circle cx="100" cy="100" r="8" fill={PLUM_DEEP} />
    </svg>
  );
};
