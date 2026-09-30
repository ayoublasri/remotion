import { BLUSH, PLUM, ROSE } from "../theme";
import { Star } from "./Overlays";

// Front-view silhouette with hair at three lengths, for the lissage cards.
export const HairIcon: React.FC<{
  readonly length: "short" | "medium" | "long";
  readonly size: number;
}> = ({ length, size }) => {
  const bottom = length === "short" ? 168 : length === "medium" ? 214 : 256;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size * 1.35,
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 200 270"
        width={size}
        height={size * 1.35}
        style={{ display: "block" }}
      >
        <path
          d={`M 40 120 C 40 30, 160 30, 160 120 L 160 ${bottom} C 160 ${bottom + 16}, 40 ${bottom + 16}, 40 ${bottom} Z`}
          fill={PLUM}
        />
        <ellipse cx="100" cy="118" rx="44" ry="54" fill={BLUSH} />
        <path
          d="M 78 110 q 8 -6 16 0"
          fill="none"
          stroke={PLUM}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 106 110 q 8 -6 16 0"
          fill="none"
          stroke={PLUM}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 92 146 q 8 6 16 0"
          fill="none"
          stroke={PLUM}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{ position: "absolute", left: size * 0.78, top: size * 0.14 }}
      >
        <Star size={size * 0.16} color={ROSE} />
      </div>
      <div
        style={{ position: "absolute", left: size * 0.06, top: size * 0.62 }}
      >
        <Star size={size * 0.11} color={ROSE} />
      </div>
    </div>
  );
};
