import { Img, staticFile } from "remotion";
import { DISPLAY } from "../fonts";
import { CARD, EMERALD, GOLD, IVORY, LIGHT_BG } from "../theme";
import { ease, gather, impact, lerp, popIn, press, seg } from "./motion";
import {
  B,
  BORDER,
  CENTER,
  GATHER_TO,
  H,
  LANDSCAPE,
  PARKED,
  PORTRAIT,
  W,
  type Pose,
} from "./stage";

type Entry = {
  kind: "drop" | "up" | "right" | "left";
  at: number;
  land: number;
};
type Spec = {
  id: keyof typeof PARKED;
  photo: string;
  back?: string;
  size: { w: number; h: number };
  enter: Entry;
  rot: number;
  out: number | null;
  tag?: string;
  backTag?: string;
  gatherIndex: number;
};

// The six photos as five prints, in the order the finger brings them in.
export const PRINTS: Spec[] = [
  {
    id: "hero",
    photo: "p3-hero.png",
    size: PORTRAIT,
    enter: { kind: "drop", at: 0, land: B.hero.land },
    rot: -1.5,
    out: B.hero.out,
    gatherIndex: 0,
  },
  {
    id: "prep",
    photo: "p1-prep.png",
    size: PORTRAIT,
    enter: { kind: "up", at: B.prep.in, land: B.prep.land },
    rot: 1.2,
    out: B.prep.out,
    tag: "Préparation",
    gatherIndex: 1,
  },
  {
    id: "flip",
    photo: "p2-before.png",
    back: "p6-after.png",
    size: LANDSCAPE,
    enter: { kind: "up", at: B.before.in, land: B.before.land },
    rot: 1,
    out: B.after.out,
    tag: "Avant",
    backTag: "Après",
    gatherIndex: 2,
  },
  {
    id: "closeup",
    photo: "p4-closeup.png",
    size: PORTRAIT,
    enter: { kind: "right", at: B.closeup.in, land: B.closeup.land },
    rot: -1,
    out: B.closeup.out,
    gatherIndex: 3,
  },
  {
    id: "pair",
    photo: "p5-pair.png",
    size: PORTRAIT,
    enter: { kind: "left", at: B.pair.in, land: B.pair.land },
    rot: 1.5,
    out: null,
    gatherIndex: 4,
  },
];

const OUT_DUR = 0.45;

// Where a print is at time t: arriving, resting at the centre, pushed to its
// parked pose, or gathering into the mark.
const poseAt = (spec: Spec, t: number) => {
  const k = ease.expoOut(seg(t, spec.enter.at, spec.enter.land));
  let x = CENTER.x;
  let y = CENTER.y;
  let s = 1;
  let op = 1;
  let rot = spec.rot;
  if (spec.enter.kind === "drop") {
    s = lerp(1.1, 1, k);
    y = lerp(CENTER.y - 40, CENTER.y, k);
    op = seg(t, spec.enter.at, spec.enter.at + 0.2);
  } else if (spec.enter.kind === "up") {
    y = lerp(CENTER.y + 1500, CENTER.y, k);
  } else if (spec.enter.kind === "right") {
    x = lerp(CENTER.x + 1400, CENTER.x, k);
    rot = lerp(spec.rot + 6, spec.rot, k);
  } else {
    x = lerp(CENTER.x - 1400, CENTER.x, k);
    rot = lerp(spec.rot - 6, spec.rot, k);
  }
  if (spec.out !== null && t >= spec.out) {
    const parked: Pose = PARKED[spec.id];
    const ko = ease.expoInOut(seg(t, spec.out, spec.out + OUT_DUR));
    x = lerp(x, parked.x, ko);
    y = lerp(y, parked.y, ko);
    s = lerp(s, parked.s, ko);
    rot = lerp(rot, parked.rot, ko);
  }
  const g = gather(
    t,
    B.gather[0],
    B.gather[1],
    spec.gatherIndex,
    PRINTS.length,
    { x, y },
    GATHER_TO,
    { stagger: 0.07, arc: 120 },
  );
  return { x: g.x, y: g.y, s: s * g.s, rot: lerp(rot, 0, g.k), op: op * g.op };
};

const Tag: React.FC<{
  readonly t: number;
  readonly at: number;
  readonly text: string;
}> = ({ t, at, text }) => {
  const p = popIn(t, at, { s0: 0.6, rise: 14 });
  if (t < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: BORDER + 26,
        bottom: BORDER + 26,
        padding: "10px 22px",
        borderRadius: 999,
        background: IVORY,
        border: `1px solid ${GOLD}`,
        color: EMERALD,
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: 26,
        letterSpacing: "0.14em",
        whiteSpace: "nowrap",
        opacity: p.op,
        transform: `translateY(${p.dy}px) scale(${p.s})`,
        transformOrigin: "left bottom",
      }}
    >
      {text}
    </div>
  );
};

const Face: React.FC<{
  readonly photo: string;
  readonly size: { w: number; h: number };
  readonly children?: React.ReactNode;
  readonly extra?: React.CSSProperties;
}> = ({ photo, size, children, extra }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: size.w,
      height: size.h,
      boxSizing: "border-box",
      background: CARD,
      padding: BORDER,
      boxShadow:
        "0 30px 70px rgba(29,33,31,0.18), 0 2px 6px rgba(29,33,31,0.08)",
      backfaceVisibility: "hidden",
      ...extra,
    }}
  >
    <Img
      src={staticFile(`photos/${photo}`)}
      style={{
        display: "block",
        width: size.w - 2 * BORDER,
        height: size.h - 2 * BORDER,
        objectFit: "cover",
      }}
    />
    {children}
  </div>
);

const Print: React.FC<{ readonly spec: Spec; readonly t: number }> = ({
  spec,
  t,
}) => {
  if (t < spec.enter.at) return null;
  const pose = poseAt(spec, t);
  if (pose.op <= 0) return null;
  const land = impact(t, spec.enter.land, {
    amount: 0.05,
    decay: 9,
    omega: 22,
  });
  const flipK = spec.back ? ease.expoInOut(seg(t, B.flip[0], B.flip[1])) : 0;
  const flipLand = spec.back
    ? impact(t, B.flip[1], { amount: 0.06, decay: 9, omega: 22 })
    : { sx: 1, sy: 1 };
  const dip = spec.back ? press(t, B.flip[0], { depth: 0.025 }).s : 1;
  const outDip = spec.out === null ? 1 : press(t, spec.out, { depth: 0.02 }).s;
  const { w, h } = spec.size;
  return (
    <div
      style={{
        position: "absolute",
        left: pose.x - w / 2,
        top: pose.y - h / 2,
        width: w,
        height: h,
        opacity: pose.op,
        transform: `rotate(${pose.rot}deg) scale(${pose.s * land.sx * flipLand.sx * dip * outDip}, ${pose.s * land.sy * flipLand.sy * dip * outDip})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: spec.back
            ? `perspective(2200px) rotateY(${180 * flipK}deg)`
            : undefined,
        }}
      >
        <Face photo={spec.photo} size={spec.size}>
          {spec.tag ? (
            <Tag t={t} at={spec.enter.land + 0.25} text={spec.tag} />
          ) : null}
        </Face>
        {spec.back ? (
          <Face
            photo={spec.back}
            size={spec.size}
            extra={{ transform: "rotateY(180deg)" }}
          >
            {spec.backTag ? (
              <Tag t={t} at={B.flip[1] + 0.2} text={spec.backTag} />
            ) : null}
          </Face>
        ) : null}
      </div>
    </div>
  );
};

// The table: an ivory ground that extends past the frame for the pull-out,
// and the prints in the order they arrive.
export const Prints: React.FC<{ readonly t: number }> = ({ t }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: -700,
        top: -900,
        width: W + 1400,
        height: H + 1800,
        background: LIGHT_BG,
      }}
    />
    {PRINTS.map((spec) => (
      <Print key={spec.id} spec={spec} t={t} />
    ))}
  </>
);
