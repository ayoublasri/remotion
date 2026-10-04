import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import { GOLD } from "../theme";
import { Bow } from "./Icons";
import { Star } from "./Overlays";
import { StarPattern } from "./Pattern";

const RIBBON =
  "linear-gradient(90deg, #8f6f2c 0%, #c4a24f 22%, #f3e3b8 50%, #c4a24f 78%, #8f6f2c 100%)";

// Front face of the gift box: deep green with a gold ribbon.
export const BoxBody: React.FC<{
  readonly width: number;
  readonly height: number;
}> = ({ width, height }) => (
  <div
    style={{
      position: "relative",
      width,
      height,
      borderRadius: "6px 6px 18px 18px",
      overflow: "hidden",
      background:
        "linear-gradient(100deg, #2a6150 0%, #1f4b3c 45%, #163a2e 100%)",
      boxShadow: "0 50px 80px rgba(15,44,34,0.35)",
    }}
  >
    <StarPattern id="box-body-pattern" color={GOLD} opacity={0.14} size={56} />
    <div
      style={{
        position: "absolute",
        left: width / 2 - 32,
        top: 0,
        width: 64,
        height,
        background: RIBBON,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: 26,
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 100%)",
      }}
    />
  </div>
);

// Lid with the bow on top.
export const BoxLid: React.FC<{
  readonly width: number;
  readonly height: number;
}> = ({ width, height }) => (
  <div style={{ position: "relative", width, height }}>
    <div style={{ position: "absolute", left: width / 2 - 115, top: -112 }}>
      <Bow width={230} id="box-bow" />
    </div>
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 14,
        overflow: "hidden",
        background:
          "linear-gradient(100deg, #2f6a57 0%, #245746 45%, #1a4436 100%)",
        boxShadow:
          "0 18px 30px rgba(15,44,34,0.35), inset 0 2px 0 rgba(255,255,255,0.12)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: width / 2 - 34,
          top: 0,
          width: 68,
          height,
          background: RIBBON,
        }}
      />
    </div>
  </div>
);

// Gold confetti and little stars bursting out of the box from `at`.
export const Burst: React.FC<{
  readonly at: number;
  readonly x: number;
  readonly y: number;
  readonly count: number;
}> = ({ at, x, y, count }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 50) {
    return null;
  }

  return (
    <>
      {new Array(count).fill(true).map((_, i) => {
        const angle = -Math.PI / 2 + (random(`a${i}`) - 0.5) * 2.3;
        const speed = 14 + random(`s${i}`) * 16;
        const drag = interpolate(t, [0, 40], [0, 34], {
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.quad),
        });
        const px = x + Math.cos(angle) * speed * drag;
        const py = y + Math.sin(angle) * speed * drag + 0.11 * t * t;
        const size = 14 + random(`z${i}`) * 22;
        const isStar = i % 3 === 0;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px - size / 2,
              top: py - size / 2,
              width: size,
              height: isStar ? size : size * 0.45,
              borderRadius: isStar ? 0 : 3,
              backgroundColor: isStar
                ? undefined
                : i % 2 === 0
                  ? GOLD
                  : "#f3e3b8",
              rotate: `${t * (6 + random(`r${i}`) * 10) * (i % 2 === 0 ? 1 : -1)}deg`,
              opacity: interpolate(t, [0, 2, 34, 50], [0, 1, 1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              filter: isStar
                ? "drop-shadow(0 0 8px rgba(243,227,184,0.9))"
                : undefined,
            }}
          >
            {isStar ? <Star size={size} color="#f3e3b8" /> : null}
          </div>
        );
      })}
    </>
  );
};
