import { SERIF } from "../fonts";

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
