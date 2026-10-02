import { AbsoluteFill, useCurrentFrame } from "remotion";

// Slowly rotating starburst, drawn with a CSS conic gradient so it needs no
// WebGL. Adapted from the Rotating Starburst element idea.
export const Starburst: React.FC<{
  readonly colorA: string;
  readonly colorB: string;
  readonly rays: number;
  readonly opacity: number;
  readonly degreesPerFrame: number;
}> = ({ colorA, colorB, rays, opacity, degreesPerFrame }) => {
  const frame = useCurrentFrame();
  const step = 360 / (rays * 2);

  return (
    <AbsoluteFill
      name="Starburst"
      style={{
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        opacity,
      }}
    >
      <div
        style={{
          width: 2600,
          height: 2600,
          borderRadius: "50%",
          flexShrink: 0,
          background: `repeating-conic-gradient(from 0deg, ${colorA} 0deg ${step}deg, ${colorB} ${step}deg ${step * 2}deg)`,
          WebkitMaskImage:
            "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0) 62%)",
          maskImage:
            "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0) 62%)",
          rotate: `${frame * degreesPerFrame}deg`,
        }}
      />
    </AbsoluteFill>
  );
};
