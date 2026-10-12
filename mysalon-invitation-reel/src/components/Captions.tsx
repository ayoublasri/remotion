import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { SANS } from "../fonts";
import { SAFE } from "../layout";
import type { Caption } from "../schema";
import { MINT, PILL, WHITE } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// "*word*" marks the highlighted part of a line.
const parse = (line: string) =>
  line
    .split("*")
    .map((part, i) => ({ text: part, highlight: i % 2 === 1 }))
    .filter((p) => p.text.length > 0);

// One pill per line, white on teal, centred in the part of the frame that the
// Instagram icons leave free. Pops in, fades out before the next one.
export const CaptionBlock: React.FC<{
  readonly caption: Caption;
  readonly shotLength: number;
  readonly name: string;
}> = ({ caption, shotLength, name }) => {
  const frame = useCurrentFrame();
  const until = caption.until ?? shotLength;
  const enter = interpolate(frame, [caption.at, caption.at + 10], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.6)),
  });
  const visible = interpolate(
    frame,
    [caption.at, caption.at + 4],
    [0, 1],
    clamp,
  );
  const exit =
    caption.until === null
      ? 1
      : interpolate(frame, [until - 5, until], [1, 0], clamp);

  if (frame < caption.at || frame >= until + 1) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        width: SAFE.iconsRight - SAFE.left,
        bottom: 1920 - SAFE.bottom,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        opacity: visible * exit,
        scale: String(0.85 + 0.15 * enter * exit + 0.15 * (1 - exit) * 0),
        translate: `0px ${(1 - enter) * 24}px`,
      }}
    >
      {caption.lines.map((line, i) => (
        <Interactive.Div
          key={line}
          name={`${name} line ${i + 1}`}
          style={{
            padding: "12px 30px",
            borderRadius: 20,
            backgroundColor: PILL,
            boxShadow: "0 16px 40px rgba(0,0,0,0.22)",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: caption.size,
            lineHeight: 1.2,
            color: WHITE,
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          {parse(line).map((part, j) => (
            <span
              key={`${part.text}-${j}`}
              style={{ color: part.highlight ? MINT : WHITE }}
            >
              {part.text}
            </span>
          ))}
        </Interactive.Div>
      ))}
    </div>
  );
};
