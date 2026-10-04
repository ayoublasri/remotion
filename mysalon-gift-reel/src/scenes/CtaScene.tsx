import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Logo, StarMark } from "../components/Brand";
import { GiftCard } from "../components/GiftCard";
import { foil, SendIcon } from "../components/Icons";
import { Flash, Twinkles } from "../components/Overlays";
import { StarPattern } from "../components/Pattern";
import { Sfx } from "../components/Sfx";
import { Starburst } from "../components/Starburst";
import { DISPLAY, SANS, SERIF } from "../fonts";
import type { GiftCardContent, GiftReelProps, Partner } from "../schema";
import { BEAT } from "../timing";
import {
  DARK_BG,
  EMERALD_INK,
  GOLD,
  GOLD_FOIL,
  GOLD_LIGHT,
  IVORY,
} from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const AT = {
  card: 8,
  write: 24,
  line1: BEAT * 2,
  line2: BEAT * 3,
  lead: BEAT * 4,
  button: BEAT * 4 + 8,
  shine: BEAT * 6 + 10,
};

const springIn = (frame: number, at: number) =>
  interpolate(frame, [at, at + 16], [0, 1], {
    ...clamp,
    easing: Easing.spring({ damping: 12, stiffness: 170, mass: 0.8 }),
    output: "perceptual-scale",
  });

// Bars 14-16 (second drop): the one invite. Offer the salon; the gift is
// booked through MySalon.ma, by DM.
export const CtaScene: React.FC<{
  readonly cta: GiftReelProps["cta"];
  readonly card: GiftCardContent;
  readonly partner: Partner;
}> = ({ cta, card, partner }) => {
  const frame = useCurrentFrame();
  const float = Math.sin(frame / 20) * 8;

  return (
    <AbsoluteFill
      name="CTA scene"
      style={{ background: DARK_BG, overflow: "hidden" }}
    >
      <Starburst
        colorA="rgba(201,169,110,0.07)"
        colorB="rgba(201,169,110,0)"
        rays={18}
        opacity={1}
        degreesPerFrame={0.25}
      />
      <StarPattern id="cta-pattern" color={GOLD} opacity={0.06} size={120} />
      <div
        style={{
          position: "absolute",
          right: -330,
          top: -280,
          opacity: 0.04,
          rotate: `${frame * 0.12}deg`,
        }}
      >
        <StarMark size={1000} color={GOLD_LIGHT} />
      </div>
      <Twinkles
        points={[
          { x: 12, y: 14 },
          { x: 88, y: 20 },
          { x: 10, y: 52 },
          { x: 90, y: 48 },
        ]}
        color={GOLD}
      />
      <Sfx name="sparkle" at={AT.card} volume={0.35} />
      <Sfx name="stamp" at={AT.line1} volume={0.55} />
      <Sfx name="stamp" at={AT.line2} volume={0.65} />
      <Sfx name="pop" at={AT.button} volume={0.6} />
      <div
        style={{
          position: "absolute",
          left: 540 - 330,
          top: 530 - 206 + float,
          scale: String(0.76 * springIn(frame, AT.card)),
          transform: `perspective(1600px) rotateY(${Math.sin(frame / 26) * 7}deg) rotateX(${Math.cos(frame / 32) * 3}deg)`,
          rotate: `${interpolate(frame, [AT.card, AT.card + 20], [-10, -3], { ...clamp, easing: Easing.out(Easing.cubic) })}deg`,
        }}
      >
        <GiftCard
          id="cta-card"
          content={card}
          logo={partner.logo}
          name={partner.name}
          city={partner.city}
          recipient={cta.recipient}
          writeAt={AT.write}
          shineAt={AT.shine}
          recipientSize={58}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 30,
          right: 30,
          top: 770,
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="CTA line 1"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 56,
            lineHeight: 1.1,
            letterSpacing: "0.12em",
            marginRight: "-0.12em",
            color: IVORY,
            scale: interpolate(frame, [AT.line1, AT.line1 + 14], [1.5, 1], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            }),
            opacity: interpolate(
              frame,
              [AT.line1, AT.line1 + 5],
              [0, 1],
              clamp,
            ),
          }}
        >
          {cta.line1}
        </Interactive.Div>
        <Interactive.Div
          name="CTA salon"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 134,
            lineHeight: 1.08,
            letterSpacing: "0.05em",
            ...foil(GOLD_FOIL),
            backgroundSize: "200% 100%",
            backgroundPosition: `${interpolate(frame, [AT.line2, AT.line2 + 70], [100, 0], clamp)}% 0%`,
            filter: "drop-shadow(0 0 30px rgba(201,169,110,0.35))",
            scale: interpolate(frame, [AT.line2, AT.line2 + 14], [1.6, 1], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            }),
            opacity: interpolate(
              frame,
              [AT.line2, AT.line2 + 5],
              [0, 1],
              clamp,
            ),
          }}
        >
          {partner.name}
        </Interactive.Div>
        <Interactive.Div
          name="CTA lead"
          style={{
            marginTop: 30,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 44,
            color: "rgba(248,243,234,0.9)",
            opacity: interpolate(frame, [AT.lead, AT.lead + 8], [0, 1], clamp),
            translate: interpolate(
              frame,
              [AT.lead, AT.lead + 16],
              ["0px 30px", "0px 0px"],
              {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
          }}
        >
          {cta.lead}
          <Logo size={50} color={IVORY} accent={GOLD} starColor={GOLD} />
        </Interactive.Div>
        <div
          style={{
            marginTop: 34,
            display: "flex",
            justifyContent: "center",
            scale: springIn(frame, AT.button),
          }}
        >
          <Interactive.Div
            name="CTA button"
            style={{
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 22,
              padding: "0 70px",
              height: 132,
              borderRadius: 66,
              background:
                "linear-gradient(135deg, #f1e2bd 0%, #d4b47a 45%, #b08d4f 100%)",
              color: EMERALD_INK,
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 52,
              boxShadow:
                "0 26px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,248,230,0.5)",
              scale:
                frame > AT.button + 16
                  ? interpolate(
                      (frame - AT.button) % (BEAT * 2),
                      [0, 4, 24],
                      [1.045, 1.02, 1],
                      clamp,
                    )
                  : 1,
            }}
          >
            <SendIcon size={50} color={EMERALD_INK} />
            {cta.button}
            {[AT.shine, AT.shine + 60].map((at) => (
              <div
                key={at}
                style={{
                  position: "absolute",
                  top: -40,
                  left: 0,
                  width: 120,
                  height: 220,
                  rotate: "20deg",
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)",
                  pointerEvents: "none",
                  translate: interpolate(
                    frame,
                    [at, at + 24],
                    ["-200px 0px", "900px 0px"],
                    {
                      ...clamp,
                      easing: Easing.bezier(0.4, 0, 0.4, 1),
                    },
                  ),
                }}
              />
            ))}
          </Interactive.Div>
        </div>
      </div>
      <Flash at={0} peak={0.5} />
    </AbsoluteFill>
  );
};
