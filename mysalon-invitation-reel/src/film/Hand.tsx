import { MINT, TEAL } from "../theme";
import { path, press } from "./motion";
import { B, HAND_KNOTS, HAND_SPAN, PRESSES } from "./stage";

// The fingertip: the one visible cause of everything in the day world.
export const Hand: React.FC<{ readonly t: number }> = ({ t }) => {
  if (t < HAND_SPAN[0] || t > HAND_SPAN[1]) {
    return null;
  }
  const p = path(t, HAND_KNOTS);
  let s = 1;
  let ring = 1;
  let ringColor = TEAL;
  for (const tc of PRESSES) {
    const k = press(t, tc);
    s = Math.min(s, k.s);
    if (k.down && k.ring < 1) {
      ring = k.ring;
      ringColor = tc <= B.tap47 ? MINT : TEAL;
    }
  }
  const size = 64;
  return (
    <>
      {ring < 1 ? (
        <div
          style={{
            position: "absolute",
            left: p.x - size / 2,
            top: p.y - size / 2,
            width: size,
            height: size,
            borderRadius: "50%",
            border: `3px solid ${ringColor}`,
            opacity: 1 - ring,
            transform: `scale(${1 + ring * 1.1})`,
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: p.x - size / 2,
          top: p.y - size / 2,
          width: size,
          height: size,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.94)",
          border: "3px solid rgba(10,63,59,0.9)",
          boxShadow: "0 10px 22px rgba(0,0,0,0.28)",
          transform: `scale(${s})`,
        }}
      />
    </>
  );
};
