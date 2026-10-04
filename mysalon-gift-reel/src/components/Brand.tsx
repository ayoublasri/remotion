import { DISPLAY, SERIF } from "../fonts";
import { LogoBadge } from "./Logo";

// Eight-pointed star (two overlapping squares), the MySalon.ma mark.
export const StarMark: React.FC<{
  readonly size: number;
  readonly color: string;
}> = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={{ display: "block", flexShrink: 0 }}
  >
    <rect x="18" y="18" width="64" height="64" rx="6" fill={color} />
    <rect
      x="18"
      y="18"
      width="64"
      height="64"
      rx="6"
      fill={color}
      transform="rotate(45 50 50)"
    />
  </svg>
);

// The MySalon.ma wordmark.
export const Logo: React.FC<{
  readonly size: number;
  readonly color: string;
  readonly accent: string;
  readonly starColor: string;
}> = ({ size, color, accent, starColor }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: size * 0.18,
      fontFamily: SERIF,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1,
      letterSpacing: "-0.01em",
      whiteSpace: "nowrap",
    }}
  >
    <StarMark size={size * 0.42} color={starColor} />
    <span style={{ color }}>
      MySalon<span style={{ color: accent }}>.ma</span>
    </span>
  </div>
);

// Partnership lockup: the salon being offered × the platform it is booked on.
export const CoBrand: React.FC<{
  readonly logo: string;
  readonly name: string;
  readonly size: number;
  readonly nameColor: string;
  readonly crossColor: string;
  readonly wordmark: { color: string; accent: string; star: string };
}> = ({ logo, name, size, nameColor, crossColor, wordmark }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: size * 0.45,
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: size * 0.35,
      }}
    >
      <LogoBadge
        image={logo}
        size={size * 1.9}
        ring={false}
        ringColor={nameColor}
      />
      <div
        style={{
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: size * 0.95,
          letterSpacing: "0.12em",
          color: nameColor,
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </div>
    </div>
    <div
      style={{
        fontFamily: SERIF,
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: size * 1.1,
        color: crossColor,
      }}
    >
      ×
    </div>
    <Logo
      size={size}
      color={wordmark.color}
      accent={wordmark.accent}
      starColor={wordmark.star}
    />
  </div>
);
