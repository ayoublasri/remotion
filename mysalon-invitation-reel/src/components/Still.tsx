import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// A frozen frame of the ad, blurring and darkening over the first frames so a
// built scene grows out of the footage.
export const Still: React.FC<{
  readonly src: string;
  readonly blur: number;
  readonly darken: number;
}> = ({ src, blur, darken }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 18], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: `blur(${blur * t}px)`,
          scale: String(1 + 0.06 * t),
        }}
      />
      <AbsoluteFill
        style={{ backgroundColor: `rgba(8,30,28,${darken * t})` }}
      />
    </AbsoluteFill>
  );
};
