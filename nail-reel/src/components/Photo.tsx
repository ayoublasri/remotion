import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Full-bleed photo with a slow "Ken Burns" zoom + drift over the scene.
// `punch` uses a fast ease-out for the hook (a hard zoom that settles).
export const Photo: React.FC<{
  readonly image: string;
  readonly focusX: number;
  readonly zoomFrom: number;
  readonly zoomTo: number;
  readonly driftX: number;
  readonly punch: boolean;
}> = ({ image, focusX, zoomFrom, zoomTo, driftX, punch }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      name="Photo"
      style={{ overflow: "hidden", backgroundColor: "#0b0709" }}
    >
      <Img
        name="Nail photo"
        src={staticFile(`images/${image}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${focusX}% 50%`,
          scale: interpolate(
            frame,
            [0, durationInFrames - 1],
            [zoomFrom, zoomTo],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: punch
                ? Easing.out(Easing.exp)
                : Easing.bezier(0.33, 0, 0.67, 1),
            },
          ),
          translate: interpolate(
            frame,
            [0, durationInFrames - 1],
            ["0px 0px", `${driftX}px 0px`],
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
