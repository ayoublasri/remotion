import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

const Sparkle: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly delay: number;
  readonly size: number;
}> = ({ x, y, delay, size }) => {
  const frame = useCurrentFrame();
  // Twinkle on a 44-frame loop, offset per sparkle.
  const local = (frame + delay) % 44;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        scale: interpolate(local, [0, 10, 22, 34], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        rotate: `${interpolate(local, [0, 44], [0, 90])}deg`,
        filter: "drop-shadow(0 0 8px rgba(255,255,255,0.9))",
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <path
          d="M50 0 C54 34 66 46 100 50 C66 54 54 66 50 100 C46 66 34 54 0 50 C34 46 46 34 50 0 Z"
          fill="#ffffff"
        />
      </svg>
    </div>
  );
};

export const Sparkles: React.FC<{
  readonly sparkles: readonly { readonly x: number; readonly y: number }[];
}> = ({ sparkles }) => {
  return (
    <AbsoluteFill name="Sparkles" style={{ pointerEvents: "none" }}>
      {sparkles.map((sparkle, i) => (
        <Sparkle
          key={`${sparkle.x}-${sparkle.y}`}
          x={sparkle.x}
          y={sparkle.y}
          delay={i * 15}
          size={i === 0 ? 86 : 58}
        />
      ))}
    </AbsoluteFill>
  );
};
