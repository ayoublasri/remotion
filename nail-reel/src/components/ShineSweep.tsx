import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";

// A diagonal band of light that sweeps across the frame once,
// selling the glossy top coat.
export const ShineSweep: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Shine sweep"
      style={{
        mixBlendMode: "screen",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <Interactive.Div
        name="Light band"
        style={{
          position: "absolute",
          top: "-40%",
          left: 0,
          width: 420,
          height: "180%",
          rotate: "22deg",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,240,244,0.75) 50%, rgba(255,255,255,0) 100%)",
          translate: interpolate(frame, [6, 44], ["-600px 0px", "1500px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.55, 0, 0.35, 1),
          }),
          opacity: interpolate(frame, [6, 14, 36, 44], [0, 0.9, 0.9, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
