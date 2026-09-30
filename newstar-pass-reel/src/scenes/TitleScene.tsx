import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { LogoBadge } from "../components/Logo";
import { Flash, Twinkles } from "../components/Overlays";
import { Sfx } from "../components/Sfx";
import { Starburst } from "../components/Starburst";
import { PopLine, RiseLine, SiteMark } from "../components/Text";
import { DISPLAY, SANS, SERIF } from "../fonts";
import type { PassReelProps } from "../schema";
import { BLUSH, BLUSH_DEEP, ROSE, PLUM, PLUM_DEEP } from "../theme";

const Pill: React.FC<{ readonly text: string; readonly at: number }> = ({
  text,
  at,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        padding: "16px 34px",
        borderRadius: 999,
        backgroundColor: PLUM,
        color: BLUSH,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 34,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        scale: interpolate(frame, [at, at + 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 12, stiffness: 190, mass: 0.7 }),
          output: "perceptual-scale",
        }),
      }}
    >
      {text}
    </div>
  );
};

// Bars 3-4: the drop. The pass name slams in over a rotating starburst.
export const TitleScene: React.FC<{
  readonly title: PassReelProps["title"];
  readonly logo: string;
  readonly site: string;
}> = ({ title, logo, site }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Title scene"
      style={{
        background: `radial-gradient(70% 45% at 50% 46%, ${BLUSH} 0%, ${BLUSH} 50%, ${BLUSH_DEEP} 100%)`,
        scale: interpolate(frame, [0, 12], [1.06, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }),
      }}
    >
      <Starburst
        colorA="rgba(201,120,140,0.16)"
        colorB="rgba(201,120,140,0)"
        rays={18}
        opacity={1}
        degreesPerFrame={0.35}
      />
      <Sfx name="stamp" at={0} volume={0.8} />
      <Sfx name="stamp" at={6} volume={0.6} />
      <Twinkles
        points={[
          { x: 16, y: 26 },
          { x: 84, y: 22 },
          { x: 14, y: 70 },
          { x: 86, y: 66 },
        ]}
        color={ROSE}
      />
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 150,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: interpolate(frame, [4, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: "0.22em",
            color: PLUM,
          }}
        >
          {title.salon}
        </div>
        <LogoBadge image={logo} size={104} ring={false} />
      </div>
      <AbsoluteFill
        name="Title"
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 0,
          padding: "0 60px",
          textAlign: "center",
        }}
      >
        <PopLine
          name="Title line 1"
          text={title.line1}
          at={0}
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 168,
            lineHeight: 1,
            letterSpacing: "0.06em",
            color: PLUM_DEEP,
          }}
        />
        <PopLine
          name="Title line 2"
          text={title.line2}
          at={6}
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 168,
            lineHeight: 1,
            letterSpacing: "0.06em",
            color: PLUM_DEEP,
            marginTop: -6,
          }}
        />
        <div
          style={{
            width: 220,
            height: 3,
            backgroundColor: ROSE,
            marginTop: 40,
            scale: interpolate(frame, [20, 40], ["0 1", "1 1"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        />
        <RiseLine
          name="Tagline"
          text={title.tagline}
          at={28}
          style={{
            marginTop: 34,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 68,
            lineHeight: 1.1,
            color: PLUM,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 18,
            marginTop: 56,
          }}
        >
          {title.pills.map((pill, i) => (
            <Pill key={pill} text={pill} at={56 + i * 14} />
          ))}
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1440 }}>
        <SiteMark site={site} at={70} size={34} color={PLUM} starColor={ROSE} />
      </div>
      <Flash at={0} peak={0.7} />
    </AbsoluteFill>
  );
};
