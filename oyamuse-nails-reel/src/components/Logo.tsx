import { Img, staticFile, useCurrentFrame } from "remotion";

// A round salon logo, optionally with a slowly rotating dashed ring.
export const LogoBadge: React.FC<{
  readonly image: string;
  readonly size: number;
  readonly ring: boolean;
  readonly ringColor: string;
}> = ({ image, size, ring, ringColor }) => {
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
            stroke={ringColor}
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
            "0 24px 60px rgba(0,0,0,0.22), 0 0 0 2px rgba(255,255,255,0.7)",
          backgroundColor: "#ffffff",
        }}
      >
        <Img
          src={staticFile(`images/${image}`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            scale: "1.02",
          }}
        />
      </div>
    </div>
  );
};
