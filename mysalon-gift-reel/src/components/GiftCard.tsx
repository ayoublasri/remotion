import { Easing, interpolate, useCurrentFrame } from "remotion";
import { DISPLAY, SANS, SCRIPT, SERIF } from "../fonts";
import type { GiftCardContent, Partner } from "../schema";
import {
  EMERALD,
  EMERALD_DEEP,
  GOLD,
  GOLD_DEEP,
  INK,
  MUTED,
  SATIN,
} from "../theme";
import { Logo } from "./Brand";
import { Bow, Heart } from "./Icons";
import { LogoBadge } from "./Logo";
import { StarPattern } from "./Pattern";

export const CARD_WIDTH = 660;
export const CARD_HEIGHT = 412;

// The MySalon.ma digital gift card: ivory stock with the khatam star pattern,
// double gold rules, a champagne sash tied across the corner, the featured
// salon where the experience takes place, and the recipient's name written by
// hand. With several names, they are rewritten one after the other every
// `writeEvery` frames.
export const GiftCard: React.FC<{
  readonly id: string;
  readonly content: GiftCardContent;
  readonly partner: Partner;
  readonly recipients: string[];
  readonly writeAt: number;
  readonly writeEvery: number;
  readonly shineAt: number;
  readonly recipientSize: number;
}> = ({
  id,
  content,
  partner,
  recipients,
  writeAt,
  writeEvery,
  shineAt,
  recipientSize,
}) => {
  const frame = useCurrentFrame();
  const index = Math.max(
    0,
    Math.min(recipients.length - 1, Math.floor((frame - writeAt) / writeEvery)),
  );
  const startedAt = writeAt + index * writeEvery;
  const writeLength = recipients.length > 1 ? Math.min(14, writeEvery - 3) : 24;
  const write = interpolate(
    frame,
    [startedAt, startedAt + writeLength],
    [0, 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.sin),
    },
  );

  return (
    <div
      style={{
        position: "relative",
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 28,
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #fffdf8 0%, #f7efe1 55%, #efe2cc 100%)",
        boxShadow:
          "0 40px 90px rgba(8,34,28,0.3), 0 0 0 1px rgba(201,169,110,0.55)",
      }}
    >
      <StarPattern id={`${id}-pattern`} color={GOLD} opacity={0.14} size={64} />
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
          inset: 22,
          borderRadius: 14,
          border: "1px solid rgba(201,169,110,0.5)",
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
          background: `linear-gradient(180deg, ${SATIN.dark} 0%, ${GOLD} 22%, ${SATIN.light} 50%, ${GOLD} 78%, ${SATIN.dark} 100%)`,
          boxShadow: "0 0 14px rgba(138,106,50,0.35)",
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
      <div style={{ position: "absolute", left: 46, top: 42 }}>
        <Logo size={36} color={INK} accent={GOLD_DEEP} starColor={EMERALD} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 48,
          top: 92,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 15,
          letterSpacing: "0.3em",
          color: GOLD_DEEP,
        }}
      >
        {content.label}
      </div>
      <div
        style={{
          position: "absolute",
          left: 46,
          top: 134,
          fontFamily: SERIF,
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 42,
          lineHeight: 1.1,
          color: INK,
          whiteSpace: "nowrap",
        }}
      >
        {content.title}
      </div>
      <div
        style={{
          position: "absolute",
          left: 46,
          top: 198,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
        }}
      >
        <LogoBadge
          image={partner.logo}
          size={50}
          ring={false}
          ringColor={GOLD}
        />
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 25,
            letterSpacing: "0.06em",
            color: EMERALD_DEEP,
            whiteSpace: "nowrap",
          }}
        >
          {`${content.at} ${partner.name} · ${partner.city}`}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 48,
          top: 280,
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
            color: EMERALD_DEEP,
            whiteSpace: "nowrap",
            paddingRight: 8,
            clipPath: `inset(-30% ${100 - write}% -30% -5%)`,
          }}
        >
          {frame >= writeAt ? recipients[index] : ""}
        </div>
        <div
          style={{
            flexShrink: 0,
            scale: interpolate(
              frame,
              [writeAt + writeLength, writeAt + writeLength + 12],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.spring({
                  damping: 10,
                  stiffness: 200,
                  mass: 0.6,
                }),
                output: "perceptual-scale",
              },
            ),
          }}
        >
          <Heart size={30} color={GOLD} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 42,
          bottom: 32,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 15,
          letterSpacing: "0.1em",
          color: MUTED,
        }}
      >
        mysalon.ma
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
