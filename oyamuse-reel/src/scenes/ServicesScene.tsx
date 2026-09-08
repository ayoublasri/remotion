import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Flash, Star } from "../components/Overlays";
import { SANS, SERIF } from "../fonts";
import type { OyamuseReelProps } from "../schema";

const Item: React.FC<{ readonly text: string; readonly at: number }> = ({
  text,
  at,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 24,
        fontFamily: SERIF,
        fontWeight: 400,
        fontSize: 60,
        color: "#2a1b14",
        opacity: interpolate(frame, [at, at + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(frame, [at, at + 16], ["-40px 0px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <Star size={30} color="#c9a36a" />
      {text}
    </div>
  );
};

// Bar 10: everything in one place. Items land on eighth notes.
export const ServicesScene: React.FC<{
  readonly services: OyamuseReelProps["services"];
}> = ({ services }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Services scene"
      style={{
        background:
          "radial-gradient(70% 45% at 50% 40%, #f9ebe3 0%, #f5eee6 55%, #ecdfd2 100%)",
        justifyContent: "center",
        alignItems: "center",
        gap: 56,
      }}
    >
      <Interactive.Div
        name="Services title"
        style={{
          fontFamily: SERIF,
          fontWeight: 700,
          fontSize: 82,
          lineHeight: 1.1,
          color: "#2a1b14",
          textAlign: "center",
          padding: "0 80px",
          scale: interpolate(frame, [0, 16], [0.85, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 13, stiffness: 170, mass: 0.8 }),
            output: "perceptual-scale",
          }),
          opacity: interpolate(frame, [0, 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {services.title}
      </Interactive.Div>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <Item text={services.items[0]} at={9} />
        <Item text={services.items[1]} at={18} />
        <Item text={services.items[2]} at={27} />
        <Item text={services.items[3]} at={36} />
      </div>
      <Interactive.Div
        name="Services footnote"
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 28,
          letterSpacing: "0.34em",
          paddingLeft: "0.34em",
          textTransform: "uppercase",
          color: "#c9a36a",
          opacity: interpolate(frame, [48, 58], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {services.footnote}
      </Interactive.Div>
      <Flash at={0} peak={0.45} />
    </AbsoluteFill>
  );
};
