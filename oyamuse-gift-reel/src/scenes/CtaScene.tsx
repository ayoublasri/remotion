import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Logo } from "../components/Brand";
import { GiftCard } from "../components/GiftCard";
import { SendIcon } from "../components/Icons";
import { Flash, Twinkles } from "../components/Overlays";
import { StarPattern } from "../components/Pattern";
import { Sfx } from "../components/Sfx";
import { Starburst } from "../components/Starburst";
import { SiteMark } from "../components/Text";
import { DISPLAY, SANS } from "../fonts";
import type { GiftReelProps } from "../schema";
import { BEAT } from "../timing";
import {
  CREAM,
  CREAM_DEEP,
  GOLD,
  GOLD_DEEP,
  GREEN,
  GREEN_DEEP,
} from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const AT = {
  logo: 12,
  card: 8,
  write: 24,
  line1: BEAT * 2,
  line2: BEAT * 3,
  lead: BEAT * 4,
  button: BEAT * 4 + 8,
  site: BEAT * 6,
};

const springIn = (frame: number, at: number) =>
  interpolate(frame, [at, at + 16], [0, 1], {
    ...clamp,
    easing: Easing.spring({ damping: 12, stiffness: 170, mass: 0.8 }),
    output: "perceptual-scale",
  });

// Bars 14-16 (second drop): the one invite. Offer a moment at OYA MUSE by
// writing to MySalon.ma.
export const CtaScene: React.FC<{
  readonly cta: GiftReelProps["cta"];
  readonly logo: string;
}> = ({ cta, logo }) => {
  const frame = useCurrentFrame();
  const float = Math.sin(frame / 20) * 8;

  return (
    <AbsoluteFill
      name="CTA scene"
      style={{
        background: `radial-gradient(75% 50% at 50% 38%, ${CREAM} 0%, ${CREAM} 45%, ${CREAM_DEEP} 100%)`,
        overflow: "hidden",
      }}
    >
      <Starburst
        colorA="rgba(196,162,79,0.1)"
        colorB="rgba(196,162,79,0)"
        rays={18}
        opacity={1}
        degreesPerFrame={0.25}
      />
      <StarPattern id="cta-pattern" color={GOLD} opacity={0.06} size={120} />
      <Twinkles
        points={[
          { x: 12, y: 18 },
          { x: 88, y: 24 },
          { x: 10, y: 60 },
          { x: 90, y: 56 },
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
          left: 0,
          right: 0,
          top: 200,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ scale: springIn(frame, AT.logo) }}>
          <Logo size={60} color={GREEN_DEEP} accent={GOLD} starColor={GREEN} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 540 - 330,
          top: 560 - 206 + float,
          scale: String(0.74 * springIn(frame, AT.card)),
          transform: `perspective(1600px) rotateY(${Math.sin(frame / 26) * 7}deg) rotateX(${Math.cos(frame / 32) * 3}deg)`,
          rotate: `${interpolate(frame, [AT.card, AT.card + 20], [-10, -3], { ...clamp, easing: Easing.out(Easing.cubic) })}deg`,
        }}
      >
        <GiftCard
          id="cta-card"
          logo={logo}
          recipient={cta.recipient}
          writeAt={AT.write}
          shineAt={AT.site + 10}
          recipientSize={58}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: 790,
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="CTA line 1"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 70,
            lineHeight: 1.05,
            letterSpacing: "0.06em",
            color: GREEN_DEEP,
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
          name="CTA line 2"
          style={{
            marginTop: 8,
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 112,
            lineHeight: 1.05,
            letterSpacing: "0.06em",
            color: GOLD,
            textShadow: "0 4px 0 rgba(168,133,58,0.35)",
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
          {cta.line2}
        </Interactive.Div>
        <Interactive.Div
          name="CTA lead"
          style={{
            marginTop: 48,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 38,
            letterSpacing: "0.02em",
            color: "rgba(22,58,46,0.85)",
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
        </Interactive.Div>
        <div
          style={{
            marginTop: 26,
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
              backgroundColor: GREEN,
              color: CREAM,
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 52,
              boxShadow:
                "0 26px 60px rgba(15,44,34,0.35), 0 0 0 4px rgba(196,162,79,0.55)",
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
            <SendIcon size={50} color={GOLD} />
            {cta.button}
            {[AT.site + 10, AT.site + 70].map((at) => (
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
                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)",
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
        <div style={{ marginTop: 50 }}>
          <SiteMark
            site={cta.footer}
            at={AT.site}
            size={40}
            color={GREEN_DEEP}
            starColor={GOLD_DEEP}
          />
        </div>
      </div>
      <Flash at={0} peak={0.6} />
    </AbsoluteFill>
  );
};
