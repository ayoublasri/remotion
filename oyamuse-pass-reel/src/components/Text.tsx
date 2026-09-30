import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { DISPLAY } from "../fonts";
import { LogoBadge } from "./Logo";

// Top bar of a scene: one spaced label on the left, the logo on the right.
export const SectionLabel: React.FC<{
  readonly label: string;
  readonly logo: string;
  readonly color: string;
}> = ({ label, logo, color }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: 140,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        opacity: interpolate(frame, [0, 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <div
        style={{
          fontFamily: DISPLAY,
          fontWeight: 600,
          fontSize: 34,
          letterSpacing: "0.3em",
          color,
          translate: interpolate(frame, [0, 12], ["-30px 0px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {label}
      </div>
      <LogoBadge image={logo} size={104} ring={false} />
    </div>
  );
};

// A line that pops in on a beat with a spring.
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
        scale: interpolate(frame, [at, at + 14], [0.8, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 12, stiffness: 180, mass: 0.8 }),
          output: "perceptual-scale",
        }),
        opacity: interpolate(frame, [at, at + 5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {text}
    </Interactive.Div>
  );
};

// A line that slides up into place.
export const RiseLine: React.FC<{
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
        opacity: interpolate(frame, [at, at + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(frame, [at, at + 16], ["0px 40px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      {text}
    </Interactive.Div>
  );
};
