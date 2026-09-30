import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { LogoBadge } from "../components/Logo";
import { Flash, Twinkles } from "../components/Overlays";
import { Sfx } from "../components/Sfx";
import { Starburst } from "../components/Starburst";
import { PopLine, RiseLine } from "../components/Text";
import { DISPLAY, SANS } from "../fonts";
import type { PassReelProps } from "../schema";
import { CREAM, CREAM_DEEP, GOLD, GREEN, GREEN_DEEP, RED } from "../theme";

// Bars 16-18: the second drop and the one invite: book now, by DM.
export const CtaScene: React.FC<{
  readonly cta: PassReelProps["cta"];
  readonly handle: string;
  readonly logo: string;
}> = ({ cta, handle, logo }) => {
  const frame = useCurrentFrame();

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
      <Sfx name="stamp" at={8} volume={0.7} />
      <Sfx name="stamp" at={22} volume={0.7} />
      <Sfx name="pop" at={58} volume={0.7} />
      <Twinkles
        points={[
          { x: 14, y: 30 },
          { x: 86, y: 26 },
          { x: 12, y: 66 },
          { x: 88, y: 62 },
        ]}
        color={GOLD}
      />
      <AbsoluteFill
        name="Copy"
        style={{
          alignItems: "center",
          padding: "230px 80px 0",
          textAlign: "center",
        }}
      >
        <div
          style={{
            scale: interpolate(frame, [0, 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 11, stiffness: 160, mass: 0.9 }),
              output: "perceptual-scale",
            }),
          }}
        >
          <LogoBadge image={logo} size={300} ring />
        </div>
        <PopLine
          name="CTA line 1"
          text={cta.line1}
          at={8}
          style={{
            marginTop: 56,
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 96,
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
            marginTop: 14,
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 96,
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
            marginTop: 14,
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 96,
            lineHeight: 1,
            letterSpacing: "0.06em",
            color: GOLD,
          }}
        />
        <div
          style={{
            marginTop: 40,
            padding: "14px 30px",
            borderRadius: 999,
            backgroundColor: RED,
            color: "#ffffff",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            scale: interpolate(frame, [36, 50], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 11, stiffness: 190, mass: 0.7 }),
              output: "perceptual-scale",
            }),
          }}
        >
          {cta.urgency}
        </div>
        <RiseLine
          name="CTA lead"
          text={cta.lead}
          at={48}
          style={{
            marginTop: 44,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 36,
            letterSpacing: "0.04em",
            color: "rgba(31,75,60,0.8)",
          }}
        />
        <div
          style={{
            marginTop: 20,
            scale: interpolate(frame, [56, 72], [0, 1], {
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
              padding: "0 70px",
              height: 130,
              borderRadius: 65,
              backgroundColor: GREEN,
              color: CREAM,
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 50,
              boxShadow: "0 26px 60px rgba(31,75,60,0.35)",
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
        <RiseLine
          name="Handle"
          text={handle}
          at={70}
          style={{
            marginTop: 34,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 54,
            letterSpacing: "-0.01em",
            color: GREEN,
          }}
        />
      </AbsoluteFill>
      <Interactive.Div
        name="Conditions"
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 1436,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: "0.06em",
          color: "rgba(31,75,60,0.75)",
          opacity: interpolate(frame, [86, 98], [0, 1], {
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
