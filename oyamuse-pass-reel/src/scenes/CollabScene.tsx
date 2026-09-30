import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { LogoBadge } from "../components/Logo";
import { Flash, Star, Twinkles } from "../components/Overlays";
import { Sfx } from "../components/Sfx";
import { PopLine, RiseLine } from "../components/Text";
import { DISPLAY, SERIF } from "../fonts";
import type { PassReelProps } from "../schema";
import { CREAM, GOLD, GREEN, GREEN_DEEP } from "../theme";

// Bars 3-4: who delivers the services. "En collaboration avec OYA MUSE,
// Témara, nous vous offrons le..." and the title slams in on the next downbeat.
export const CollabScene: React.FC<{
  readonly collab: PassReelProps["collab"];
  readonly logo: string;
}> = ({ collab, logo }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Collab scene"
      style={{
        background: `radial-gradient(80% 55% at 50% 40%, ${GREEN} 0%, ${GREEN_DEEP} 100%)`,
        scale: interpolate(frame, [0, 12], [1.05, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }),
      }}
    >
      <Twinkles
        points={[
          { x: 10, y: 14 },
          { x: 90, y: 12 },
          { x: 8, y: 84 },
          { x: 92, y: 80 },
        ]}
        color={GOLD}
      />
      <Sfx name="whoosh" at={0} volume={0.5} />
      <Sfx name="stamp" at={12} volume={0.7} />
      <AbsoluteFill
        name="Copy"
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          textAlign: "center",
        }}
      >
        <RiseLine
          name="Collab intro"
          text={collab.intro}
          at={2}
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            fontSize: 36,
            letterSpacing: "0.4em",
            paddingLeft: "0.4em",
            color: GOLD,
          }}
        />
        <div
          style={{
            marginTop: 44,
            scale: interpolate(frame, [10, 28], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 11, stiffness: 160, mass: 0.9 }),
              output: "perceptual-scale",
            }),
          }}
        >
          <LogoBadge image={logo} size={420} ring />
        </div>
        <PopLine
          name="Collab name"
          text={collab.name}
          at={26}
          style={{
            marginTop: 48,
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 116,
            lineHeight: 1,
            letterSpacing: "0.1em",
            paddingLeft: "0.1em",
            color: CREAM,
          }}
        />
        <div
          style={{
            marginTop: 22,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            fontFamily: DISPLAY,
            fontWeight: 600,
            fontSize: 44,
            letterSpacing: "0.4em",
            paddingLeft: "0.4em",
            color: GOLD,
            opacity: interpolate(frame, [38, 46], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [38, 54], ["0px 30px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          <Star size={30} color={GOLD} />
          {collab.city}
          <Star size={30} color={GOLD} />
        </div>
        <RiseLine
          name="Collab outro"
          text={collab.outro}
          at={70}
          style={{
            marginTop: 72,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 72,
            lineHeight: 1.1,
            color: CREAM,
          }}
        />
      </AbsoluteFill>
      <Flash at={0} peak={0.35} />
    </AbsoluteFill>
  );
};
