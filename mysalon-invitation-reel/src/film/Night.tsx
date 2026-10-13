import { SANS, SERIF } from "../fonts";
import { MINT } from "../theme";
import { BUBBLES } from "./data";
import {
  ease,
  fr,
  impact,
  lerp,
  maskRise,
  popIn,
  seg,
  spring,
  wordRise,
} from "./motion";
import { B, H, NUMBER, STACK, W, landedCount, lastLanding } from "./stage";

const NIGHT = "#061a18";
const NIGHT_HI = "#0d2d2a";
const PAPER = "#f4fbf8";

// The big number's geometry, shared by its night and day copies: it counts
// the landings, squashes on each one, takes the tap, then collapses into a
// line that the day world picks up as the link.
export const numberState = (t: number) => {
  const count = landedCount(t);
  const last = lastLanding(t);
  const inTorrent = last > 2.4 && last < B.hit47;
  const land = impact(t, last, {
    amount: last >= B.hit47 ? 0.17 : inTorrent ? 0.05 : 0.12,
    decay: inTorrent ? 14 : 9,
  });
  const tap = impact(t, B.tap47, { amount: 0.22, decay: 10, omega: 26 });
  const born = popIn(t, B.landings[0], { s0: 0.6, zeta: 0.5, omega: 20 });
  const k = ease.expoInOut(seg(t, B.collapse[0], B.collapse[1]));
  return {
    count,
    sx: land.sx * tap.sx * born.s * lerp(1, 0.85, k),
    sy: land.sy * tap.sy * born.s * lerp(1, 0.03, k),
    visible: count > 0 && t < B.collapse[1],
  };
};

export const BigNumber: React.FC<{
  readonly t: number;
  readonly color: string;
}> = ({ t, color }) => {
  const s = numberState(t);
  if (!s.visible) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: NUMBER.x,
        top: NUMBER.y,
        transform: `translate(-50%, -50%) scale(${s.sx}, ${s.sy})`,
        fontFamily: SERIF,
        fontWeight: 900,
        fontSize: 560,
        lineHeight: 1,
        letterSpacing: "-0.03em",
        color,
        whiteSpace: "nowrap",
      }}
    >
      {s.count}
    </div>
  );
};

// 47 DMs arrive from the right into the top slot; each one pushes the stack
// down. At 6.0 s the whole stack sinks away under the number.
const Bubbles: React.FC<{ readonly t: number }> = ({ t }) => {
  if (t >= B.sink + 0.85) {
    return null;
  }
  const sinkDy = 1150 * ease.expoInOut(seg(t, B.sink, B.sink + 0.75));
  const sinkOp = 1 - seg(t, B.sink + 0.2, B.sink + 0.65);
  const items: React.ReactNode[] = [];
  for (let j = 0; j < B.landings.length; j++) {
    const land = B.landings[j];
    const flight = j < 4 ? 0.42 : 0.3;
    if (t < land - flight) {
      break;
    }
    let pushed = 0;
    for (let i = j + 1; i < B.landings.length; i++) {
      if (B.landings[i] > t) break;
      pushed += spring(t - B.landings[i], 0.78, 26);
    }
    const top = STACK.top + STACK.pitch * pushed + sinkDy;
    if (top > H + 40) {
      continue;
    }
    const k = ease.expoOut(seg(t, land - flight, land));
    const x = lerp(STACK.fromX, STACK.x, k);
    const sq = impact(t, land, { amount: 0.1, decay: 10, omega: 26 });
    const bubble = BUBBLES[j];
    items.push(
      <div
        key={j}
        style={{
          position: "absolute",
          left: x - STACK.w / 2,
          top,
          width: STACK.w,
          height: STACK.h,
          boxSizing: "border-box",
          borderRadius: 26,
          background: "rgba(255,255,255,0.10)",
          border: "1px solid rgba(255,255,255,0.14)",
          padding: "16px 26px",
          opacity: seg(k, 0, 0.3) * sinkOp,
          transform: `scale(${sq.sx}, ${sq.sy})`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 6,
          fontFamily: SANS,
          color: PAPER,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 24, color: MINT }}>
            {bubble.name}
          </span>
          <span style={{ fontWeight: 500, fontSize: 20, opacity: 0.55 }}>
            {bubble.time}
          </span>
        </div>
        <div
          style={{
            fontWeight: 500,
            fontSize: 30,
            opacity: 0.95,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {bubble.text}
        </div>
      </div>,
    );
  }
  return <>{items}</>;
};

const Line: React.FC<{
  readonly t: number;
  readonly at: number;
  readonly y: number;
  readonly children: React.ReactNode;
  readonly style: React.CSSProperties;
}> = ({ t, at, y, children, style }) => {
  if (t < at) return null;
  const w = wordRise(t, at);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        width: W,
        top: y,
        textAlign: "center",
        opacity: w.op,
        transform: `translateY(${w.y}px) scale(${w.s})`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// The night: ground, the torrent of DMs, the number, two lines of type.
export const Night: React.FC<{ readonly t: number }> = ({ t }) => {
  if (t >= B.iris[1]) {
    return null;
  }
  const dm = maskRise(t, B.dmLine);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: -200,
          top: -200,
          width: W + 400,
          height: H + 400,
          background: `radial-gradient(ellipse 70% 45% at 50% 38%, ${NIGHT_HI} 0%, ${NIGHT} 100%)`,
        }}
      />
      <Bubbles t={t} />
      <BigNumber t={t} color={PAPER} />
      {dm.visible ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            width: W,
            top: 985,
            height: 96,
            overflow: "hidden",
            textAlign: "center",
          }}
        >
          <div
            style={{
              transform: `translateY(${dm.y}px)`,
              fontFamily: SERIF,
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: 60,
              lineHeight: "96px",
              color: MINT,
            }}
          >
            DM, un mardi soir.
          </div>
        </div>
      ) : null}
      <Line
        t={t}
        at={B.question}
        y={1150}
        style={{
          fontFamily: SERIF,
          fontWeight: 700,
          fontSize: 78,
          lineHeight: 1.1,
          color: PAPER,
        }}
      >
        Et toi,
      </Line>
      <Line
        t={t}
        at={B.question + 0.14}
        y={1246}
        style={{
          fontFamily: SERIF,
          fontWeight: 700,
          fontSize: 78,
          lineHeight: 1.1,
          color: PAPER,
        }}
      >
        <span style={{ color: MINT }}>combien</span>
        {fr(" ce soir ?")}
      </Line>
    </>
  );
};
