import { Img, staticFile, useCurrentFrame } from "remotion";

// The round OYA logo, optionally with a slowly rotating gold dashed ring.
export const LogoBadge: React.FC<{
  readonly image: string;
  readonly size: number;
  readonly ring: boolean;
}> = ({ image, size, ring }) => {
  const frame = useCurrentFrame();
  const inset = ring ? size * 0.075 : 0;

  return (
    <div
      style={{ width: size, height: size, position: "relative", flexShrink: 0 }}
    >
      {ring ? (
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          style={{
            position: "absolute",
            inset: 0,
            rotate: `${frame * 0.6}deg`,
          }}
        >
          <circle
            cx="50"
            cy="50"
            r="48.5"
            fill="none"
            stroke="#c4a24f"
            strokeWidth="0.8"
            strokeDasharray="3 2.2"
            strokeLinecap="round"
          />
        </svg>
      ) : null}
      <div
        style={{
          position: "absolute",
          inset,
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow:
            "0 30px 80px rgba(31,75,60,0.22), 0 0 0 2px rgba(196,162,79,0.35)",
          backgroundColor: "#f6efe2",
        }}
      >
        <Img
          src={staticFile(`images/${image}`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            scale: "1.045",
          }}
        />
      </div>
    </div>
  );
};
