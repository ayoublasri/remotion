import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { DISPLAY, SANS } from "../fonts";
import { LogoBadge } from "./Logo";
import { Star } from "./Overlays";

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

// The platform footer, like the flyer's: a four-point star and the site name.
export const SiteMark: React.FC<{
  readonly site: string;
  readonly at: number;
  readonly size: number;
  readonly color: string;
  readonly starColor: string;
}> = ({ site, at, size, color, starColor }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: size * 0.4,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: "0.04em",
        color,
        opacity: interpolate(frame, [at, at + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(frame, [at, at + 16], ["0px 30px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <Star size={size * 0.75} color={starColor} />
      {site}
    </div>
  );
};
