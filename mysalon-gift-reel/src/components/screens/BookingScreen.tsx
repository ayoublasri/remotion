import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { SANS } from "../../fonts";
import {
  INK,
  MUTED,
  ROSE,
  ROSE_SOFT,
  TEAL,
  TEAL_DEEP,
  TEAL_SOFT,
} from "../../theme";
import { StarMark } from "../Brand";
import { CheckIcon } from "../Icons";
import { LogoBadge } from "../Logo";
import { TapRing } from "../TapRing";

const Label: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 17,
      letterSpacing: "0.16em",
      color: MUTED,
      marginBottom: 10,
    }}
  >
    {children}
  </div>
);

// Step 3: they enter the code on mysalon.ma, at the partner salon, and pick a
// time that suits them.
export const BookingScreen: React.FC<{
  readonly partnerLogo: string;
  readonly partnerName: string;
  readonly partnerInfo: string;
  readonly site: string;
  readonly code: string;
  readonly validLabel: string;
  readonly dates: string[];
  readonly slots: string[];
  readonly slotIndex: number;
  readonly confirmTitle: string;
  readonly confirmDetail: string;
  readonly enterAt: number;
  readonly typeFrom: number;
  readonly typeTo: number;
  readonly slotAt: number;
  readonly confirmAt: number;
}> = ({
  partnerLogo,
  partnerName,
  partnerInfo,
  site,
  code,
  validLabel,
  dates,
  slots,
  slotIndex,
  confirmTitle,
  confirmDetail,
  enterAt,
  typeFrom,
  typeTo,
  slotAt,
  confirmAt,
}) => {
  const frame = useCurrentFrame();
  const typed = Math.floor(
    interpolate(frame, [typeFrom, typeTo], [0, code.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const valid = frame >= typeTo + 2;
  const caretOn = !valid && Math.floor(frame / 8) % 2 === 0;
  const toastAt = confirmAt + 4;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#fdfaf8",
        translate: interpolate(
          frame,
          [enterAt, enterAt + 16],
          ["0px 980px", "0px 0px"],
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
          position: "absolute",
          left: 0,
          right: 0,
          top: 74,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 20,
          color: MUTED,
        }}
      >
        <StarMark size={16} color={TEAL} />
        {site}
      </div>
      <div style={{ position: "absolute", left: 26, right: 26, top: 130 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            paddingBottom: 22,
            borderBottom: "1px solid rgba(15,92,87,0.12)",
          }}
        >
          <LogoBadge
            image={partnerLogo}
            size={76}
            ring={false}
            ringColor={TEAL}
          />
          <div>
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 30,
                color: INK,
              }}
            >
              {partnerName}
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 500,
                fontSize: 19,
                color: MUTED,
              }}
            >
              {partnerInfo}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 26 }}>
          <Label>CODE CADEAU</Label>
          <div
            style={{
              height: 76,
              borderRadius: 20,
              backgroundColor: "#ffffff",
              border: `3px solid ${valid ? TEAL : ROSE_SOFT}`,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 14px 0 22px",
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 30,
              letterSpacing: "0.08em",
              color: INK,
            }}
          >
            <span>
              {code.slice(0, typed)}
              <span
                style={{
                  opacity: caretOn ? 1 : 0,
                  color: ROSE,
                  fontWeight: 500,
                }}
              >
                |
              </span>
            </span>
            {valid ? (
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  backgroundColor: TEAL,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  scale: interpolate(frame, [typeTo + 2, typeTo + 12], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.spring({
                      damping: 10,
                      stiffness: 220,
                      mass: 0.6,
                    }),
                    output: "perceptual-scale",
                  }),
                }}
              >
                <CheckIcon size={26} color="#ffffff" />
              </div>
            ) : null}
          </div>
          <div
            style={{
              marginTop: 12,
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 21,
              color: TEAL,
              opacity: interpolate(frame, [typeTo + 4, typeTo + 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {validLabel}
          </div>
        </div>
        <div style={{ marginTop: 26 }}>
          <Label>DATE</Label>
          <div style={{ display: "flex", flexDirection: "row", gap: 14 }}>
            {dates.map((d, i) => {
              const [day, num] = d.split(" ");
              const selected = i === 1;
              return (
                <div
                  key={d}
                  style={{
                    flex: 1,
                    height: 96,
                    borderRadius: 20,
                    backgroundColor: selected ? TEAL : "#ffffff",
                    boxShadow: selected
                      ? "none"
                      : "0 0 0 1px rgba(15,92,87,0.16)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  <div
                    style={{
                      fontFamily: SANS,
                      fontWeight: 600,
                      fontSize: 19,
                      color: selected ? TEAL_SOFT : MUTED,
                    }}
                  >
                    {day}
                  </div>
                  <div
                    style={{
                      fontFamily: SANS,
                      fontWeight: 800,
                      fontSize: 34,
                      color: selected ? "#ffffff" : INK,
                    }}
                  >
                    {num}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ marginTop: 26 }}>
          <Label>HEURE</Label>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {slots.map((s, i) => {
              const selected = i === slotIndex && frame >= slotAt + 2;
              return (
                <div
                  key={s}
                  style={{
                    position: "relative",
                    width: 128,
                    height: 62,
                    borderRadius: 16,
                    backgroundColor: selected ? TEAL : "#ffffff",
                    boxShadow: selected
                      ? "none"
                      : "0 0 0 1px rgba(15,92,87,0.16)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: SANS,
                    fontWeight: 700,
                    fontSize: 25,
                    color: selected ? "#ffffff" : INK,
                  }}
                >
                  {s}
                  {i === slotIndex ? (
                    <TapRing at={slotAt} color={ROSE} />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 26,
          right: 26,
          bottom: 56,
          height: 84,
          borderRadius: 42,
          backgroundColor: TEAL,
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 30,
          opacity: frame >= slotAt + 2 ? 1 : 0.45,
          scale: interpolate(
            frame,
            [confirmAt, confirmAt + 3, confirmAt + 9],
            [1, 0.95, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
        }}
      >
        Confirmer
        <TapRing at={confirmAt} color={ROSE} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          top: 70,
          borderRadius: 28,
          padding: "20px 22px",
          backgroundColor: TEAL_DEEP,
          boxShadow: "0 24px 50px rgba(10,45,43,0.4)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 18,
          opacity: interpolate(frame, [toastAt, toastAt + 5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [toastAt, toastAt + 16],
            ["0px -180px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 13, stiffness: 170, mass: 0.8 }),
            },
          ),
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: ROSE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CheckIcon size={36} color="#ffffff" />
        </div>
        <div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 29,
              color: "#ffffff",
            }}
          >
            {confirmTitle}
          </div>
          <div
            style={{
              marginTop: 4,
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 21,
              color: TEAL_SOFT,
            }}
          >
            {confirmDetail}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
