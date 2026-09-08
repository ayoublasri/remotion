import { Easing, interpolate, useCurrentFrame } from "remotion";

// Touch feedback: an expanding ring centered on its parent (parent must be position: relative).
export const TapRing: React.FC<{ readonly at: number }> = ({ at }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 70,
        height: 70,
        marginLeft: -35,
        marginTop: -35,
        borderRadius: 35,
        border: "4px solid #0f5c57",
        backgroundColor: "rgba(15,92,87,0.28)",
        pointerEvents: "none",
        scale: interpolate(frame, [at, at + 14], [0.35, 1.3], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.quad),
        }),
        opacity: interpolate(
          frame,
          [at - 1, at, at + 4, at + 14],
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
