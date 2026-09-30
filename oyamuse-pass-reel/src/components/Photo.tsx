import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Full-bleed photo: hard punch-in on the first frames, then a slow Ken Burns
// move, plus a subtle pulse on every beat (14 frames) so it moves with the music.
export const Photo: React.FC<{
  readonly image: string;
  readonly focusX: number;
  readonly focusY: number;
  readonly zoomFrom: number;
  readonly zoomTo: number;
  readonly driftX: number;
  readonly driftY: number;
  readonly rotation: number;
  readonly punch: boolean;
  readonly pulse: boolean;
}> = ({
  image,
  focusX,
  focusY,
  zoomFrom,
  zoomTo,
  driftX,
  driftY,
  rotation,
  punch,
  pulse,
}) => {
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
  const punchIn = punch
    ? interpolate(frame, [0, 9], [0.16, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      })
    : 0;
  const beatPulse = pulse
    ? interpolate(frame % 14, [0, 2, 9], [0.022, 0.015, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AbsoluteFill
      name="Photo"
      style={{ overflow: "hidden", backgroundColor: "#12100e" }}
    >
      <Img
        name="Picture"
        src={staticFile(`images/${image}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${focusX}% ${focusY}%`,
          rotate: `${rotation}deg`,
          scale: String(kenBurns + punchIn + beatPulse),
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
