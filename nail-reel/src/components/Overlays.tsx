import { AbsoluteFill, useCurrentFrame } from "remotion";

// Soft dark edges so text pops and the photo feels "shot", not pasted.
export const Vignette: React.FC = () => {
  return (
    <AbsoluteFill
      name="Vignette"
      style={{
        background:
          "radial-gradient(ellipse 80% 65% at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)",
        pointerEvents: "none",
      }}
    />
  );
};

// Animated film grain: the turbulence seed changes every frame.
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Film grain"
      style={{ opacity: 0.07, mixBlendMode: "overlay", pointerEvents: "none" }}
    >
      <svg width="100%" height="100%">
        <filter id="reel-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed={frame % 12}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#reel-grain)" />
      </svg>
    </AbsoluteFill>
  );
};
