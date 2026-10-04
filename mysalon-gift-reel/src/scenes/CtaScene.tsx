import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Logo, StarMark } from "../components/Brand";
import { GiftCard } from "../components/GiftCard";
import { SendIcon } from "../components/Icons";
import { LogoBadge } from "../components/Logo";
import { Flash, Twinkles } from "../components/Overlays";
import { StarPattern } from "../components/Pattern";
import { Sfx } from "../components/Sfx";
import { Starburst } from "../components/Starburst";
import { SiteMark } from "../components/Text";
import { SANS, SERIF } from "../fonts";
import type { GiftCardContent, GiftReelProps } from "../schema";
import { BEAT } from "../timing";
import { DARK_BG, ROSE, ROSE_SOFT, TEAL, TEAL_SOFT } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const AT = {
  logo: 12,
  card: 8,
  write: 24,
  line1: BEAT * 2,
  line2: BEAT * 3,
  partner: BEAT * 3 + 9,
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

// Bars 14-16 (second drop): the one invite. Offer a beauty moment by writing
// to MySalon.ma; the treatments take place at the partner salon.
export const CtaScene: React.FC<{
  readonly cta: GiftReelProps["cta"];
  readonly card: GiftCardContent;
  readonly partnerLogo: string;
}> = ({ cta, card, partnerLogo }) => {
  const frame = useCurrentFrame();
  const float = Math.sin(frame / 20) * 8;

  return (
    <AbsoluteFill
      name="CTA scene"
      style={{ background: DARK_BG, overflow: "hidden" }}
    >
      <Starburst
        colorA="rgba(159,202,196,0.06)"
        colorB="rgba(159,202,196,0)"
        rays={18}
        opacity={1}
        degreesPerFrame={0.25}
      />
      <StarPattern
        id="cta-pattern"
        color={TEAL_SOFT}
        opacity={0.05}
        size={120}
      />
      <div
        style={{
          position: "absolute",
          right: -330,
          top: -280,
          opacity: 0.05,
          rotate: `${frame * 0.12}deg`,
        }}
      >
        <StarMark size={1000} color="#ffffff" />
      </div>
      <Twinkles
        points={[
          { x: 12, y: 18 },
          { x: 88, y: 24 },
          { x: 10, y: 60 },
          { x: 90, y: 56 },
        ]}
        color={ROSE_SOFT}
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
          top: 186,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ scale: springIn(frame, AT.logo) }}>
          <Logo
            size={62}
            color="#ffffff"
            accent={ROSE_SOFT}
            starColor={TEAL_SOFT}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 540 - 330,
          top: 545 - 206 + float,
          scale: String(0.74 * springIn(frame, AT.card)),
          transform: `perspective(1600px) rotateY(${Math.sin(frame / 26) * 7}deg) rotateX(${Math.cos(frame / 32) * 3}deg)`,
          rotate: `${interpolate(frame, [AT.card, AT.card + 20], [-10, -3], { ...clamp, easing: Easing.out(Easing.cubic) })}deg`,
        }}
      >
        <GiftCard
          id="cta-card"
          content={card}
          partnerLogo={partnerLogo}
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
          top: 760,
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="CTA line 1"
          style={{
            fontFamily: SERIF,
            fontWeight: 900,
            fontSize: 72,
            lineHeight: 1.05,
            color: "#ffffff",
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
            fontFamily: SERIF,
            fontWeight: 900,
            fontSize: 124,
            lineHeight: 1.05,
            color: ROSE_SOFT,
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
        <div
          style={{ marginTop: 22, display: "flex", justifyContent: "center" }}
        >
          <Interactive.Div
            name="CTA partner"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              padding: "8px 26px 8px 8px",
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.08)",
              boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.18)",
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 30,
              color: "#ffffff",
              opacity: interpolate(
                frame,
                [AT.partner, AT.partner + 8],
                [0, 1],
                clamp,
              ),
              translate: interpolate(
                frame,
                [AT.partner, AT.partner + 16],
                ["0px 24px", "0px 0px"],
                {
                  ...clamp,
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
            }}
          >
            <LogoBadge
              image={partnerLogo}
              size={52}
              ring={false}
              ringColor={TEAL}
            />
            {cta.partnerLabel}
          </Interactive.Div>
        </div>
        <Interactive.Div
          name="CTA lead"
          style={{
            marginTop: 40,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 38,
            letterSpacing: "0.01em",
            color: TEAL_SOFT,
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
            marginTop: 22,
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
              backgroundColor: ROSE,
              color: "#ffffff",
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 52,
              boxShadow: "0 26px 60px rgba(232,54,93,0.4)",
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
            <SendIcon size={50} color="#ffffff" />
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
        <div style={{ marginTop: 46 }}>
          <SiteMark
            site={cta.footer}
            at={AT.site}
            size={40}
            color="#ffffff"
            starColor={ROSE_SOFT}
          />
        </div>
      </div>
      <Flash at={0} peak={0.5} />
    </AbsoluteFill>
  );
};
