import { Easing, interpolate, useCurrentFrame } from "remotion";

const point = (angleDeg: number, radius: number) => {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: 100 + radius * Math.cos(a), y: 100 + radius * Math.sin(a) };
};

// The happy-hour clock: a highlighted arc marks the window on a 12-hour face
// and the hands sweep from the opening hour to the closing hour.
export const HourClock: React.FC<{
  readonly size: number;
  readonly fromHour: number;
  readonly toHour: number;
  readonly at: number;
  readonly duration: number;
  readonly face: string;
  readonly ink: string;
  readonly accent: string;
}> = ({ size, fromHour, toHour, at, duration, face, ink, accent }) => {
  const frame = useCurrentFrame();
  const hour = interpolate(frame, [at, at + duration], [fromHour, toHour], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const a0 = (fromHour % 12) * 30;
  let a1 = (toHour % 12) * 30;
  if (a1 <= a0) a1 += 360;
  const sweep = interpolate(frame, [at, at + duration], [a0, a1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const radius = 72;
  const start = point(a0, radius);
  const end = point(sweep, radius);
  const largeArc = sweep - a0 > 180 ? 1 : 0;

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      style={{
        display: "block",
        flexShrink: 0,
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
        fill={face}
        stroke={ink}
        strokeOpacity="0.12"
        strokeWidth="3"
      />
      <circle
        cx="100"
        cy="100"
        r={radius}
        fill="none"
        stroke={ink}
        strokeOpacity="0.1"
        strokeWidth="12"
      />
      {sweep - a0 > 0.5 ? (
        <path
          d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`}
          fill="none"
          stroke={accent}
          strokeWidth="12"
          strokeLinecap="round"
        />
      ) : null}
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          x1="100"
          y1="14"
          x2="100"
          y2={i % 3 === 0 ? 28 : 22}
          stroke={ink}
          strokeWidth={i % 3 === 0 ? 5 : 3}
          strokeLinecap="round"
          transform={`rotate(${i * 30} 100 100)`}
        />
      ))}
      <line
        x1="100"
        y1="100"
        x2="100"
        y2="52"
        stroke={ink}
        strokeWidth="9"
        strokeLinecap="round"
        transform={`rotate(${(hour % 12) * 30} 100 100)`}
      />
      <line
        x1="100"
        y1="100"
        x2="100"
        y2="36"
        stroke={accent}
        strokeWidth="6"
        strokeLinecap="round"
        transform={`rotate(${(hour % 1) * 360} 100 100)`}
      />
      <circle cx="100" cy="100" r="8" fill={ink} />
    </svg>
  );
};
