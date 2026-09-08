import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Full-bleed photo with a slow Ken Burns move and, optionally, a subtle
// pulse on every beat (18 frames) so the picture breathes with the music.
export const Photo: React.FC<{
  readonly image: string;
  readonly focusX: number;
  readonly focusY: number;
  readonly zoomFrom: number;
  readonly zoomTo: number;
  readonly driftX: number;
  readonly driftY: number;
  readonly pulse: boolean;
}> = ({ image, focusX, focusY, zoomFrom, zoomTo, driftX, driftY, pulse }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const kenBurns = interpolate(
    frame,
    [0, durationInFrames - 1],
    [zoomFrom, zoomTo],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.33, 0, 0.67, 1),
    },
  );
  const beatPulse = pulse
    ? interpolate(frame % 18, [0, 2, 12], [0.018, 0.012, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AbsoluteFill
      name="Photo"
      style={{ overflow: "hidden", backgroundColor: "#1e130e" }}
    >
      <Img
        name="Picture"
        src={staticFile(`images/${image}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${focusX}% ${focusY}%`,
          scale: String(kenBurns + beatPulse),
          translate: interpolate(
            frame,
            [0, durationInFrames - 1],
            ["0px 0px", `${driftX}px ${driftY}px`],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.33, 0, 0.67, 1),
            },
          ),
        }}
      />
    </AbsoluteFill>
  );
};
