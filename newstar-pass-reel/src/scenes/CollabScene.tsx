import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { LogoBadge } from "../components/Logo";
import { Flash, Star, Twinkles } from "../components/Overlays";
import { Sfx } from "../components/Sfx";
import { PopLine, RiseLine } from "../components/Text";
import { DISPLAY, SERIF } from "../fonts";
import type { PassReelProps } from "../schema";
import { BLUSH, PLUM, PLUM_DEEP, ROSE_SOFT } from "../theme";

// Bars 3-4: who delivers the services. "En collaboration avec New Star Beauty,
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
        background: `radial-gradient(80% 55% at 50% 40%, ${PLUM} 0%, ${PLUM_DEEP} 100%)`,
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
        color={ROSE_SOFT}
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
            color: ROSE_SOFT,
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
          <LogoBadge image={logo} size={400} ring />
        </div>
        <PopLine
          name="Collab name"
          text={collab.name}
          at={26}
          style={{
            marginTop: 44,
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 108,
            lineHeight: 1,
            letterSpacing: "0.1em",
            paddingLeft: "0.1em",
            color: BLUSH,
          }}
        />
        {collab.nameLine2 === "" ? null : (
          <PopLine
            name="Collab name line 2"
            text={collab.nameLine2}
            at={32}
            style={{
              marginTop: 10,
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: 108,
              lineHeight: 1,
              letterSpacing: "0.1em",
              paddingLeft: "0.1em",
              color: BLUSH,
            }}
          />
        )}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            fontFamily: DISPLAY,
            fontWeight: 600,
            fontSize: 40,
            letterSpacing: "0.34em",
            paddingLeft: "0.34em",
            color: ROSE_SOFT,
            opacity: interpolate(frame, [42, 50], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [42, 58], ["0px 30px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          <Star size={28} color={ROSE_SOFT} />
          {collab.city}
          <Star size={28} color={ROSE_SOFT} />
        </div>
        <RiseLine
          name="Collab outro"
          text={collab.outro}
          at={70}
          style={{
            marginTop: 64,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 70,
            lineHeight: 1.1,
            color: BLUSH,
          }}
        />
      </AbsoluteFill>
      <Flash at={0} peak={0.35} />
    </AbsoluteFill>
  );
};
