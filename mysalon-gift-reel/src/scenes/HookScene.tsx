import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Logo, StarMark } from "../components/Brand";
import { LineIcon } from "../components/LineIcons";
import { Grain, Vignette } from "../components/Overlays";
import { StarPattern } from "../components/Pattern";
import { Sfx } from "../components/Sfx";
import { SANS, SERIF } from "../fonts";
import type { GiftReelProps } from "../schema";
import { BEAT } from "../timing";
import { BLUSH, DARK_BG, ROSE_SOFT, TEAL_SOFT } from "../theme";

const ICONS = ["flowers", "perfume", "chocolates"] as const;
const ROW_AT = [0, BEAT, BEAT * 2];
const STRIKE_AT = [BEAT * 3, BEAT * 3 + 5, BEAT * 3 + 10];
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Row: React.FC<{
  readonly index: number;
  readonly text: string;
}> = ({ index, text }) => {
  const frame = useCurrentFrame();
  const at = ROW_AT[index];
  const strikeAt = STRIKE_AT[index];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 34,
        opacity: interpolate(frame, [at, at + 6], [0, 1], clamp),
        translate: interpolate(frame, [at, at + 16], ["0px 50px", "0px 0px"], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <LineIcon kind={ICONS[index]} at={at} size={132} color={ROSE_SOFT} />
      <div style={{ position: "relative" }}>
        <Interactive.Div
          name={`Hook item ${index + 1}`}
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 90,
            lineHeight: 1.1,
            color: BLUSH,
            whiteSpace: "nowrap",
            opacity: interpolate(
              frame,
              [strikeAt, strikeAt + 10],
              [1, 0.45],
              clamp,
            ),
          }}
        >
          {text}
        </Interactive.Div>
        <div
          style={{
            position: "absolute",
            left: -8,
            right: -8,
            top: "54%",
            height: 7,
            borderRadius: 4,
            backgroundColor: ROSE_SOFT,
            boxShadow: "0 0 16px rgba(244,124,151,0.8)",
            transformOrigin: "0% 50%",
            scale: `${interpolate(frame, [strikeAt, strikeAt + 7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) })} 1`,
            rotate: "-3deg",
          }}
        />
      </div>
    </div>
  );
};

// Bars 1-2: the usual gifts get crossed out, then the idea.
export const HookScene: React.FC<{ readonly hook: GiftReelProps["hook"] }> = ({
  hook,
}) => {
  const frame = useCurrentFrame();
  const settle = interpolate(frame, [BEAT * 4 - 2, BEAT * 4 + 16], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

  return (
    <AbsoluteFill
      name="Hook scene"
      style={{ background: DARK_BG, overflow: "hidden" }}
    >
      <StarPattern
        id="hook-pattern"
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
      {ROW_AT.map((at) => (
        <Sfx key={at} name="pop" at={at} volume={0.5} />
      ))}
      {STRIKE_AT.map((at) => (
        <Sfx key={at} name="strike" at={at} volume={0.55} />
      ))}
      <Sfx name="sparkle" at={BEAT * 5} volume={0.35} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 176,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [0, 10], [0, 1], clamp),
        }}
      >
        <Logo
          size={58}
          color="#ffffff"
          accent={ROSE_SOFT}
          starColor={TEAL_SOFT}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 520,
          display: "flex",
          flexDirection: "column",
          gap: 34,
          translate: `-50% ${-90 * settle}px`,
          scale: String(1 - 0.12 * settle),
        }}
      >
        {hook.items.map((item, i) => (
          <Row key={item} index={i} text={item} />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 1130,
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="Hook line 1"
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 46,
            letterSpacing: "0.04em",
            color: BLUSH,
            opacity: interpolate(
              frame,
              [BEAT * 4, BEAT * 4 + 8],
              [0, 1],
              clamp,
            ),
            translate: interpolate(
              frame,
              [BEAT * 4, BEAT * 4 + 16],
              ["0px 30px", "0px 0px"],
              {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
          }}
        >
          {hook.line1}
        </Interactive.Div>
        <Interactive.Div
          name="Hook line 2"
          style={{
            marginTop: 14,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 92,
            lineHeight: 1.08,
            color: ROSE_SOFT,
            textShadow: "0 0 40px rgba(232,54,93,0.45)",
            opacity: interpolate(
              frame,
              [BEAT * 5, BEAT * 5 + 8],
              [0, 1],
              clamp,
            ),
            scale: interpolate(frame, [BEAT * 5, BEAT * 5 + 18], [0.86, 1], {
              ...clamp,
              easing: Easing.spring({ damping: 14, stiffness: 150, mass: 0.9 }),
              output: "perceptual-scale",
            }),
            filter: `blur(${interpolate(frame, [BEAT * 5, BEAT * 5 + 10], [10, 0], clamp)}px)`,
          }}
        >
          {hook.line2}
        </Interactive.Div>
      </div>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};
