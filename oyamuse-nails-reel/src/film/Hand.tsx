import { EMERALD, GOLD } from "../theme";
import { path, press } from "./motion";
import { HAND_KNOTS, HAND_SPAN, PRESSES } from "./stage";

// The fingertip that moves every print.
export const Hand: React.FC<{ readonly t: number }> = ({ t }) => {
  if (t < HAND_SPAN[0] || t > HAND_SPAN[1]) {
    return null;
  }
  const p = path(t, HAND_KNOTS);
  let s = 1;
  let ring = 1;
  for (const tc of PRESSES) {
    const k = press(t, tc);
    s = Math.min(s, k.s);
    if (k.down && k.ring < 1) ring = k.ring;
  }
  const size = 64;
  const base: React.CSSProperties = {
    position: "absolute",
    left: p.x - size / 2,
    top: p.y - size / 2,
    width: size,
    height: size,
    borderRadius: "50%",
  };
  return (
    <>
      {ring < 1 ? (
        <div
          style={{
            ...base,
            border: `3px solid ${GOLD}`,
            opacity: 1 - ring,
            transform: `scale(${1 + ring * 1.1})`,
          }}
        />
      ) : null}
      <div
        style={{
          ...base,
          background: "rgba(255,255,255,0.94)",
          border: `3px solid ${EMERALD}`,
          boxShadow: "0 10px 22px rgba(0,0,0,0.25)",
          transform: `scale(${s})`,
        }}
      />
    </>
  );
};
