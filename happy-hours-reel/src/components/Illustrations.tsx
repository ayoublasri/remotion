import { Easing, interpolate, useCurrentFrame } from "remotion";
import { DISPLAY, SANS } from "../fonts";
import { CARD, CREAM, GOLD, GREEN, GREEN_DEEP, INK, MUTED } from "../theme";
import { StarMark } from "./Brand";
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

// Step 1: a DM thread. The client asks for the pass, a payment button
// appears in the reply and gets tapped: Payer -> Payé.
export const DmPayIllustration: React.FC<{
  readonly at: number;
  readonly message: string;
  readonly payLabel: string;
  readonly paidLabel: string;
}> = ({ at, message, payLabel, paidLabel }) => {
  const frame = useCurrentFrame();
  const tapAt = at + 30;
  const paid = frame >= tapAt + 4;

  return (
    <div style={{ position: "relative", width: 280, height: 220 }}>
      <Sfx name="pop" at={at + 2} volume={0.5} />
      <Sfx name="pop" at={tapAt} volume={0.7} />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 22,
          whiteSpace: "nowrap",
          padding: "12px 18px",
          borderRadius: "22px 22px 6px 22px",
          backgroundColor: GREEN,
          color: CREAM,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 19,
          lineHeight: 1.25,
          boxShadow: "0 12px 26px rgba(31,75,60,0.25)",
          translate: interpolate(
            frame,
            [at, at + 14],
            ["80px 0px", "0px 0px"],
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
        {message}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 96,
          width: 46,
          height: 46,
          borderRadius: 23,
          backgroundColor: GOLD,
          color: GREEN_DEEP,
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: interpolate(frame, [at + 14, at + 26], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 12, stiffness: 180, mass: 0.8 }),
            output: "perceptual-scale",
          }),
        }}
      >
        <StarMark size={26} color={GREEN_DEEP} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 58,
          top: 92,
          width: 200,
          padding: "12px 14px 14px",
          borderRadius: "22px 22px 22px 6px",
          backgroundColor: CARD,
          boxShadow:
            "0 12px 26px rgba(31,75,60,0.16), 0 0 0 1px rgba(196,162,79,0.4)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          translate: interpolate(
            frame,
            [at + 14, at + 28],
            ["-60px 0px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
          opacity: interpolate(frame, [at + 14, at + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 17,
            color: MUTED,
          }}
        >
          Réglez ici :
        </div>
        <div
          style={{
            position: "relative",
            alignSelf: "flex-start",
            height: 48,
            padding: "0 18px",
            borderRadius: 24,
            display: "flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: paid ? GREEN : GOLD,
            color: paid ? CREAM : GREEN_DEEP,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 20,
            boxShadow: "0 10px 22px rgba(0,0,0,0.16)",
          }}
        >
          {paid ? (
            <Check size={22} color={CREAM} />
          ) : (
            <svg
              width="24"
              height="18"
              viewBox="0 0 24 18"
              style={{ display: "block" }}
            >
              <rect
                x="1"
                y="1"
                width="22"
                height="16"
                rx="3"
                fill="none"
                stroke={GREEN_DEEP}
                strokeWidth="2"
              />
              <rect x="1" y="5" width="22" height="3" fill={GREEN_DEEP} />
            </svg>
          )}
          {paid ? paidLabel : payLabel}
          <TapRing at={tapAt} />
        </div>
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
