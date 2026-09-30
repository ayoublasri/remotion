import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { DISPLAY } from "../fonts";

// Remix of the Number Counter element: the price counts from the old value
// down to the new one, then lands with a small stamp bounce.
export const Price: React.FC<{
  readonly from: number;
  readonly to: number;
  readonly at: number;
  readonly duration: number;
  readonly size: number;
  readonly color: string;
  readonly unit: string;
}> = ({ from, to, at, duration, size, color, unit }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [at, at + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const current = Math.round(from + (to - from) * progress);

  return (
    <Interactive.Div
      name="Price"
      style={{
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1,
        color,
        whiteSpace: "nowrap",
        fontVariantNumeric: "tabular-nums",
        transformOrigin: "100% 60%",
        scale: interpolate(
          frame,
          [at + duration - 2, at + duration + 4, at + duration + 14],
          [1, 1.16, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          },
        ),
        opacity: interpolate(frame, [at - 4, at], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {`${current} ${unit}`}
    </Interactive.Div>
  );
};
