import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { CoBrand, StarMark } from "../components/Brand";
import { GiftCard } from "../components/GiftCard";
import { SendIcon } from "../components/Icons";
import { Flash, Twinkles } from "../components/Overlays";
import { StarPattern } from "../components/Pattern";
import { Sfx } from "../components/Sfx";
import { Starburst } from "../components/Starburst";
import { SANS, SERIF } from "../fonts";
import type { GiftCardContent, GiftReelProps, Partner } from "../schema";
import { BEAT } from "../timing";
import { DARK_BG, EMERALD_INK, GOLD, GOLD_LIGHT, IVORY, SAGE } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const AT = {
  card: 2,
  write: 12,
  dream: 6,
  dreamLine: 14,
  gift: BEAT * 2,
  button: BEAT * 2 + 8,
  sign: BEAT * 4,
};

const rise = (frame: number, at: number) => ({
  opacity: interpolate(frame, [at, at + 6], [0, 1], clamp),
  translate: interpolate(frame, [at, at + 14], ["0px 34px", "0px 0px"], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  }),
});

// Bars 10-12 (second drop): the two-sided call to action. If you dream of it,
// send the reel to the person who should offer it; if you want to offer it,
// DM the keyword. The last beat powers down like a record stop and the reel
// loops back to "ARRÊTE".
export const CtaScene: React.FC<{
  readonly cta: GiftReelProps["cta"];
  readonly card: GiftCardContent;
  readonly partner: Partner;
}> = ({ cta, card, partner }) => {
  const frame = useCurrentFrame();
  const float = Math.sin(frame / 18) * 7;
  const powerDown = interpolate(frame, [BEAT * 11, BEAT * 12], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });

  return (
    <AbsoluteFill
      name="CTA scene"
      style={{ background: DARK_BG, overflow: "hidden" }}
    >
      <AbsoluteFill style={{ scale: String(1 - 0.04 * powerDown) }}>
        <Starburst
          colorA="rgba(201,169,110,0.07)"
          colorB="rgba(201,169,110,0)"
          rays={18}
          opacity={1}
          degreesPerFrame={0.3}
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
            { x: 10, y: 16 },
            { x: 90, y: 22 },
            { x: 8, y: 50 },
            { x: 92, y: 46 },
          ]}
          color={GOLD}
        />
        <Sfx name="pop" at={AT.dream} volume={0.45} />
        <Sfx name="pop" at={AT.gift} volume={0.45} />
        <Sfx name="stamp" at={AT.button} volume={0.5} />
        <Sfx name="sparkle" at={AT.sign} volume={0.35} />
        <div
          style={{
            position: "absolute",
            left: 540 - 330,
            top: 430 - 206 + float,
            scale: String(
              0.62 *
                interpolate(frame, [AT.card, AT.card + 12], [0.5, 1], {
                  ...clamp,
                  easing: Easing.out(Easing.back(1.4)),
                }),
            ),
            transform: `perspective(1600px) rotateY(${Math.sin(frame / 24) * 8}deg) rotateX(${Math.cos(frame / 30) * 3}deg)`,
            rotate: "-4deg",
          }}
        >
          <GiftCard
            id="cta-card"
            content={card}
            logo={partner.logo}
            name={partner.name}
            city={partner.city}
            recipients={[cta.recipient]}
            writeAt={AT.write}
            writeEvery={1000}
            shineAt={AT.sign + 6}
            recipientSize={70}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 40,
            right: 40,
            top: 650,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Interactive.Div
            name="Dream ask"
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 74,
              letterSpacing: "0.01em",
              color: IVORY,
              ...rise(frame, AT.dream),
            }}
          >
            {cta.dreamAsk}
          </Interactive.Div>
          <Interactive.Div
            name="Dream line"
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              fontFamily: SERIF,
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: 50,
              color: GOLD_LIGHT,
              ...rise(frame, AT.dreamLine),
            }}
          >
            <SendIcon size={44} color={GOLD} />
            {cta.dreamLine}
          </Interactive.Div>
          <div
            style={{
              marginTop: 44,
              width: 520,
              height: 2,
              background:
                "linear-gradient(90deg, rgba(201,169,110,0) 0%, #c9a96e 50%, rgba(201,169,110,0) 100%)",
              opacity: interpolate(
                frame,
                [AT.gift - 4, AT.gift + 4],
                [0, 1],
                clamp,
              ),
            }}
          />
          <Interactive.Div
            name="Gift ask"
            style={{
              marginTop: 44,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 74,
              letterSpacing: "0.01em",
              color: IVORY,
              ...rise(frame, AT.gift),
            }}
          >
            {cta.giftAsk}
          </Interactive.Div>
          <div
            style={{
              marginTop: 24,
              scale: interpolate(frame, [AT.button, AT.button + 12], [0, 1], {
                ...clamp,
                easing: Easing.spring({
                  damping: 11,
                  stiffness: 180,
                  mass: 0.8,
                }),
                output: "perceptual-scale",
              }),
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
                padding: "0 64px",
                height: 136,
                borderRadius: 68,
                background:
                  "linear-gradient(135deg, #f1e2bd 0%, #d4b47a 45%, #b08d4f 100%)",
                color: EMERALD_INK,
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 52,
                boxShadow:
                  "0 26px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,248,230,0.5)",
                scale:
                  frame > AT.button + 12
                    ? interpolate(
                        (frame - AT.button) % (BEAT * 2),
                        [0, 4, 24],
                        [1.05, 1.02, 1],
                        clamp,
                      )
                    : 1,
              }}
            >
              <SendIcon size={50} color={EMERALD_INK} />
              {cta.button}
              {[AT.sign, AT.sign + 50].map((at) => (
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
                      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)",
                    pointerEvents: "none",
                    translate: interpolate(
                      frame,
                      [at, at + 22],
                      ["-200px 0px", "1000px 0px"],
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
          <div style={{ marginTop: 60, ...rise(frame, AT.sign) }}>
            <CoBrand
              logo={partner.logo}
              name={partner.name}
              size={32}
              nameColor={GOLD}
              crossColor={SAGE}
              wordmark={{ color: IVORY, accent: GOLD, star: GOLD }}
            />
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundColor: EMERALD_INK,
          opacity: powerDown * 0.85,
          pointerEvents: "none",
        }}
      />
      <Flash at={0} peak={0.5} />
    </AbsoluteFill>
  );
};
