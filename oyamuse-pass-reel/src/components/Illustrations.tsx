import { Easing, interpolate, useCurrentFrame } from "remotion";
import { DISPLAY, SANS } from "../fonts";
import { CARD, CREAM, GOLD, GREEN, GREEN_DEEP, INK, MUTED } from "../theme";
import { Sfx } from "./Sfx";

const Check: React.FC<{ readonly size: number; readonly color: string }> = ({
  size,
  color,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="3.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block" }}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const TapRing: React.FC<{ readonly at: number }> = ({ at }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 60,
        height: 60,
        marginLeft: -30,
        marginTop: -30,
        borderRadius: 30,
        border: `4px solid ${GOLD}`,
        backgroundColor: "rgba(196,162,79,0.3)",
        pointerEvents: "none",
        scale: interpolate(frame, [at, at + 12], [0.4, 1.5], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.quad),
        }),
        opacity: interpolate(
          frame,
          [at - 1, at, at + 4, at + 12],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        ),
      }}
    />
  );
};

// Step 1: a bank card and a "Pay" button that gets tapped and turns into "Paid".
export const PayIllustration: React.FC<{
  readonly at: number;
  readonly payLabel: string;
  readonly paidLabel: string;
}> = ({ at, payLabel, paidLabel }) => {
  const frame = useCurrentFrame();
  const tapAt = at + 22;
  const paid = frame >= tapAt + 4;

  return (
    <div style={{ position: "relative", width: 280, height: 220 }}>
      <Sfx name="pop" at={tapAt} volume={0.7} />
      <div
        style={{
          position: "absolute",
          left: 16,
          top: 10,
          width: 210,
          height: 132,
          borderRadius: 18,
          background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DEEP} 100%)`,
          boxShadow: "0 18px 36px rgba(31,75,60,0.3)",
          rotate: `${interpolate(frame, [at, at + 18], [-24, -8], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) })}deg`,
          translate: interpolate(
            frame,
            [at, at + 18],
            ["-120px 40px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
          opacity: interpolate(frame, [at, at + 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 18,
            top: 22,
            width: 40,
            height: 30,
            borderRadius: 6,
            backgroundColor: GOLD,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 18,
            bottom: 18,
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: "0.2em",
            color: CREAM,
          }}
        >
          OYA MUSE
        </div>
        <div
          style={{
            position: "absolute",
            right: 18,
            top: 24,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 14,
            color: "rgba(246,239,226,0.7)",
          }}
        >
          •••• 3CHY
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 14,
          height: 66,
          padding: "0 26px",
          borderRadius: 33,
          display: "flex",
          alignItems: "center",
          gap: 10,
          backgroundColor: paid ? GREEN : GOLD,
          color: paid ? CREAM : GREEN_DEEP,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 24,
          boxShadow: "0 14px 30px rgba(0,0,0,0.18)",
          scale: interpolate(frame, [at + 8, at + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 12, stiffness: 180, mass: 0.8 }),
            output: "perceptual-scale",
          }),
        }}
      >
        {paid ? <Check size={26} color={CREAM} /> : null}
        {paid ? paidLabel : payLabel}
        <TapRing at={tapAt} />
      </div>
    </div>
  );
};

// Step 2: a ticket on which the code is typed, then a chime.
export const CodeIllustration: React.FC<{
  readonly at: number;
  readonly code: string;
  readonly label: string;
}> = ({ at, code, label }) => {
  const frame = useCurrentFrame();
  const typeStart = at + 14;
  const perChar = 2;
  const shown = Math.max(
    0,
    Math.min(code.length, Math.floor((frame - typeStart) / perChar)),
  );
  const doneAt = typeStart + code.length * perChar;

  return (
    <div style={{ position: "relative", width: 280, height: 220 }}>
      <Sfx name="ding" at={doneAt} volume={0.7} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 34,
          width: 280,
          height: 150,
          borderRadius: 18,
          backgroundColor: CARD,
          border: `3px dashed ${GOLD}`,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          boxShadow: "0 18px 36px rgba(31,75,60,0.16)",
          rotate: `${interpolate(frame, [at, at + 18], [10, -3], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) })}deg`,
          translate: interpolate(
            frame,
            [at, at + 18],
            ["160px -60px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
          opacity: interpolate(frame, [at, at + 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(
            frame,
            [doneAt, doneAt + 5, doneAt + 14],
            [1, 1.08, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: "0.26em",
            color: MUTED,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: "0.08em",
            color: GREEN,
            whiteSpace: "nowrap",
            minHeight: 36,
          }}
        >
          {code.slice(0, shown)}
          <span
            style={{
              color: GOLD,
              opacity:
                frame < doneAt && Math.floor(frame / 4) % 2 === 0 ? 1 : 0,
            }}
          >
            |
          </span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: -6,
          top: 18,
          width: 46,
          height: 46,
          borderRadius: 23,
          backgroundColor: GOLD,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 24px rgba(0,0,0,0.2)",
          scale: interpolate(frame, [doneAt, doneAt + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 10, stiffness: 190, mass: 0.7 }),
            output: "perceptual-scale",
          }),
        }}
      >
        <Check size={26} color={GREEN_DEEP} />
      </div>
    </div>
  );
};

// Step 3: a mini calendar on which a slot is picked and confirmed.
export const BookIllustration: React.FC<{
  readonly at: number;
  readonly site: string;
  readonly slotLabel: string;
}> = ({ at, site, slotLabel }) => {
  const frame = useCurrentFrame();
  const pickAt = at + 20;
  const confirmAt = at + 30;
  const cells = Array.from({ length: 15 }, (_, i) => i);

  return (
    <div style={{ position: "relative", width: 280, height: 220 }}>
      <Sfx name="pop" at={pickAt} volume={0.5} />
      <Sfx name="success" at={confirmAt} volume={0.7} />
      <div
        style={{
          position: "absolute",
          left: 10,
          top: 8,
          width: 250,
          height: 200,
          borderRadius: 18,
          backgroundColor: CARD,
          overflow: "hidden",
          boxShadow:
            "0 18px 36px rgba(31,75,60,0.16), 0 0 0 1px rgba(196,162,79,0.4)",
          translate: interpolate(
            frame,
            [at, at + 18],
            ["0px 120px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
          opacity: interpolate(frame, [at, at + 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            height: 44,
            backgroundColor: GREEN,
            color: CREAM,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: "0.06em",
          }}
        >
          {site}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 8,
            padding: 14,
          }}
        >
          {cells.map((i) => {
            const picked = i === 8 && frame >= pickAt;
            return (
              <div
                key={i}
                style={{
                  height: 30,
                  borderRadius: 8,
                  backgroundColor: picked
                    ? GOLD
                    : i === 8
                      ? "rgba(196,162,79,0.25)"
                      : "rgba(31,75,60,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 14,
                  color: picked ? GREEN_DEEP : INK,
                  scale: picked
                    ? interpolate(
                        frame,
                        [pickAt, pickAt + 5, pickAt + 12],
                        [1, 1.25, 1],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                      )
                    : 1,
                }}
              >
                {i === 8 ? <TapRing at={pickAt} /> : null}
                {i + 3}
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: -8,
          bottom: 2,
          height: 54,
          padding: "0 18px 0 14px",
          borderRadius: 27,
          backgroundColor: GREEN,
          color: CREAM,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 20,
          boxShadow: "0 14px 30px rgba(0,0,0,0.22)",
          scale: interpolate(frame, [confirmAt, confirmAt + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 11, stiffness: 190, mass: 0.7 }),
            output: "perceptual-scale",
          }),
        }}
      >
        <Check size={22} color={GOLD} />
        {slotLabel}
      </div>
    </div>
  );
};
