import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// A blurred, tinted photo behind a scene, with a slow drift.
export const Backdrop: React.FC<{
  readonly image: string;
  readonly blur: number;
  readonly tint: string;
  readonly opacity: number;
}> = ({ image, blur, tint, opacity }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      name="Backdrop"
      style={{ overflow: "hidden", backgroundColor: "#2a0c1a" }}
    >
      <Img
        src={staticFile(`images/${image}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: `blur(${blur}px)`,
          opacity,
          scale: String(
            interpolate(frame, [0, durationInFrames - 1], [1.18, 1.28], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.33, 0, 0.67, 1),
            }),
          ),
        }}
      />
      <AbsoluteFill style={{ backgroundColor: tint }} />
    </AbsoluteFill>
  );
};
