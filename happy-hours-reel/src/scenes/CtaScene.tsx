import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Logo } from "../components/Brand";
import { LogoBadge } from "../components/Logo";
import { Flash, Twinkles } from "../components/Overlays";
import { Sfx } from "../components/Sfx";
import { Starburst } from "../components/Starburst";
import { PopLine, RiseLine } from "../components/Text";
import { DISPLAY, SANS } from "../fonts";
import { useLayout } from "../layout";
import type { HappyHoursReelProps, Salon } from "../schema";
import { CREAM, CREAM_DEEP, GOLD, GREEN, GREEN_DEEP } from "../theme";

const SalonChip: React.FC<{ readonly salon: Salon; readonly at: number }> = ({
  salon,
  at,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        padding: "10px 26px 10px 10px",
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.7)",
        boxShadow:
          "0 10px 30px rgba(15,92,87,0.12), 0 0 0 1px rgba(196,162,79,0.35)",
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: 26,
        letterSpacing: "0.08em",
        color: salon.palette.deep,
        whiteSpace: "nowrap",
        scale: interpolate(frame, [at, at + 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 12, stiffness: 180, mass: 0.8 }),
          output: "perceptual-scale",
        }),
      }}
    >
      <LogoBadge image={salon.logo} size={64} ring={false} ringColor={GOLD} />
      {`${salon.name}${salon.nameLine2 === "" ? "" : ` ${salon.nameLine2}`}`}
    </div>
  );
};

// Bars 14-16: the second drop and the one invite: write to us by DM.
export const CtaScene: React.FC<{
  readonly cta: HappyHoursReelProps["cta"];
  readonly salons: Salon[];
}> = ({ cta, salons }) => {
  const frame = useCurrentFrame();
  const { pick } = useLayout();

  return (
    <AbsoluteFill
      name="CTA scene"
      style={{
        background: `radial-gradient(70% 45% at 50% 40%, ${CREAM} 0%, ${CREAM} 50%, ${CREAM_DEEP} 100%)`,
        overflow: "hidden",
        scale: interpolate(frame, [0, 12], [1.06, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }),
      }}
    >
      <Starburst
        colorA="rgba(196,162,79,0.14)"
        colorB="rgba(196,162,79,0)"
        rays={18}
        opacity={1}
        degreesPerFrame={0.3}
      />
      <Sfx name="stamp" at={6} volume={0.7} />
      <Sfx name="stamp" at={14} volume={0.7} />
      <Sfx name="stamp" at={22} volume={0.7} />
      <Sfx name="pop" at={54} volume={0.7} />
      <Twinkles
        points={[
          { x: 14, y: 26 },
          { x: 86, y: 22 },
          { x: 12, y: 66 },
          { x: 88, y: 62 },
        ]}
        color={GOLD}
      />
      <AbsoluteFill
        name="Copy"
        style={{
          alignItems: "center",
          padding: pick("300px 80px 0", "100px 80px 0"),
          textAlign: "center",
        }}
      >
        <div
          style={{
            scale: interpolate(frame, [0, 16], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 11, stiffness: 160, mass: 0.9 }),
              output: "perceptual-scale",
            }),
          }}
        >
          <Logo
            size={pick(78, 62)}
            color={GREEN_DEEP}
            accent={GOLD}
            starColor={GREEN}
          />
        </div>
        <PopLine
          name="CTA line 1"
          text={cta.line1}
          at={6}
          style={{
            marginTop: pick(70, 44),
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: pick(96, 78),
            lineHeight: 1,
            letterSpacing: "0.06em",
            color: GREEN_DEEP,
          }}
        />
        <PopLine
          name="CTA line 2"
          text={cta.line2}
          at={14}
          style={{
            marginTop: pick(14, 10),
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: pick(96, 78),
            lineHeight: 1,
            letterSpacing: "0.06em",
            color: GREEN_DEEP,
          }}
        />
        <PopLine
          name="CTA line 3"
          text={cta.line3}
          at={22}
          style={{
            marginTop: pick(14, 10),
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: pick(96, 78),
            lineHeight: 1,
            letterSpacing: "0.06em",
            color: GOLD,
          }}
        />
        <RiseLine
          name="CTA lead"
          text={cta.lead}
          at={40}
          style={{
            marginTop: pick(54, 36),
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: pick(36, 30),
            letterSpacing: "0.04em",
            color: "rgba(11,63,58,0.8)",
          }}
        />
        <div
          style={{
            marginTop: pick(22, 16),
            scale: interpolate(frame, [52, 68], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 11, stiffness: 170, mass: 0.8 }),
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
              padding: pick("0 70px", "0 56px"),
              height: pick(130, 108),
              borderRadius: 65,
              backgroundColor: GREEN,
              color: CREAM,
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: pick(50, 42),
              boxShadow: "0 26px 60px rgba(15,92,87,0.35)",
              scale: interpolate(frame % 14, [0, 3, 11], [1.04, 1.025, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <svg
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              stroke={CREAM}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2 11 13" />
              <path d="m22 2-7 20-4-9-9-4 20-7z" />
            </svg>
            {cta.button}
            <div
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
                  [84, 108],
                  ["-200px 0px", "900px 0px"],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.4, 0, 0.4, 1),
                  },
                ),
              }}
            />
          </Interactive.Div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 18,
            marginTop: pick(56, 34),
          }}
        >
          <SalonChip salon={salons[0]} at={70} />
          <SalonChip salon={salons[1]} at={78} />
        </div>
      </AbsoluteFill>
      <Interactive.Div
        name="Conditions"
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: pick(1300, 1060),
          textAlign: "center",
          whiteSpace: "pre-line",
          lineHeight: 1.7,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: pick(27, 24),
          letterSpacing: "0.06em",
          color: "rgba(11,63,58,0.75)",
          opacity: interpolate(frame, [90, 102], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {cta.conditions}
      </Interactive.Div>
      <Flash at={0} peak={0.7} />
    </AbsoluteFill>
  );
};
