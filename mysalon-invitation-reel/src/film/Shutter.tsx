import { AbsoluteFill, Freeze, useCurrentFrame } from "remotion";

// A 180-degree shutter: the children are drawn `samples` times across the
// half frame before the current one and summed, so fast moves smear instead
// of stepping into copies. Everything inside must be a pure function of
// useCurrentFrame(), which the Freeze sets to fractional frames.
export const Shutter: React.FC<{
  readonly samples: number;
  readonly children: React.ReactNode;
}> = ({ samples, children }) => {
  const frame = useCurrentFrame();
  if (samples <= 1) {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  return (
    <AbsoluteFill style={{ isolation: "isolate" }}>
      {Array.from({ length: samples }, (_, i) => (
        <AbsoluteFill
          key={i}
          style={{
            mixBlendMode: "plus-lighter",
            filter: `opacity(${1 / samples})`,
          }}
        >
          <Freeze frame={frame - (0.5 * i) / (samples - 1)}>{children}</Freeze>
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};
