import { Easing, interpolate, useCurrentFrame } from "remotion";

const PATHS: Record<"flowers" | "perfume" | "chocolates", string[]> = {
  flowers: [
    "M27 34 C25 24 31 18 35 24 C39 18 45 24 43 34 C41 40 29 40 27 34 Z",
    "M42 26 C40 16 46 10 50 16 C54 10 60 16 58 26 C56 32 44 32 42 26 Z",
    "M57 34 C55 24 61 18 65 24 C69 18 75 24 73 34 C71 40 59 40 57 34 Z",
    "M35 40 L47 62 M50 32 L50 62 M65 40 L53 62",
    "M37 58 L63 58 L55 90 L45 90 Z",
    "M44 64 C38 60 38 70 44 67 M56 64 C62 60 62 70 56 67",
  ],
  perfume: [
    "M30 46 Q30 40 36 40 L64 40 Q70 40 70 46 L70 84 Q70 90 64 90 L36 90 Q30 90 30 84 Z",
    "M40 56 L60 56 L60 74 L40 74 Z",
    "M44 40 L44 32 L56 32 L56 40",
    "M41 32 L41 20 L59 20 L59 32 Z",
    "M59 25 C66 25 70 23 72 18 M73 16 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0",
  ],
  chocolates: [
    "M50 86 C22 66 14 50 20 38 C26 26 44 26 50 38 C56 26 74 26 80 38 C86 50 78 66 50 86 Z",
    "M50 76 C31 62 25 51 29 43 C33 36 44 36 50 45 C56 36 67 36 71 43 C75 51 69 62 50 76 Z",
    "M50 38 C45 30 38 32 42 38 M50 38 C55 30 62 32 58 38",
  ],
};

// Line-art icon in a thin ring, drawing itself on from `at`.
export const LineIcon: React.FC<{
  readonly kind: "flowers" | "perfume" | "chocolates";
  readonly at: number;
  readonly size: number;
  readonly color: string;
}> = ({ kind, at, size, color }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [at, at + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ display: "block", flexShrink: 0, overflow: "visible" }}
    >
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="rgba(255,255,255,0.05)"
        stroke={color}
        strokeOpacity="0.55"
        strokeWidth="1.2"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - draw}
      />
      {PATHS[kind].map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - draw}
        />
      ))}
    </svg>
  );
};
