import { useCurrentFrame } from "remotion";
import { SANS, SERIF } from "../fonts";
import { INK, MINT } from "../theme";
import { fr, liftOut, seg, wordRise } from "./motion";
import { AXIS, B, FPS } from "./stage";

// The screen layer: not under the camera, not under the shutter. The eyebrow
// that places the night, and three short captions in the day.
const CAPTIONS: { span: [number, number]; text: string }[] = [
  { span: B.caption1 as [number, number], text: "Un seul lien." },
  { span: B.caption2 as [number, number], text: "Nada réserve seule." },
  { span: B.caption3 as [number, number], text: "Sara n'a rien tapé." },
];

export const Screen: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const eyebrowOp = Math.min(
    seg(t, 0, 0.4),
    1 - seg(t, B.tap47, B.tap47 + 0.3),
  );
  return (
    <>
      {eyebrowOp > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 316,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: "0.2em",
            color: MINT,
            opacity: 0.85 * eyebrowOp,
          }}
        >
          SARA · NAIL ARTIST · MARDI 23:14
        </div>
      ) : null}
      {CAPTIONS.map(({ span, text }) => {
        if (t < span[0]) return null;
        const inn = wordRise(t, span[0]);
        const out = liftOut(t, span[1]);
        if (out.gone) return null;
        return (
          <div
            key={text}
            style={{
              position: "absolute",
              left: AXIS - 380,
              width: 760,
              top: 326,
              textAlign: "center",
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 54,
              lineHeight: 1.1,
              color: INK,
              opacity: inn.op * out.op,
              transform: `translateY(${inn.y + out.dy}px) scale(${inn.s * out.s})`,
              whiteSpace: "nowrap",
            }}
          >
            {fr(text)}
          </div>
        );
      })}
    </>
  );
};
