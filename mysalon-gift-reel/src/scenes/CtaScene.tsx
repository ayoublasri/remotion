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
import { LogoBadge } from "../components/Logo";
import { Flash, Twinkles } from "../components/Overlays";
import { StarPattern } from "../components/Pattern";
import { Sfx } from "../components/Sfx";
import { Starburst } from "../components/Starburst";
import { DISPLAY, SANS, SERIF } from "../fonts";
import { SAFE } from "../layout";
import type { GiftCardContent, GiftReelProps, Partner } from "../schema";
import { BEAT } from "../timing";
import {
  DARK_BG,
  EMERALD_INK,
  GOLD,
  GOLD_FOIL,
  GOLD_LIGHT,
  IVORY,
  SAGE,
} from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const AT = {
  logo: 0,
  card: 2,
  write: 14,
  line1: 6,
  line2: 12,
  salon: 24,
  lead: 36,
  button: 46,
  shine: 80,
  share: 96,
};

const rise = (frame: number, at: number) => ({
  opacity: interpolate(frame, [at, at + 6], [0, 1], clamp),
  translate: interpolate(frame, [at, at + 14], ["0px 34px", "0px 0px"], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  }),
});

// Scene 5: how to get in touch. Offer a beauty experience at the salon, by
// DM to MySalon.ma; those who dream of it send the reel on. Everything sits
// inside the safe area, the button narrower than the icon band allows.
export const CtaScene: React.FC<{
  readonly cta: GiftReelProps["cta"];
  readonly card: GiftCardContent;
  readonly partner: Partner;
}> = ({ cta, card, partner }) => {
  const frame = useCurrentFrame();
  const float = Math.sin(frame / 18) * 6;

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
          { x: 12, y: 20 },
          { x: 88, y: 24 },
          { x: 10, y: 46 },
          { x: 90, y: 42 },
        ]}
        color={GOLD}
      />
      <Sfx name="stamp" at={AT.line2} volume={0.5} />
      <Sfx name="sparkle" at={AT.salon} volume={0.35} />
      <Sfx name="pop" at={AT.button} volume={0.5} />
      <Sfx name="pop" at={AT.share} volume={0.35} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: SAFE.top + 10,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            scale: interpolate(frame, [AT.logo, AT.logo + 14], [0, 1], {
              ...clamp,
              easing: Easing.spring({
                damping: 11,
                stiffness: 160,
                mass: 0.9,
              }),
              output: "perceptual-scale",
            }),
          }}
        >
          <Logo size={54} color={IVORY} accent={GOLD} starColor={GOLD} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 540 - 330,
          top: 560 - 206 + float,
          scale: String(
            0.58 *
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
          partner={partner}
          recipients={[cta.recipient]}
          writeAt={AT.write}
          writeEvery={1000}
          shineAt={AT.shine}
          recipientSize={66}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          right: 1080 - SAFE.right,
          top: 716,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="CTA line 1"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 50,
            lineHeight: 1.1,
            letterSpacing: "0.12em",
            marginRight: "-0.12em",
            color: IVORY,
            scale: interpolate(frame, [AT.line1, AT.line1 + 12], [1.4, 1], {
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
          name="CTA line 2"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 62,
            lineHeight: 1.15,
            letterSpacing: "0.03em",
            whiteSpace: "nowrap",
            ...foil(GOLD_FOIL),
            backgroundSize: "200% 100%",
            backgroundPosition: `${interpolate(frame, [AT.line2, AT.line2 + 70], [100, 0], clamp)}% 0%`,
            filter: "drop-shadow(0 0 30px rgba(201,169,110,0.35))",
            scale: interpolate(frame, [AT.line2, AT.line2 + 12], [1.5, 1], {
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
          {cta.line2}
        </Interactive.Div>
        <Interactive.Div
          name="CTA salon"
          style={{
            marginTop: 22,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            padding: "8px 28px 8px 8px",
            borderRadius: 999,
            backgroundColor: "rgba(201,169,110,0.12)",
            boxShadow: "inset 0 0 0 1.5px rgba(201,169,110,0.55)",
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: "0.08em",
            color: GOLD_LIGHT,
            whiteSpace: "nowrap",
            ...rise(frame, AT.salon),
          }}
        >
          <LogoBadge
            image={partner.logo}
            size={60}
            ring={false}
            ringColor={GOLD}
          />
          <span>
            <span
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: 30,
                letterSpacing: 0,
                color: SAGE,
              }}
            >
              {cta.atLabel}
            </span>
            {` ${partner.name} · ${partner.city}`}
          </span>
        </Interactive.Div>
        <Interactive.Div
          name="CTA lead"
          style={{
            marginTop: 36,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 34,
            color: SAGE,
            ...rise(frame, AT.lead),
          }}
        >
          {cta.lead}
        </Interactive.Div>
        <div
          style={{
            marginTop: 20,
            scale: interpolate(frame, [AT.button, AT.button + 14], [0, 1], {
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
              gap: 18,
              padding: "0 46px",
              height: 112,
              borderRadius: 56,
              background:
                "linear-gradient(135deg, #f1e2bd 0%, #d4b47a 45%, #b08d4f 100%)",
              color: EMERALD_INK,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 38,
              whiteSpace: "nowrap",
              boxShadow:
                "0 26px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,248,230,0.5)",
              scale:
                frame > AT.button + 14
                  ? interpolate(
                      (frame - AT.button) % (BEAT * 2),
                      [0, 4, 24],
                      [1.05, 1.02, 1],
                      clamp,
                    )
                  : 1,
            }}
          >
            <SendIcon size={40} color={EMERALD_INK} />
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
                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)",
                  pointerEvents: "none",
                  translate: interpolate(
                    frame,
                    [at, at + 22],
                    ["-200px 0px", "900px 0px"],
                    { ...clamp, easing: Easing.bezier(0.4, 0, 0.4, 1) },
                  ),
                }}
              />
            ))}
          </Interactive.Div>
        </div>
        <div style={{ marginTop: 48, ...rise(frame, AT.share) }}>
          <Interactive.Div
            name="Share ask"
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 42,
              color: IVORY,
            }}
          >
            {cta.shareAsk}
          </Interactive.Div>
          <Interactive.Div
            name="Share line"
            style={{
              marginTop: 8,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              fontFamily: SERIF,
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: 32,
              color: GOLD_LIGHT,
              whiteSpace: "nowrap",
            }}
          >
            <SendIcon size={30} color={GOLD} />
            {cta.shareLine}
          </Interactive.Div>
        </div>
      </div>
      <Flash at={0} peak={0.5} />
    </AbsoluteFill>
  );
};
