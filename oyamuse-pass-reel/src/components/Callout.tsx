import { makeCallout } from "@remotion/shapes";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { SANS } from "../fonts";

// Remix of the Product Discount Callout element: a speech-bubble label that
// pops in and wiggles once.
export const Callout: React.FC<{
  readonly text: string;
  readonly at: number;
  readonly fill: string;
  readonly color: string;
  readonly width: number;
}> = ({ text, at, fill, color, width }) => {
  const frame = useCurrentFrame();
  const shape = makeCallout({
    width,
    height: 62,
    pointerLength: 18,
    pointerBaseWidth: 30,
    pointerPosition: 0.72,
    pointerDirection: "down",
    cornerRadius: 14,
  });

  return (
    <Interactive.Div
      name="Callout"
      style={{
        position: "relative",
        width,
        height: 80,
        transformOrigin: "72% 100%",
        scale: interpolate(frame, [at, at + 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 11, stiffness: 190, mass: 0.7 }),
          output: "perceptual-scale",
        }),
        rotate: interpolate(
          frame,
          [at + 14, at + 20, at + 26, at + 32, at + 38],
          ["0deg", "8deg", "-6deg", "3deg", "0deg"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.quad),
          },
        ),
      }}
    >
      <svg
        viewBox={`0 0 ${shape.width} ${shape.height}`}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
          filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.22))",
        }}
      >
        <path d={shape.path} fill={fill} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 62,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 24,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </Interactive.Div>
  );
};
