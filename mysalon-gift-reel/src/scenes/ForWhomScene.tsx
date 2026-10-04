import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Heart } from "../components/Icons";
import { Twinkles } from "../components/Overlays";
import { Sfx } from "../components/Sfx";
import { DISPLAY, SCRIPT, SERIF } from "../fonts";
import type { GiftReelProps } from "../schema";
import { BEAT } from "../timing";
import { EMERALD_INK, GOLD, GOLD_LIGHT, IVORY } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const NAME_AT = [3, 25, 47];
const FLOURISH_AT = BEAT * 4;
const PAYOFF_AT = BEAT * 4 + 6;
const PAYOFF2_AT = BEAT * 5;

const Name: React.FC<{ readonly text: string; readonly at: number }> = ({
  text,
  at,
}) => {
  const frame = useCurrentFrame();
  const write = interpolate(frame, [at, at + 16], [0, 100], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <Interactive.Div
      name={`Name ${text}`}
      style={{
        fontFamily: SCRIPT,
        fontSize: Math.min(132, Math.round(2400 / text.length)),
        lineHeight: 1.18,
        color: IVORY,
        whiteSpace: "nowrap",
        padding: "0 30px",
        clipPath: `inset(-20% ${100 - write}% -20% 0%)`,
        opacity: interpolate(
          frame,
          [PAYOFF_AT, PAYOFF_AT + 14],
          [1, 0.55],
          clamp,
        ),
      }}
    >
      {text}
    </Interactive.Div>
  );
};

// Bars 6-7: who it is for. Three names written by hand, then "just because".
export const ForWhomScene: React.FC<{
  readonly forWhom: GiftReelProps["forWhom"];
}> = ({ forWhom }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [FLOURISH_AT, FLOURISH_AT + 16], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill name="For whom scene" style={{ overflow: "hidden" }}>
      <Backdrop
        image={forWhom.backdrop}
        blur={28}
        tint="rgba(8,34,28,0.86)"
        base={EMERALD_INK}
      />
      {NAME_AT.map((at) => (
        <Sfx key={at} name="tick" at={at} volume={0.5} />
      ))}
      <Sfx name="sparkle" at={PAYOFF2_AT} volume={0.4} />
      <Twinkles
        points={[
          { x: 14, y: 30 },
          { x: 86, y: 36 },
          { x: 18, y: 72 },
          { x: 84, y: 70 },
        ]}
        color={GOLD}
      />
      <AbsoluteFill
        style={{ alignItems: "center", paddingTop: 420, textAlign: "center" }}
      >
        <Interactive.Div
          name="For whom label"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 46,
            letterSpacing: "0.32em",
            marginRight: "-0.32em",
            color: GOLD,
            marginBottom: 26,
            opacity: interpolate(frame, [0, 8], [0, 1], clamp),
          }}
        >
          {forWhom.label}
        </Interactive.Div>
        {forWhom.names.map((name, i) => (
          <Name key={name} text={name} at={NAME_AT[i]} />
        ))}
        <svg
          width="620"
          height="60"
          viewBox="0 0 620 60"
          style={{ marginTop: 36, overflow: "visible" }}
        >
          <path
            d="M20 30 L262 30"
            stroke={GOLD}
            strokeWidth="2.4"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={draw - 1}
          />
          <path
            d="M358 30 L600 30"
            stroke={GOLD}
            strokeWidth="2.4"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - draw}
          />
          <g
            style={{
              transformOrigin: "310px 30px",
              scale: interpolate(
                frame,
                [FLOURISH_AT + 6, FLOURISH_AT + 18],
                [0, 1],
                {
                  ...clamp,
                  easing: Easing.spring({
                    damping: 9,
                    stiffness: 200,
                    mass: 0.6,
                  }),
                  output: "perceptual-scale",
                },
              ),
            }}
          >
            <foreignObject x="286" y="6" width="48" height="48">
              <Heart size={48} color={GOLD} />
            </foreignObject>
          </g>
        </svg>
        <Interactive.Div
          name="Payoff 1"
          style={{
            marginTop: 30,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 62,
            lineHeight: 1.1,
            color: "rgba(248,243,234,0.86)",
            opacity: interpolate(
              frame,
              [PAYOFF_AT, PAYOFF_AT + 8],
              [0, 1],
              clamp,
            ),
            translate: interpolate(
              frame,
              [PAYOFF_AT, PAYOFF_AT + 16],
              ["0px 30px", "0px 0px"],
              {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
          }}
        >
          {forWhom.payoff1}
        </Interactive.Div>
        <Interactive.Div
          name="Payoff 2"
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 112,
            lineHeight: 1.1,
            color: GOLD_LIGHT,
            textShadow: "0 0 40px rgba(201,169,110,0.45)",
            opacity: interpolate(
              frame,
              [PAYOFF2_AT, PAYOFF2_AT + 8],
              [0, 1],
              clamp,
            ),
            scale: interpolate(frame, [PAYOFF2_AT, PAYOFF2_AT + 18], [0.8, 1], {
              ...clamp,
              easing: Easing.spring({ damping: 12, stiffness: 160, mass: 0.8 }),
              output: "perceptual-scale",
            }),
          }}
        >
          {forWhom.payoff2}
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
