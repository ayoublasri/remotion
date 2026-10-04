import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { SANS } from "../../fonts";
import { EMERALD, EMERALD_DEEP, GOLD, INK, MUTED } from "../../theme";
import { StarMark } from "../Brand";
import { CheckIcon, SendIcon } from "../Icons";
import { LogoBadge } from "../Logo";
import { TapRing } from "../TapRing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const pop = (frame: number, at: number) => ({
  opacity: interpolate(frame, [at, at + 5], [0, 1], clamp),
  scale: interpolate(frame, [at, at + 12], [0.6, 1], {
    ...clamp,
    easing: Easing.spring({ damping: 13, stiffness: 200, mass: 0.7 }),
    output: "perceptual-scale",
  }),
});

const TypingDots: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 8,
        padding: "18px 22px",
        borderRadius: 26,
        backgroundColor: "#efe8dc",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: MUTED,
            translate: `0px ${-6 * Math.max(0, Math.sin(((frame - i * 3) / 10) * Math.PI))}px`,
          }}
        />
      ))}
    </div>
  );
};

// Step 1: the sender writes the keyword to MySalon.ma, picks the treatment in
// the chat, pays, and the gift card is sent.
export const DmScreen: React.FC<{
  readonly keyword: string;
  readonly reply: string;
  readonly salonLine: string;
  readonly salonLogo: string;
  readonly options: string[];
  readonly pickIndex: number;
  readonly payLabel: string;
  readonly paidLabel: string;
  readonly sent: string;
  readonly keywordAt: number;
  readonly replyAt: number;
  readonly pickAt: number;
  readonly payAt: number;
  readonly sentAt: number;
}> = ({
  keyword,
  reply,
  salonLine,
  salonLogo,
  options,
  pickIndex,
  payLabel,
  paidLabel,
  sent,
  keywordAt,
  replyAt,
  pickAt,
  payAt,
  sentAt,
}) => {
  const frame = useCurrentFrame();
  const typing = frame >= keywordAt + 10 && frame < replyAt;
  const picked = frame >= pickAt + 2;
  const paid = frame >= payAt + 4;
  const scroll = interpolate(frame, [sentAt, sentAt + 12], [0, -60], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#fbf8f2" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 150,
          paddingTop: 68,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
          paddingLeft: 22,
          borderBottom: "1px solid rgba(26,74,64,0.12)",
          backgroundColor: "#fbf8f2",
          zIndex: 2,
        }}
      >
        <svg
          width="20"
          height="34"
          viewBox="0 0 12 20"
          fill="none"
          stroke={INK}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 2 2 10l8 8" />
        </svg>
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 29,
            backgroundColor: EMERALD,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StarMark size={28} color={GOLD} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 25,
              color: INK,
            }}
          >
            MySalon.ma
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 17,
              color: EMERALD,
            }}
          >
            En ligne
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          top: 176,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          translate: `0px ${scroll}px`,
        }}
      >
        <div
          style={{
            alignSelf: "flex-end",
            padding: "16px 32px",
            borderRadius: "26px 26px 8px 26px",
            backgroundColor: EMERALD,
            color: "#ffffff",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 40,
            letterSpacing: "0.06em",
            transformOrigin: "100% 100%",
            ...pop(frame, keywordAt),
          }}
        >
          {keyword}
        </div>
        {typing ? (
          <div
            style={{ alignSelf: "flex-start", ...pop(frame, keywordAt + 10) }}
          >
            <TypingDots />
          </div>
        ) : null}
        {frame >= replyAt ? (
          <div
            style={{
              alignSelf: "flex-start",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              transformOrigin: "0% 0%",
              ...pop(frame, replyAt),
            }}
          >
            <div
              style={{
                maxWidth: 360,
                padding: "16px 20px",
                borderRadius: "26px 26px 26px 8px",
                backgroundColor: "#efe8dc",
                color: INK,
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: 23,
                lineHeight: 1.3,
              }}
            >
              {reply}
            </div>
            <div
              style={{
                width: 372,
                borderRadius: 22,
                overflow: "hidden",
                backgroundColor: "#ffffff",
                boxShadow:
                  "0 12px 30px rgba(8,34,28,0.12), 0 0 0 1px rgba(201,169,110,0.4)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderBottom: "1px solid rgba(26,74,64,0.1)",
                }}
              >
                <LogoBadge
                  image={salonLogo}
                  size={40}
                  ring={false}
                  ringColor={GOLD}
                />
                <div
                  style={{
                    fontFamily: SANS,
                    fontWeight: 800,
                    fontSize: 19,
                    letterSpacing: "0.04em",
                    color: EMERALD_DEEP,
                  }}
                >
                  {salonLine}
                </div>
              </div>
              <div
                style={{
                  padding: "10px 12px 12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {options.map((o, i) => {
                  const selected = picked && i === pickIndex;
                  return (
                    <div
                      key={o}
                      style={{
                        position: "relative",
                        height: 56,
                        borderRadius: 14,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                        padding: "0 14px",
                        backgroundColor: selected ? EMERALD : "#faf6ee",
                        color: selected ? "#ffffff" : INK,
                        fontFamily: SANS,
                        fontWeight: 700,
                        fontSize: 23,
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 11,
                          border: `2.5px solid ${selected ? GOLD : "rgba(26,74,64,0.35)"}`,
                          backgroundColor: selected ? GOLD : "transparent",
                          flexShrink: 0,
                        }}
                      />
                      {o}
                      {i === pickIndex ? (
                        <TapRing at={pickAt} color={EMERALD} />
                      ) : null}
                    </div>
                  );
                })}
                <div
                  style={{
                    position: "relative",
                    marginTop: 4,
                    height: 62,
                    borderRadius: 31,
                    backgroundColor: paid ? EMERALD : GOLD,
                    color: paid ? "#ffffff" : EMERALD_DEEP,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    fontFamily: SANS,
                    fontWeight: 800,
                    fontSize: 27,
                    opacity: interpolate(
                      frame,
                      [pickAt + 10, pickAt + 18],
                      [0.35, 1],
                      clamp,
                    ),
                    scale: interpolate(
                      frame,
                      [payAt, payAt + 3, payAt + 9],
                      [1, 0.94, 1],
                      clamp,
                    ),
                  }}
                >
                  {paid ? <CheckIcon size={28} color={GOLD} /> : null}
                  {paid ? paidLabel : payLabel}
                  <TapRing at={payAt} color={EMERALD} />
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {frame >= sentAt ? (
          <div
            style={{
              alignSelf: "center",
              marginTop: 4,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              padding: "12px 20px",
              borderRadius: 999,
              backgroundColor: "rgba(26,74,64,0.1)",
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 21,
              color: EMERALD_DEEP,
              ...pop(frame, sentAt),
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: EMERALD,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckIcon size={20} color={GOLD} />
            </div>
            {sent}
          </div>
        ) : null}
      </div>
      <div
        style={{
          position: "absolute",
          left: 18,
          right: 18,
          bottom: 24,
          height: 66,
          borderRadius: 33,
          backgroundColor: "#ffffff",
          boxShadow: "0 0 0 1px rgba(26,74,64,0.14)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 10px 0 26px",
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 21,
          color: MUTED,
        }}
      >
        Message…
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: EMERALD,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SendIcon size={22} color="#ffffff" />
        </div>
      </div>
    </AbsoluteFill>
  );
};
