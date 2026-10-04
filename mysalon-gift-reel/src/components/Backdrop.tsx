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
  readonly base: string;
}> = ({ image, blur, tint, base }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      name="Backdrop"
      style={{ overflow: "hidden", backgroundColor: base }}
    >
      <Img
        src={staticFile(`images/${image}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: `blur(${blur}px)`,
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
