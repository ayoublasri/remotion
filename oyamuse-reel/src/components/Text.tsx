import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { SANS, SERIF } from "../fonts";

// Serif title + spaced sans descriptor, sliding up on a beat.
export const Caption: React.FC<{
  readonly title: string;
  readonly descriptor: string;
  readonly at: number;
  readonly color: string;
  readonly accent: string;
  readonly align: "left" | "center";
  readonly titleSize: number;
}> = ({ title, descriptor, at, color, accent, align, titleSize }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        gap: 16,
        textAlign: align,
        opacity: interpolate(frame, [at, at + 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(frame, [at, at + 18], ["0px 60px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <Interactive.Div
        name="Caption title"
        style={{
          fontFamily: SERIF,
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: titleSize,
          lineHeight: 1.05,
          color,
          textShadow: "0 10px 40px rgba(0,0,0,0.35)",
        }}
      >
        {title}
      </Interactive.Div>
      <Interactive.Div
        name="Caption descriptor"
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 28,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: accent,
          textShadow: "0 6px 24px rgba(0,0,0,0.35)",
        }}
      >
        {descriptor}
      </Interactive.Div>
    </div>
  );
};

// Top bar of the photo scenes: outlined section word + counter.
export const SectionHeader: React.FC<{
  readonly label: string;
  readonly counter: string;
  readonly color: string;
}> = ({ label, counter, color }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: 150,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        opacity: interpolate(frame, [0, 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <div
        style={{
          fontFamily: SERIF,
          fontWeight: 900,
          fontSize: 64,
          letterSpacing: "0.14em",
          color: "transparent",
          WebkitTextStroke: `2px ${color}`,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: "0.3em",
          color,
          opacity: 0.85,
        }}
      >
        {counter}
      </div>
    </div>
  );
};

// A word that pops in on a beat with a spring.
export const PopLine: React.FC<{
  readonly text: string;
  readonly at: number;
  readonly style: React.CSSProperties;
  readonly name: string;
}> = ({ text, at, style, name }) => {
  const frame = useCurrentFrame();

  return (
    <Interactive.Div
      name={name}
      style={{
        ...style,
        scale: interpolate(frame, [at, at + 16], [0.82, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 13, stiffness: 170, mass: 0.8 }),
          output: "perceptual-scale",
        }),
        opacity: interpolate(frame, [at, at + 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {text}
    </Interactive.Div>
  );
};
