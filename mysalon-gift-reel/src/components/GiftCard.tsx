import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SANS, SCRIPT, SERIF } from "../fonts";
import type { GiftCardContent } from "../schema";
import { INK, ROSE, ROSE_DEEP, SATIN, TEAL, TEAL_DEEP } from "../theme";
import { Logo } from "./Brand";
import { Bow, Heart } from "./Icons";
import { LogoBadge } from "./Logo";
import { StarPattern } from "./Pattern";

export const CARD_WIDTH = 660;
export const CARD_HEIGHT = 412;

// The MySalon.ma gift card: white stock with the khatam star pattern, a
// raspberry satin sash tied across the corner, the partner salon where the
// treatment takes place, and the recipient's name written on by hand.
export const GiftCard: React.FC<{
  readonly id: string;
  readonly content: GiftCardContent;
  readonly partnerLogo: string;
  readonly recipient: string;
  readonly writeAt: number;
  readonly shineAt: number;
  readonly recipientSize: number;
}> = ({
  id,
  content,
  partnerLogo,
  recipient,
  writeAt,
  shineAt,
  recipientSize,
}) => {
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
          "linear-gradient(135deg, #ffffff 0%, #fdf4f1 55%, #f9e8e5 100%)",
        boxShadow:
          "0 40px 90px rgba(10,45,43,0.3), 0 0 0 1px rgba(15,92,87,0.18)",
      }}
    >
      <StarPattern id={`${id}-pattern`} color={TEAL} opacity={0.06} size={64} />
      <div
        style={{
          position: "absolute",
          inset: 16,
          borderRadius: 18,
          border: "2px solid rgba(15,92,87,0.28)",
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
          background: `linear-gradient(180deg, ${SATIN.dark} 0%, ${ROSE} 22%, ${SATIN.light} 50%, ${ROSE} 78%, ${SATIN.dark} 100%)`,
          boxShadow: "0 0 14px rgba(140,15,44,0.3)",
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
      <div style={{ position: "absolute", left: 44, top: 40 }}>
        <Logo size={36} color={INK} accent={ROSE_DEEP} starColor={TEAL} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 46,
          top: 94,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 18,
          letterSpacing: "0.32em",
          color: ROSE_DEEP,
        }}
      >
        {content.label}
      </div>
      <div
        style={{
          position: "absolute",
          left: 44,
          top: 128,
          fontFamily: SERIF,
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 52,
          lineHeight: 1.1,
          color: INK,
        }}
      >
        {content.title}
      </div>
      <div
        style={{
          position: "absolute",
          left: 44,
          top: 208,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 25,
          color: TEAL,
        }}
      >
        <LogoBadge
          image={partnerLogo}
          size={50}
          ring={false}
          ringColor={TEAL}
        />
        {content.partnerLine}
      </div>
      <div
        style={{
          position: "absolute",
          left: 44,
          top: 290,
          right: 40,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 17,
            letterSpacing: "0.24em",
            color: ROSE_DEEP,
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
            color: TEAL_DEEP,
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
          <Heart size={30} color={ROSE} />
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
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 100%)",
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
