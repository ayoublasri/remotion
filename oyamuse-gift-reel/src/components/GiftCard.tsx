import { Easing, interpolate, useCurrentFrame } from "remotion";
import { DISPLAY, SANS, SCRIPT, SERIF } from "../fonts";
import { GOLD, GOLD_DEEP, GREEN_DEEP, INK, MUTED } from "../theme";
import { Bow, Heart } from "./Icons";
import { LogoBadge } from "./Logo";
import { StarPattern } from "./Pattern";

export const CARD_WIDTH = 660;
export const CARD_HEIGHT = 412;

// The OYA MUSE gift card: cream stock, khatam pattern, a gold sash tied
// across the corner, and the recipient's name written on by hand.
export const GiftCard: React.FC<{
  readonly id: string;
  readonly logo: string;
  readonly recipient: string;
  readonly writeAt: number;
  readonly shineAt: number;
  readonly recipientSize: number;
}> = ({ id, logo, recipient, writeAt, shineAt, recipientSize }) => {
  const frame = useCurrentFrame();
  const write = interpolate(frame, [writeAt, writeAt + 24], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <div
      style={{
        position: "relative",
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 28,
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #fdf9f1 0%, #f7efe0 55%, #f1e5d0 100%)",
        boxShadow:
          "0 40px 90px rgba(15,44,34,0.28), 0 0 0 1px rgba(196,162,79,0.5)",
      }}
    >
      <StarPattern id={`${id}-pattern`} color={GOLD} opacity={0.16} size={64} />
      <div
        style={{
          position: "absolute",
          inset: 16,
          borderRadius: 18,
          border: `2px solid ${GOLD}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 24,
          borderRadius: 13,
          border: "1px solid rgba(196,162,79,0.55)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 560 - 230,
          top: 110 - 21,
          width: 460,
          height: 42,
          rotate: "45deg",
          background:
            "linear-gradient(180deg, #8f6f2c 0%, #c4a24f 22%, #f3e3b8 50%, #c4a24f 78%, #8f6f2c 100%)",
          boxShadow: "0 0 14px rgba(143,111,44,0.35)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 560 - 75,
          top: 110 - 52,
          rotate: "-45deg",
          transformOrigin: "75px 52px",
        }}
      >
        <Bow width={150} id={`${id}-bow`} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 48,
          top: 44,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 18,
        }}
      >
        <LogoBadge image={logo} size={84} ring={false} ringColor={GOLD} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div
            style={{
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: "0.2em",
              color: GOLD_DEEP,
            }}
          >
            CARTE CADEAU
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 15,
              letterSpacing: "0.2em",
              color: MUTED,
            }}
          >
            TÉMARA
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 48, top: 158 }}>
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 40,
            lineHeight: 1,
            color: INK,
          }}
        >
          Un moment
        </div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 68,
            lineHeight: 1.08,
            letterSpacing: "0.04em",
            color: GREEN_DEEP,
          }}
        >
          OYA MUSE
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 48,
          top: 296,
          right: 40,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            fontSize: 22,
            letterSpacing: "0.2em",
            color: GOLD_DEEP,
            flexShrink: 0,
          }}
        >
          POUR :
        </div>
        <div
          style={{
            fontFamily: SCRIPT,
            fontSize: recipientSize,
            lineHeight: 1.25,
            color: GREEN_DEEP,
            whiteSpace: "nowrap",
            paddingRight: 8,
            clipPath: `inset(-30% ${100 - write}% -30% -5%)`,
          }}
        >
          {recipient}
        </div>
        <div
          style={{
            flexShrink: 0,
            scale: interpolate(frame, [writeAt + 22, writeAt + 34], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 10, stiffness: 200, mass: 0.6 }),
              output: "perceptual-scale",
            }),
          }}
        >
          <Heart size={30} color={GOLD} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: -100,
          left: 0,
          width: 160,
          height: CARD_HEIGHT + 200,
          rotate: "24deg",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,252,240,0.85) 50%, rgba(255,255,255,0) 100%)",
          mixBlendMode: "screen",
          pointerEvents: "none",
          translate: interpolate(
            frame,
            [shineAt, shineAt + 26],
            ["-300px 0px", "900px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.45, 0, 0.35, 1),
            },
          ),
          opacity: interpolate(
            frame,
            [shineAt, shineAt + 4, shineAt + 22, shineAt + 26],
            [0, 1, 1, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
        }}
      />
    </div>
  );
};
