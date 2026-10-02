import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Logo } from "../components/Brand";
import { Grain, Twinkles, Vignette } from "../components/Overlays";
import { Sfx } from "../components/Sfx";
import { PopLine, RiseLine } from "../components/Text";
import { DISPLAY, SANS, SERIF } from "../fonts";
import type { HappyHoursReelProps } from "../schema";
import { CREAM, GOLD, GOLD_SOFT } from "../theme";

const Half: React.FC<{
  readonly image: string;
  readonly side: "left" | "right";
  readonly focus: string;
}> = ({ image, side, focus }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: side === "left" ? 0 : 540,
        width: 540,
        overflow: "hidden",
      }}
    >
      <Img
        src={staticFile(`images/${image}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: focus,
          scale: String(
            interpolate(frame, [0, 111], [1.12, 1.22], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.33, 0, 0.67, 1),
            }),
          ),
          translate: interpolate(
            frame,
            [0, 111],
            ["0px 0px", side === "left" ? "0px -20px" : "0px 20px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
        }}
      />
    </div>
  );
};

// Bars 1-2: the two salons split the screen, and the whole idea lands in
// three words: HAPPY HOURS BEAUTÉ.
export const HookScene: React.FC<{
  readonly hook: HappyHoursReelProps["hook"];
}> = ({ hook }) => {
  const frame = useCurrentFrame();
  const shake = interpolate(frame, [70, 112], [0, 6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  return (
    <AbsoluteFill name="Hook scene" style={{ backgroundColor: "#0b0f0e" }}>
      <AbsoluteFill
        name="Shake"
        style={{
          translate: `${Math.sin(frame * 12.9) * shake}px ${Math.cos(frame * 7.3) * shake}px`,
        }}
      >
        <Half image={hook.leftImage} side="left" focus="60% 40%" />
        <Half image={hook.rightImage} side="right" focus="50% 30%" />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 538,
            width: 4,
            backgroundColor: GOLD,
            boxShadow: "0 0 24px rgba(196,162,79,0.8)",
            scale: interpolate(frame, [0, 24], ["1 0", "1 1"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        name="Darken"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,12,11,0.55) 0%, rgba(10,12,11,0.35) 40%, rgba(10,12,11,0.5) 60%, rgba(10,12,11,0.88) 100%)",
        }}
      />
      <Vignette />
      <Twinkles
        points={[
          { x: 14, y: 22 },
          { x: 86, y: 26 },
          { x: 22, y: 76 },
          { x: 80, y: 72 },
        ]}
        color={GOLD_SOFT}
      />
      <Sfx name="stamp" at={2} volume={0.8} />
      <Sfx name="stamp" at={9} volume={0.7} />
      <Sfx name="pop" at={18} volume={0.6} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 150,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [24, 36], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Logo size={46} color={CREAM} accent={GOLD} starColor={GOLD} />
      </div>
      <AbsoluteFill
        name="Copy"
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 60px",
          textAlign: "center",
        }}
      >
        <PopLine
          name="Hook line 1"
          text={hook.line1}
          at={2}
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 172,
            lineHeight: 0.95,
            letterSpacing: "0.04em",
            color: CREAM,
            textShadow: "0 16px 50px rgba(0,0,0,0.5)",
          }}
        />
        <PopLine
          name="Hook line 2"
          text={hook.line2}
          at={9}
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 172,
            lineHeight: 0.95,
            letterSpacing: "0.04em",
            color: CREAM,
            textShadow: "0 16px 50px rgba(0,0,0,0.5)",
          }}
        />
        <PopLine
          name="Hook line 3"
          text={hook.line3}
          at={18}
          style={{
            marginTop: 18,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 104,
            lineHeight: 1,
            color: GOLD_SOFT,
            textShadow: "0 12px 40px rgba(0,0,0,0.5)",
          }}
        />
        <RiseLine
          name="Hook subtitle"
          text={hook.subtitle}
          at={58}
          style={{
            marginTop: 64,
            maxWidth: 820,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 42,
            lineHeight: 1.3,
            color: "rgba(248,244,238,0.95)",
            textShadow: "0 8px 30px rgba(0,0,0,0.5)",
          }}
        />
      </AbsoluteFill>
      <Grain />
      <AbsoluteFill
        name="Fade in"
        style={{
          backgroundColor: "#0b0f0e",
          pointerEvents: "none",
          opacity: interpolate(frame, [0, 8], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
