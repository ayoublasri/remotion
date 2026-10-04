import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

// Short white flash on a downbeat.
export const Flash: React.FC<{
  readonly at: number;
  readonly peak: number;
}> = ({ at, peak }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Flash"
      style={{
        backgroundColor: "#fff8f2",
        pointerEvents: "none",
        opacity: interpolate(frame, [at - 1, at, at + 6], [0, peak, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.quad),
        }),
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    name="Vignette"
    style={{
      background:
        "radial-gradient(ellipse 80% 65% at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.5) 100%)",
      pointerEvents: "none",
    }}
  />
);

// Fine animated film grain.
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Grain"
      style={{ opacity: 0.06, mixBlendMode: "overlay", pointerEvents: "none" }}
    >
      <svg width="100%" height="100%">
        <filter id="oy-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed={frame % 10}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#oy-grain)" />
      </svg>
    </AbsoluteFill>
  );
};

// Diagonal band of light sweeping across the frame once.
export const ShineSweep: React.FC<{ readonly at: number }> = ({ at }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Shine"
      style={{
        mixBlendMode: "screen",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-40%",
          left: 0,
          width: 380,
          height: "180%",
          rotate: "22deg",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,244,236,0.7) 50%, rgba(255,255,255,0) 100%)",
          translate: interpolate(
            frame,
            [at, at + 34],
            ["-600px 0px", "1500px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.55, 0, 0.35, 1),
            },
          ),
          opacity: interpolate(
            frame,
            [at, at + 8, at + 26, at + 34],
            [0, 0.85, 0.85, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
        }}
      />
    </AbsoluteFill>
  );
};

// Four-point star, used as ornament and as twinkles.
export const Star: React.FC<{
  readonly size: number;
  readonly color: string;
}> = ({ size, color }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    style={{ display: "block", flexShrink: 0 }}
  >
    <path
      d="M50 0 C54 34 66 46 100 50 C66 54 54 66 50 100 C46 66 34 54 0 50 C34 46 46 34 50 0 Z"
      fill={color}
    />
  </svg>
);

const Twinkle: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly delay: number;
  readonly size: number;
  readonly color: string;
}> = ({ x, y, delay, size, color }) => {
  const frame = useCurrentFrame();
  const local = (frame + delay) % 48;

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
        filter: "drop-shadow(0 0 8px rgba(255,240,220,0.9))",
        scale: interpolate(local, [0, 10, 24, 38], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        rotate: `${interpolate(local, [0, 48], [0, 90])}deg`,
      }}
    >
      <Star size={size} color={color} />
    </div>
  );
};

export const Twinkles: React.FC<{
  readonly points: readonly { readonly x: number; readonly y: number }[];
  readonly color: string;
}> = ({ points, color }) => (
  <AbsoluteFill name="Twinkles" style={{ pointerEvents: "none" }}>
    {points.map((p, i) => (
      <Twinkle
        key={`${p.x}-${p.y}`}
        x={p.x}
        y={p.y}
        delay={i * 17}
        size={i % 2 === 0 ? 74 : 50}
        color={color}
      />
    ))}
  </AbsoluteFill>
);
