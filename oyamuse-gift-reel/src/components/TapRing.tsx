import { Easing, interpolate, useCurrentFrame } from "remotion";

// Touch feedback: an expanding ring centred on its (position: relative) parent.
export const TapRing: React.FC<{
  readonly at: number;
  readonly color: string;
}> = ({ at, color }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 64,
        height: 64,
        marginLeft: -32,
        marginTop: -32,
        borderRadius: 32,
        border: `4px solid ${color}`,
        backgroundColor: "rgba(196,162,79,0.25)",
        pointerEvents: "none",
        scale: interpolate(frame, [at, at + 12], [0.4, 1.5], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.quad),
        }),
        opacity: interpolate(
          frame,
          [at - 1, at, at + 4, at + 12],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        ),
      }}
    />
  );
};
