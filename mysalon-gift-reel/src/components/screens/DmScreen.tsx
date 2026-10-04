import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { SANS } from "../../fonts";
import {
  EMERALD,
  EMERALD_DEEP,
  GOLD,
  GOLD_LIGHT,
  INK,
  MUTED,
} from "../../theme";
import { StarMark } from "../Brand";
import { CheckIcon, GiftIcon, SendIcon } from "../Icons";
import { TapRing } from "../TapRing";

const pop = (frame: number, at: number) => ({
  opacity: interpolate(frame, [at, at + 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }),
  scale: interpolate(frame, [at, at + 12], [0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
        padding: "20px 24px",
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

// Step 1: the sender writes to MySalon.ma, receives a payment card and pays.
export const DmScreen: React.FC<{
  readonly request: string;
  readonly reply: string;
  readonly giftLabel: string;
  readonly giftDetail: string;
  readonly payLabel: string;
  readonly paidLabel: string;
  readonly sent: string;
  readonly requestAt: number;
  readonly replyAt: number;
  readonly tapAt: number;
  readonly sentAt: number;
}> = ({
  request,
  reply,
  giftLabel,
  giftDetail,
  payLabel,
  paidLabel,
  sent,
  requestAt,
  replyAt,
  tapAt,
  sentAt,
}) => {
  const frame = useCurrentFrame();
  const paid = frame >= tapAt + 4;
  const typing = frame >= requestAt + 12 && frame < replyAt;
  // The thread scrolls up a little as messages arrive.
  const scroll = interpolate(frame, [sentAt, sentAt + 12], [0, -70], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
          height: 160,
          paddingTop: 72,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
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
            width: 62,
            height: 62,
            borderRadius: 31,
            backgroundColor: EMERALD,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StarMark size={30} color={GOLD} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 26,
              color: INK,
            }}
          >
            MySalon.ma
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 18,
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
          left: 22,
          right: 22,
          top: 190,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          translate: `0px ${scroll}px`,
        }}
      >
        <div
          style={{
            alignSelf: "flex-end",
            maxWidth: 340,
            padding: "18px 22px",
            borderRadius: "26px 26px 8px 26px",
            backgroundColor: EMERALD,
            color: "#ffffff",
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 25,
            lineHeight: 1.3,
            transformOrigin: "100% 100%",
            ...pop(frame, requestAt),
          }}
        >
          {request}
        </div>
        {typing ? (
          <div
            style={{ alignSelf: "flex-start", ...pop(frame, requestAt + 12) }}
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
              gap: 12,
              transformOrigin: "0% 0%",
              ...pop(frame, replyAt),
            }}
          >
            <div
              style={{
                maxWidth: 340,
                padding: "18px 22px",
                borderRadius: "26px 26px 26px 8px",
                backgroundColor: "#efe8dc",
                color: INK,
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: 25,
                lineHeight: 1.3,
              }}
            >
              {reply}
            </div>
            <div
              style={{
                width: 340,
                borderRadius: 24,
                overflow: "hidden",
                backgroundColor: "#ffffff",
                boxShadow:
                  "0 12px 30px rgba(8,34,28,0.14), 0 0 0 1px rgba(26,74,64,0.15)",
              }}
            >
              <div
                style={{
                  height: 92,
                  background: `linear-gradient(120deg, ${EMERALD} 0%, ${EMERALD_DEEP} 100%)`,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                  padding: "0 22px",
                }}
              >
                <GiftIcon size={38} color={GOLD} />
                <div>
                  <div
                    style={{
                      fontFamily: SANS,
                      fontWeight: 800,
                      fontSize: 25,
                      lineHeight: 1.15,
                      color: "#ffffff",
                    }}
                  >
                    {giftLabel}
                  </div>
                  <div
                    style={{
                      marginTop: 3,
                      fontFamily: SANS,
                      fontWeight: 600,
                      fontSize: 19,
                      color: GOLD_LIGHT,
                    }}
                  >
                    {giftDetail}
                  </div>
                </div>
              </div>
              <div style={{ padding: 18 }}>
                <div
                  style={{
                    position: "relative",
                    height: 70,
                    borderRadius: 35,
                    backgroundColor: paid ? EMERALD : GOLD,
                    color: paid ? "#ffffff" : EMERALD_DEEP,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    fontFamily: SANS,
                    fontWeight: 800,
                    fontSize: 30,
                    scale: interpolate(
                      frame,
                      [tapAt, tapAt + 3, tapAt + 9],
                      [1, 0.94, 1],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      },
                    ),
                  }}
                >
                  {paid ? <CheckIcon size={30} color={GOLD} /> : null}
                  {paid ? paidLabel : payLabel}
                  <TapRing at={tapAt} color={EMERALD} />
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {frame >= sentAt ? (
          <div
            style={{
              alignSelf: "center",
              marginTop: 8,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              padding: "14px 22px",
              borderRadius: 999,
              backgroundColor: "rgba(26,74,64,0.1)",
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 22,
              color: EMERALD_DEEP,
              ...pop(frame, sentAt),
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: EMERALD,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckIcon size={22} color={GOLD} />
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
          bottom: 26,
          height: 70,
          borderRadius: 35,
          backgroundColor: "#ffffff",
          boxShadow: "0 0 0 1px rgba(26,74,64,0.14)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px 0 28px",
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 22,
          color: MUTED,
        }}
      >
        Message…
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: EMERALD,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SendIcon size={24} color="#ffffff" />
        </div>
      </div>
    </AbsoluteFill>
  );
};
