import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { BODY_FONT } from "../fonts";

export const HandleChip: React.FC<{ readonly handle: string }> = ({
  handle,
}) => {
  const frame = useCurrentFrame();

  return (
    <Interactive.Div
      name="Handle chip"
      style={{
        position: "absolute",
        top: 250,
        right: 72,
        padding: "16px 28px",
        borderRadius: 999,
        backgroundColor: "rgba(20,10,14,0.45)",
        border: "1px solid rgba(255,255,255,0.35)",
        backdropFilter: "blur(16px)",
        color: "#ffffff",
        fontFamily: BODY_FONT,
        fontWeight: 600,
        fontSize: 34,
        letterSpacing: "0.02em",
        translate: interpolate(frame, [0, 16], ["0px -60px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 200 }),
        }),
        opacity: interpolate(frame, [0, 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {handle}
    </Interactive.Div>
  );
};
