import { interpolateColors } from "remotion";
import { Logo } from "../components/Brand";
import { MoroccanFlag } from "../components/Flag";
import { CheckIcon } from "../components/Icons";
import { SANS, SERIF } from "../fonts";
import {
  BEIGE,
  BEIGE_DEEP,
  INK,
  MUTED,
  TEAL,
  TEAL_DEEP,
  WHITE,
} from "../theme";
import {
  BURST_BOOKINGS,
  DAYS,
  FIRST_BOOKING,
  HOUR_FROM,
  HOUR_TO,
  PICK_DAY,
  PICK_SERVICE,
  PICK_SLOT,
  SERVICES,
  SLOTS,
  type Booking,
} from "./data";
import {
  ease,
  fr,
  gather,
  hop,
  impact,
  iris,
  lerp,
  liftOut,
  morphRect,
  popIn,
  press,
  roll,
  seg,
  typeOn,
  wordRise,
} from "./motion";
import {
  AXIS,
  B,
  BADGE,
  BAR_RECT,
  BUTTON_H,
  BUTTON_TOP,
  CARD,
  CARD_LEFT,
  CHECK_HOME,
  CHECK_SIZE,
  CHIP,
  CONTENT_LEFT,
  CONTENT_W,
  DAYS_H,
  DAYS_TOP,
  GHOST,
  GRID,
  H,
  HAND_KNOTS,
  HEADER_TOP,
  LABEL_Y,
  LOGO,
  PAD,
  PILL_W,
  ROW_H,
  ROW_TOP,
  SLOTS_H,
  SLOTS_TITLE_Y,
  SLOTS_TOP,
  TITLE_Y,
  TWELVE,
  W,
  ZERO,
  cellCenter,
  cellX,
  cellY,
  pillCenterX,
} from "./stage";
import { BigNumber } from "./Night";

const PAGE = "#fffdfa";
const URL = "mysalon.ma/s/sara-nails";
const TAP = HAND_KNOTS[1];
const TONES = ["#dff1ea", "#f3e6d8", "#e6e9f5"];

// Progress of the chip becoming the page card.
const cardK = (t: number) => ease.expoInOut(seg(t, B.card[0], B.card[1]));

const centred = (x: number, y: number): React.CSSProperties => ({
  position: "absolute",
  left: x,
  top: y,
  transform: "translate(-50%, -50%)",
  whiteSpace: "nowrap",
});

// The line the number collapsed into, which widens into the link chip and
// then grows into the booking page.
const Container: React.FC<{ readonly t: number }> = ({ t }) => {
  if (t < B.chip[0] - 0.12) return null;
  const rect =
    t < B.card[0]
      ? morphRect(t, B.chip[0], B.chip[1], BAR_RECT, CHIP)
      : morphRect(t, B.card[0], B.card[1], CHIP, CARD);
  const k2 = cardK(t);
  const dip = press(t, B.tapChip, { depth: 0.05 }).s;
  const land = impact(t, B.card[1], { amount: 0.04 });
  const base: React.CSSProperties = {
    position: "absolute",
    left: rect.x - rect.w / 2,
    top: rect.y - rect.h / 2,
    width: rect.w,
    height: rect.h,
    borderRadius: rect.r,
    transform: `scale(${dip * land.sx}, ${dip * land.sy})`,
  };
  return (
    <>
      <div style={{ ...base, background: TEAL, opacity: 1 - k2 }} />
      <div
        style={{
          ...base,
          background: PAGE,
          opacity: k2,
          boxShadow:
            "0 24px 60px rgba(31,41,38,0.14), 0 2px 0 rgba(31,41,38,0.04)",
        }}
      />
    </>
  );
};

// The link, typed into the chip, then shrinking into the page's address.
const ChipText: React.FC<{ readonly t: number }> = ({ t }) => {
  if (t < B.typeFrom) return null;
  const k2 = cardK(t);
  const typed = typeOn(t, B.typeFrom, URL, 30);
  return (
    <div
      style={{
        position: "absolute",
        left: lerp(CHIP.x, CARD_LEFT + CARD.w - PAD, k2),
        top: lerp(CHIP.y, HEADER_TOP + 24, k2),
        transform: `translate(${-50 - 50 * k2}%, -50%)`,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: lerp(30, 20, k2),
        letterSpacing: "0.01em",
        color: interpolateColors(k2, [0, 1], [WHITE, TEAL]),
        whiteSpace: "nowrap",
      }}
    >
      {typed.str}
      {typed.caret && k2 === 0 ? <span style={{ opacity: 0.9 }}>|</span> : null}
    </div>
  );
};

// Sara's bio above the link, which becomes the page header.
const Bio: React.FC<{ readonly t: number }> = ({ t }) => {
  if (t < B.bio) return null;
  const k2 = cardK(t);
  const a = popIn(t, B.bio, { rise: 18 });
  const n = popIn(t, B.bio + 0.08, { rise: 18 });
  const l = popIn(t, B.bio + 0.16, { rise: 18 });
  const left = lerp(AXIS, CONTENT_LEFT + 72, k2);
  return (
    <>
      <div
        style={{
          ...centred(
            lerp(AXIS, CONTENT_LEFT + 28, k2),
            lerp(560, HEADER_TOP + 50, k2) + a.dy,
          ),
          transform: `translate(-50%, -50%) scale(${a.s})`,
          opacity: a.op,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: TEAL,
          color: WHITE,
          fontFamily: SERIF,
          fontWeight: 700,
          fontSize: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        S
      </div>
      <div
        style={{
          position: "absolute",
          left,
          top: lerp(630, HEADER_TOP + 36, k2) + n.dy,
          transform: `translate(${-50 * (1 - k2)}%, -50%) scale(${n.s})`,
          opacity: n.op,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: lerp(34, 30, k2),
          color: INK,
          whiteSpace: "nowrap",
        }}
      >
        Sara Nails
      </div>
      <div
        style={{
          position: "absolute",
          left,
          top: lerp(672, HEADER_TOP + 70, k2) + l.dy,
          transform: `translate(${-50 * (1 - k2)}%, -50%) scale(${l.s})`,
          opacity: l.op,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: lerp(24, 22, k2),
          color: MUTED,
          whiteSpace: "nowrap",
        }}
      >
        Nail artist · Témara
      </div>
    </>
  );
};

const SectionTitle: React.FC<{
  readonly y: number;
  readonly children: React.ReactNode;
}> = ({ y, children }) => (
  <div
    style={{
      position: "absolute",
      left: CONTENT_LEFT,
      top: y,
      transform: "translateY(-50%)",
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 20,
      letterSpacing: "0.14em",
      color: MUTED,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

// Step 1: the services. Slides out to the left when the time step comes in.
const Services: React.FC<{ readonly t: number }> = ({ t }) => {
  const from = B.card[1] - 0.15;
  if (t < from || t > B.step2 + 0.5) return null;
  const slide = ease.expoInOut(seg(t, B.step2, B.step2 + 0.45));
  const op =
    seg(t, from, from + 0.25) * (1 - seg(t, B.step2 + 0.1, B.step2 + 0.4));
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: op,
        transform: `translateX(${-820 * slide}px)`,
      }}
    >
      <SectionTitle y={TITLE_Y}>CHOISIS TA PRESTATION</SectionTitle>
      {SERVICES.map((s, i) => {
        const picked = i === PICK_SERVICE && t >= B.tapService;
        const dip =
          i === PICK_SERVICE ? press(t, B.tapService, { depth: 0.03 }).s : 1;
        const check = popIn(t, B.tapService, { s0: 0.4 });
        return (
          <div
            key={s.name}
            style={{
              position: "absolute",
              left: CONTENT_LEFT,
              top: ROW_TOP + i * ROW_H,
              width: CONTENT_W,
              height: ROW_H - 12,
              boxSizing: "border-box",
              borderRadius: 20,
              background: picked ? "#e4f6ee" : BEIGE,
              border: `3px solid ${picked ? TEAL : "transparent"}`,
              transform: `scale(${dip})`,
              display: "flex",
              alignItems: "center",
              padding: "0 22px 0 26px",
              gap: 18,
              fontFamily: SANS,
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 30, color: INK }}>
                {s.name}
              </span>
              <span style={{ fontWeight: 500, fontSize: 22, color: MUTED }}>
                {s.duration}
              </span>
            </div>
            <span style={{ fontWeight: 700, fontSize: 28, color: TEAL }}>
              {s.price}
            </span>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                boxSizing: "border-box",
                border: `3px solid ${picked ? TEAL : "#cfc6bb"}`,
                background: picked ? TEAL : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {picked ? (
                <div
                  style={{ transform: `scale(${check.s})`, opacity: check.op }}
                >
                  <CheckIcon size={20} color={WHITE} />
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: CONTENT_LEFT,
          width: CONTENT_W,
          top: ROW_TOP + 3 * ROW_H + 24,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 22,
          color: MUTED,
        }}
      >
        Paiement au salon · annulation gratuite
      </div>
    </div>
  );
};

const Pill: React.FC<{
  readonly x: number;
  readonly top: number;
  readonly h: number;
  readonly on: boolean;
  readonly dip: number;
  readonly children: React.ReactNode;
}> = ({ x, top, h, on, dip, children }) => (
  <div
    style={{
      position: "absolute",
      left: x - PILL_W / 2,
      top,
      width: PILL_W,
      height: h,
      borderRadius: 20,
      background: on ? TEAL : BEIGE,
      color: on ? WHITE : INK,
      transform: `scale(${dip})`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: SANS,
      lineHeight: 1.05,
    }}
  >
    {children}
  </div>
);

// Step 2: the day and the hour. Slides in from the right.
const When: React.FC<{ readonly t: number }> = ({ t }) => {
  if (t < B.step2 || t > B.confirmed + 0.25) return null;
  const slide = 1 - ease.expoInOut(seg(t, B.step2, B.step2 + 0.45));
  const op =
    seg(t, B.step2 + 0.05, B.step2 + 0.3) *
    (1 - seg(t, B.confirmed, B.confirmed + 0.2));
  const s = SERVICES[PICK_SERVICE];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: op,
        transform: `translateX(${820 * slide}px)`,
      }}
    >
      <SectionTitle y={TITLE_Y}>{fr("QUAND ?")}</SectionTitle>
      {DAYS.map((d, i) => (
        <Pill
          key={d.label}
          x={pillCenterX(i)}
          top={DAYS_TOP}
          h={DAYS_H}
          on={i === PICK_DAY && t >= B.tapDay}
          dip={i === PICK_DAY ? press(t, B.tapDay, { depth: 0.05 }).s : 1}
        >
          <span style={{ fontWeight: 600, fontSize: 22, opacity: 0.8 }}>
            {d.label}
          </span>
          <span style={{ fontWeight: 700, fontSize: 36 }}>{d.n}</span>
        </Pill>
      ))}
      <SectionTitle y={SLOTS_TITLE_Y}>HEURE</SectionTitle>
      {SLOTS.map((slot, i) => (
        <Pill
          key={slot}
          x={pillCenterX(i)}
          top={SLOTS_TOP}
          h={SLOTS_H}
          on={i === PICK_SLOT && t >= B.tapSlot}
          dip={i === PICK_SLOT ? press(t, B.tapSlot, { depth: 0.05 }).s : 1}
        >
          <span style={{ fontWeight: 600, fontSize: 28 }}>{slot}</span>
        </Pill>
      ))}
      <div
        style={{
          position: "absolute",
          left: CONTENT_LEFT,
          width: CONTENT_W,
          top: SLOTS_TOP + SLOTS_H + 40,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 24,
          color: MUTED,
        }}
      >
        {s.name} · {s.duration} · {s.price}
      </div>
    </div>
  );
};

const Button: React.FC<{ readonly t: number }> = ({ t }) => {
  const from = B.card[1] - 0.15;
  if (t < from || t > B.confirmed + 0.25) return null;
  const op =
    seg(t, from, from + 0.25) * (1 - seg(t, B.confirmed, B.confirmed + 0.2));
  const dip = press(t, B.tapConfirm, { depth: 0.04 }).s;
  const label1 = 1 - seg(t, B.step2, B.step2 + 0.25);
  const label2 = seg(t, B.step2 + 0.1, B.step2 + 0.35);
  return (
    <div
      style={{
        position: "absolute",
        left: CONTENT_LEFT,
        top: BUTTON_TOP,
        width: CONTENT_W,
        height: BUTTON_H,
        borderRadius: BUTTON_H / 2,
        background: t >= B.tapConfirm ? TEAL_DEEP : TEAL,
        opacity: op,
        transform: `scale(${dip})`,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 30,
        color: WHITE,
      }}
    >
      <div style={{ ...centred(CONTENT_W / 2, BUTTON_H / 2), opacity: label1 }}>
        Continuer
      </div>
      <div style={{ ...centred(CONTENT_W / 2, BUTTON_H / 2), opacity: label2 }}>
        Confirmer
      </div>
    </div>
  );
};

const RiseLine: React.FC<{
  readonly t: number;
  readonly at: number;
  readonly out?: number;
  readonly x: number;
  readonly y: number;
  readonly style: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ t, at, out, x, y, style, children }) => {
  if (t < at) return null;
  const w = wordRise(t, at);
  const o =
    out === undefined ? { op: 1, dy: 0, s: 1, gone: false } : liftOut(t, out);
  if (o.gone) return null;
  return (
    <div
      style={{
        ...centred(x, y),
        transform: `translate(-50%, -50%) translateY(${w.y + o.dy}px) scale(${w.s * o.s})`,
        opacity: w.op * o.op,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// The confirmation's three lines; the check is its own element (it hops).
const Confirmation: React.FC<{ readonly t: number }> = ({ t }) => {
  if (t < B.confirmed || t > B.hop[0] + 0.35) return null;
  const c = B.confirmed;
  return (
    <>
      <RiseLine
        t={t}
        at={c + 0.15}
        out={B.hop[0]}
        x={AXIS}
        y={962}
        style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 54, color: INK }}
      >
        C'est réservé.
      </RiseLine>
      <RiseLine
        t={t}
        at={c + 0.3}
        out={B.hop[0]}
        x={AXIS}
        y={1042}
        style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, color: INK }}
      >
        Nada · Manucure russe
      </RiseLine>
      <RiseLine
        t={t}
        at={c + 0.4}
        out={B.hop[0]}
        x={AXIS}
        y={1094}
        style={{
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 28,
          color: MUTED,
        }}
      >
        Samedi 18 octobre · 11:00
      </RiseLine>
    </>
  );
};

const CORNER = {
  x: cellX(FIRST_BOOKING.day) + GRID.colW - 4 - 18,
  y: cellY(FIRST_BOOKING.start) + 4 + 18,
};

// The check: pops on the confirmation, hops into Saturday 11:00, and settles
// as the tick in the corner of Nada's block.
const Check: React.FC<{ readonly t: number }> = ({ t }) => {
  if (t < B.confirmed) return null;
  const cell = cellCenter(
    FIRST_BOOKING.day,
    FIRST_BOOKING.start,
    FIRST_BOOKING.hours,
  );
  const born = popIn(t, B.confirmed, { s0: 0.5, zeta: 0.5, omega: 18 });
  const landA = impact(t, B.confirmed, { amount: 0.14 });
  const landB = impact(t, B.hop[1], { amount: 0.2, decay: 10 });
  let x = CHECK_HOME.x;
  let y = CHECK_HOME.y;
  let size = CHECK_SIZE;
  let k3 = 0;
  if (t >= B.hop[0]) {
    const h = hop(t, B.hop[0], B.hop[1], CHECK_HOME, cell, 240);
    x = h.x;
    y = h.y;
    size = lerp(CHECK_SIZE, 64, ease.sineInOut(h.k));
  }
  if (t >= B.hop[1]) {
    k3 = ease.expoInOut(seg(t, B.hop[1], B.hop[1] + 0.3));
    x = lerp(cell.x, CORNER.x, k3);
    y = lerp(cell.y, CORNER.y, k3);
    size = lerp(64, 24, k3);
  }
  return (
    <div
      style={{
        ...centred(x, y),
        width: size,
        height: size,
        borderRadius: "50%",
        background: interpolateColors(k3, [0, 1], [TEAL, WHITE]),
        boxShadow:
          k3 < 1
            ? `0 ${12 * (1 - k3)}px ${30 * (1 - k3)}px rgba(15,92,87,0.28)`
            : undefined,
        transform: `translate(-50%, -50%) scale(${born.s * landA.sx * landB.sx}, ${born.s * landA.sy * landB.sy})`,
        opacity: born.op,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CheckIcon
        size={size * 0.58}
        color={interpolateColors(k3, [0, 1], [WHITE, TEAL])}
      />
    </div>
  );
};

const Block: React.FC<{
  readonly t: number;
  readonly at: number;
  readonly b: Booking;
  readonly tone: string;
  readonly highlight: boolean;
}> = ({ t, at, b, tone, highlight }) => {
  if (t < at) return null;
  const p = popIn(t, at, { s0: 0.6, zeta: 0.55, omega: 22 });
  const land = impact(t, at, { amount: 0.12 });
  return (
    <div
      style={{
        position: "absolute",
        left: cellX(b.day) + 4,
        top: cellY(b.start) + 4,
        width: GRID.colW - 8,
        height: b.hours * GRID.rowH - 8,
        boxSizing: "border-box",
        borderRadius: 14,
        background: highlight ? TEAL : tone,
        color: highlight ? WHITE : INK,
        padding: "10px 12px",
        opacity: p.op,
        transform: `scale(${p.s * land.sx}, ${p.s * land.sy})`,
        fontFamily: SANS,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        overflow: "hidden",
      }}
    >
      <span style={{ fontWeight: 700, fontSize: 22, whiteSpace: "nowrap" }}>
        {b.client}
      </span>
      <span
        style={{
          fontWeight: 500,
          fontSize: 18,
          opacity: 0.82,
          whiteSpace: "nowrap",
        }}
      >
        {b.service}
      </span>
    </div>
  );
};

const bookingsCount = (t: number) =>
  (t >= B.hop[1] ? 1 : 0) + B.burst.filter((x) => x <= t).length;

// The week: the grid grows out of the page, the check lands in it, eleven
// more blocks burst in on the music.
const Agenda: React.FC<{ readonly t: number }> = ({ t }) => {
  const from = B.hop[0] + 0.1;
  if (t < from) return null;
  const op = seg(t, from, from + 0.4);
  const count = bookingsCount(t);
  const lastInc =
    count === 0 ? -1 : count === 1 ? B.hop[1] : B.burst[count - 2];
  const badgeIn = popIn(t, B.hop[1], { s0: 0.5 });
  const badgeHit = impact(t, lastInc, { amount: 0.12, decay: 12 });
  const badgeOp = 1 - seg(t, B.result[0], B.result[0] + 0.15);
  const gridRight = CONTENT_LEFT + CONTENT_W;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: op }}>
      <div
        style={{
          position: "absolute",
          left: CONTENT_LEFT,
          top: GRID.titleY,
          transform: "translateY(-50%)",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 26,
          color: INK,
          whiteSpace: "nowrap",
        }}
      >
        Semaine du 16 au 19 oct.
      </div>
      {count > 0 ? (
        <div
          style={{
            position: "absolute",
            left: BADGE.right - BADGE.w,
            top: BADGE.y - BADGE.h / 2,
            width: BADGE.w,
            height: BADGE.h,
            borderRadius: BADGE.h / 2,
            background: TEAL,
            color: WHITE,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: badgeIn.op * badgeOp,
            transform: `scale(${badgeIn.s * badgeHit.sx}, ${badgeIn.s * badgeHit.sy})`,
            whiteSpace: "nowrap",
          }}
        >
          {count} RDV
        </div>
      ) : null}
      {DAYS.map((d, i) => (
        <div
          key={d.label}
          style={{
            ...centred(
              cellX(i) + GRID.colW / 2,
              GRID.dayRowTop + GRID.dayRowH / 2,
            ),
            fontFamily: SANS,
            fontSize: 22,
            color: INK,
          }}
        >
          <span style={{ fontWeight: 500, color: MUTED }}>{d.label} </span>
          <span style={{ fontWeight: 700 }}>{d.n}</span>
        </div>
      ))}
      {Array.from(
        { length: HOUR_TO - HOUR_FROM + 1 },
        (_, i) => HOUR_FROM + i,
      ).map((h) => (
        <div key={h}>
          <div
            style={{
              position: "absolute",
              left: CONTENT_LEFT,
              width: CONTENT_W,
              top: cellY(h),
              height: 1,
              background: BEIGE_DEEP,
            }}
          />
          {h < HOUR_TO ? (
            <div
              style={{
                position: "absolute",
                left: CONTENT_LEFT,
                top: cellY(h) + 8,
                fontFamily: SANS,
                fontWeight: 500,
                fontSize: 18,
                color: MUTED,
              }}
            >
              {h}h
            </div>
          ) : null}
        </div>
      ))}
      {[0, 1, 2, 3, 4].map((d) => (
        <div
          key={d}
          style={{
            position: "absolute",
            left: Math.min(cellX(d), gridRight) - (d === 4 ? 1 : 0),
            top: GRID.top,
            width: 1,
            height: cellY(HOUR_TO) - GRID.top,
            background: BEIGE_DEEP,
            opacity: 0.7,
          }}
        />
      ))}
      <Block t={t} at={B.hop[1]} b={FIRST_BOOKING} tone={TEAL} highlight />
      {BURST_BOOKINGS.map((b, i) => (
        <Block
          key={b.client}
          t={t}
          at={B.burst[i]}
          b={b}
          tone={TONES[i % TONES.length]}
          highlight={false}
        />
      ))}
    </div>
  );
};

// The page group: shrinks to a ghost under the result, then gathers into
// the lockup with the two numbers.
const Page: React.FC<{ readonly t: number }> = ({ t }) => {
  const kr = ease.expoInOut(seg(t, B.result[0], B.result[1]));
  const g = gather(
    t,
    B.gather[0],
    B.gather[1],
    2,
    3,
    { x: GHOST.x, y: GHOST.y },
    LOGO,
  );
  if (g.op <= 0) return null;
  // The result slides the page down to its ghost place; the gather starts
  // from there, so it adds nothing before it begins.
  const tx = g.x - GHOST.x;
  const ty = lerp(0, GHOST.y - CARD.y, kr) + (g.y - GHOST.y);
  const s = lerp(1, GHOST.s, kr) * g.s;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transformOrigin: `${CARD.x}px ${CARD.y}px`,
        transform: `translate(${tx}px, ${ty}px) scale(${s})`,
        opacity: lerp(1, 0.45, kr) * g.op,
      }}
    >
      <Container t={t} />
      <Services t={t} />
      <When t={t} />
      <Button t={t} />
      <Bio t={t} />
      <ChipText t={t} />
      <Agenda t={t} />
      <Confirmation t={t} />
      <Check t={t} />
    </div>
  );
};

const Stat: React.FC<{
  readonly t: number;
  readonly i: number;
  readonly x: number;
  readonly children: React.ReactNode;
}> = ({ t, i, x, children }) => {
  const g = gather(t, B.gather[0], B.gather[1], i, 3, { x, y: 760 }, LOGO);
  if (g.op <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transformOrigin: `${x}px 760px`,
        transform: `translate(${g.x - x}px, ${g.y - 760}px) scale(${g.s})`,
        opacity: g.op,
      }}
    >
      {children}
    </div>
  );
};

const BIG: React.CSSProperties = {
  fontFamily: SERIF,
  fontWeight: 900,
  fontSize: 300,
  lineHeight: 1,
  letterSpacing: "-0.03em",
};
const LABEL: React.CSSProperties = {
  fontFamily: SERIF,
  fontStyle: "italic",
  fontWeight: 500,
  fontSize: 40,
  color: MUTED,
};

// The result: the night's number rolls down to zero while the badge grows
// into the week's twelve.
const Result: React.FC<{ readonly t: number }> = ({ t }) => {
  if (t < B.result[0]) return null;
  const kr = ease.expoInOut(seg(t, B.result[0], B.result[1]));
  const zero = popIn(t, B.result[0], { s0: 0.8 });
  const value = roll(t, B.result[0], B.result[0] + 0.9, 47, 0);
  const badge = { x: BADGE.right - BADGE.w / 2, y: BADGE.y };
  return (
    <>
      <Stat t={t} i={0} x={ZERO.x}>
        <div
          style={{
            ...centred(ZERO.x, ZERO.y),
            transform: `translate(-50%, -50%) scale(${zero.s})`,
            opacity: zero.op,
            ...BIG,
            color: TEAL_DEEP,
          }}
        >
          {value}
        </div>
        <RiseLine
          t={t}
          at={B.result[0] + 0.5}
          x={ZERO.x}
          y={LABEL_Y}
          style={LABEL}
        >
          DM ce soir
        </RiseLine>
      </Stat>
      <Stat t={t} i={1} x={TWELVE.x}>
        <div
          style={{
            ...centred(
              lerp(badge.x, TWELVE.x, kr),
              lerp(badge.y, TWELVE.y, kr),
            ),
            transform: `translate(-50%, -50%) scale(${lerp(0.12, 1, kr)})`,
            opacity: seg(t, B.result[0], B.result[0] + 0.1),
            ...BIG,
            color: TEAL,
          }}
        >
          12
        </div>
        <RiseLine
          t={t}
          at={B.result[0] + 0.65}
          x={TWELVE.x}
          y={LABEL_Y}
          style={LABEL}
        >
          RDV cette semaine
        </RiseLine>
      </Stat>
    </>
  );
};

// The lockup and the one call to action.
const Lockup: React.FC<{ readonly t: number }> = ({ t }) => {
  if (t < B.logo) return null;
  const logo = popIn(t, B.logo, { s0: 0.7, zeta: 0.55, omega: 20 });
  const hit = impact(t, B.logo, { amount: 0.14 });
  const pill = popIn(t, B.pill, { s0: 0.8, zeta: 0.6, omega: 20 });
  const pillHit = impact(t, B.pill, { amount: 0.1 });
  const footOp = seg(t, B.foot, B.foot + 0.4);
  const line: React.CSSProperties = {
    fontFamily: SERIF,
    fontWeight: 700,
    fontSize: 56,
    color: INK,
  };
  return (
    <>
      <div
        style={{
          ...centred(LOGO.x, LOGO.y),
          transform: `translate(-50%, -50%) scale(${logo.s * hit.sx}, ${logo.s * hit.sy})`,
          opacity: logo.op,
        }}
      >
        <Logo size={96} color={INK} accent={TEAL} starColor={TEAL} />
      </div>
      <RiseLine t={t} at={B.tagline} x={AXIS} y={880} style={line}>
        Tes DM <span style={{ color: TEAL }}>se vident.</span>
      </RiseLine>
      <RiseLine t={t} at={B.tagline + 0.14} x={AXIS} y={952} style={line}>
        Ton agenda <span style={{ color: TEAL }}>se remplit.</span>
      </RiseLine>
      <RiseLine
        t={t}
        at={B.lead}
        x={AXIS}
        y={1074}
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 32,
          color: MUTED,
        }}
      >
        {fr("Un dernier DM :")}
      </RiseLine>
      {t >= B.pill ? (
        <div
          style={{
            ...centred(AXIS, 1162),
            width: 560,
            height: 112,
            borderRadius: 56,
            background: TEAL,
            color: WHITE,
            transform: `translate(-50%, -50%) scale(${pill.s * pillHit.sx}, ${pill.s * pillHit.sy})`,
            opacity: pill.op,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 58,
            letterSpacing: "0.1em",
            paddingLeft: "0.1em",
          }}
        >
          INVITATION
        </div>
      ) : null}
      <RiseLine
        t={t}
        at={B.site}
        x={AXIS}
        y={1266}
        style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, color: TEAL }}
      >
        mysalon.ma
      </RiseLine>
      {footOp > 0 ? (
        <div
          style={{
            ...centred(AXIS, 1400),
            opacity: footOp,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 26,
            color: MUTED,
          }}
        >
          <span>Fait au Maroc</span>
          <MoroccanFlag height={26} />
          <span>· 0 commission</span>
        </div>
      ) : null}
    </>
  );
};

// The day world, opened by the iris from the fingertip.
export const Day: React.FC<{ readonly t: number }> = ({ t }) => {
  if (t < B.iris[0]) return null;
  const ir = iris(t, B.iris[0], B.iris[1], TAP.x, TAP.y, W, H);
  const margin = 200;
  return (
    <div
      style={{
        position: "absolute",
        left: -margin,
        top: -margin,
        width: W + 2 * margin,
        height: H + 2 * margin,
        clipPath: ir.covered
          ? undefined
          : `circle(${ir.r}px at ${TAP.x + margin}px ${TAP.y + margin}px)`,
        background: `radial-gradient(ellipse 70% 45% at 50% 35%, #fbf7f2 0%, ${BEIGE} 60%, #efe4d8 100%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: margin,
          top: margin,
          width: W,
          height: H,
        }}
      >
        <BigNumber t={t} color={TEAL} />
        <Page t={t} />
        <Result t={t} />
        <Lockup t={t} />
      </div>
    </div>
  );
};
