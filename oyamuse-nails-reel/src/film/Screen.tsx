import { useCurrentFrame } from "remotion";
import { LogoBadge } from "../components/Logo";
import { DISPLAY, SANS, SERIF } from "../fonts";
import { EMERALD, GOLD_FOIL, INK, IVORY, MUTED } from "../theme";
import { ease, impact, lerp, popIn, seg, wordRise } from "./motion";
import { B, FPS, GATHER_TO } from "./stage";

// The screen layer, outside the camera: the brand eyebrow that becomes the
// lockup of the call to action, and the lines under it.
const EYEBROW_Y = 322;
const BADGE_FROM = { x: 418, y: EYEBROW_Y, size: 56 };
const NAME_FROM = { x: 575, y: EYEBROW_Y, size: 30 };
const NAME_TO = { x: 540, y: 860, size: 68 };

const Line: React.FC<{
  readonly t: number;
  readonly at: number;
  readonly y: number;
  readonly style: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ t, at, y, style, children }) => {
  if (t < at) return null;
  const w = wordRise(t, at);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        width: 1080,
        top: y,
        textAlign: "center",
        opacity: w.op,
        transform: `translateY(${w.y - 50}%) translateY(${w.y}px) scale(${w.s})`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Screen: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const k = ease.sineInOut(seg(t, B.gather[0] + 0.2, B.logo));
  const eyebrowOp = seg(t, 0.3, 0.8);
  const hit = impact(t, B.logo, { amount: 0.12 });
  const badge = {
    x: lerp(BADGE_FROM.x, GATHER_TO.x, k),
    y: lerp(BADGE_FROM.y, GATHER_TO.y, k),
    size: lerp(BADGE_FROM.size, 180, k),
  };
  const name = {
    x: lerp(NAME_FROM.x, NAME_TO.x, k),
    y: lerp(NAME_FROM.y, NAME_TO.y, k),
    size: lerp(NAME_FROM.size, NAME_TO.size, k),
  };
  const pill = popIn(t, B.cta.pill, { s0: 0.8, zeta: 0.6, omega: 20 });
  const pillHit = impact(t, B.cta.pill, { amount: 0.1 });
  const foot = seg(t, B.cta.foot, B.cta.foot + 0.4);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: badge.x,
          top: badge.y,
          opacity: eyebrowOp,
          transform: `translate(-50%, -50%) scale(${hit.sx}, ${hit.sy})`,
        }}
      >
        <LogoBadge
          image="oya-logo.jpg"
          size={badge.size}
          ring={false}
          ringColor={EMERALD}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: name.x,
          top: name.y,
          opacity: eyebrowOp,
          transform: `translate(-50%, -50%) scale(${hit.sx}, ${hit.sy})`,
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: name.size,
          letterSpacing: "0.22em",
          whiteSpace: "nowrap",
          lineHeight: 1,
          paddingLeft: "0.22em",
        }}
      >
        <span style={{ color: EMERALD, opacity: 1 - k }}>OYA MUSE</span>
        <span
          style={{
            position: "absolute",
            left: "0.22em",
            top: 0,
            opacity: k,
            backgroundImage: GOLD_FOIL,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          OYA MUSE
        </span>
      </div>
      <Line
        t={t}
        at={B.cta.artist}
        y={928}
        style={{
          fontFamily: SERIF,
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 38,
          color: MUTED,
        }}
      >
        Nails by Safae
      </Line>
      <Line
        t={t}
        at={B.cta.line1}
        y={1040}
        style={{
          fontFamily: SERIF,
          fontWeight: 700,
          fontSize: 62,
          color: INK,
          lineHeight: 1,
        }}
      >
        Réserve ton
      </Line>
      <Line
        t={t}
        at={B.cta.line2}
        y={1116}
        style={{
          fontFamily: SERIF,
          fontWeight: 700,
          fontSize: 62,
          color: INK,
          lineHeight: 1,
        }}
      >
        expérience nails
      </Line>
      {t >= B.cta.pill ? (
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 1252,
            width: 500,
            height: 108,
            borderRadius: 54,
            background: EMERALD,
            color: IVORY,
            transform: `translate(-50%, -50%) scale(${pill.s * pillHit.sx}, ${pill.s * pillHit.sy})`,
            opacity: pill.op,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 38,
            letterSpacing: "0.04em",
          }}
        >
          <span>Lien en bio</span>
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke={IVORY}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 4v15" />
            <path d="m5 12 7 7 7-7" />
          </svg>
        </div>
      ) : null}
      {foot > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1080,
            top: 1390,
            textAlign: "center",
            opacity: foot,
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 26,
            letterSpacing: "0.04em",
            color: MUTED,
          }}
        >
          OYA MUSE · Témara · @oyamuse.ma
        </div>
      ) : null}
    </>
  );
};
