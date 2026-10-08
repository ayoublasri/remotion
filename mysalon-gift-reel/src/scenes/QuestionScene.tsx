import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Logo, StarMark } from "../components/Brand";
import { Grain, Twinkles, Vignette } from "../components/Overlays";
import { StarPattern } from "../components/Pattern";
import { Sfx } from "../components/Sfx";
import { SERIF } from "../fonts";
import { SAFE } from "../layout";
import type { GiftReelProps } from "../schema";
import { DARK_BG, GOLD, GOLD_LIGHT, IVORY } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const LINE2_AT = 6;
const RULE_AT = 16;
const TEASE_AT = 66;

// Scene 1: the question, readable on the first frame. "Vous ne savez pas
// quoi lui offrir ?", a gold rule, then "Nous avons une idée…" as the bridge
// to the answer.
export const QuestionScene: React.FC<{
  readonly hook: GiftReelProps["hook"];
}> = ({ hook }) => {
  const frame = useCurrentFrame();
  const settle = (at: number, from: number) =>
    interpolate(frame, [at, at + 14], [from, 1], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    });

  return (
    <AbsoluteFill
      name="Question scene"
      style={{ background: DARK_BG, overflow: "hidden" }}
    >
      <StarPattern
        id="question-pattern"
        color={GOLD}
        opacity={0.06}
        size={120}
      />
      <div
        style={{
          position: "absolute",
          right: -330,
          top: -280,
          opacity: 0.04,
          rotate: `${frame * 0.12}deg`,
        }}
      >
        <StarMark size={1000} color={GOLD_LIGHT} />
      </div>
      <Twinkles
        points={[
          { x: 14, y: 30 },
          { x: 86, y: 26 },
          { x: 11, y: 58 },
          { x: 88, y: 54 },
        ]}
        color={GOLD}
      />
      <Sfx name="whoosh" at={0} volume={0.25} />
      <Sfx name="pop" at={LINE2_AT} volume={0.4} />
      <Sfx name="sparkle" at={TEASE_AT} volume={0.35} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: SAFE.top + 10,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [0, 8], [0, 1], clamp),
        }}
      >
        <Logo size={54} color={IVORY} accent={GOLD} starColor={GOLD} />
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          right: 1080 - SAFE.right,
          top: 620,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="Question line 1"
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 80,
            lineHeight: 1.1,
            color: IVORY,
            scale: settle(0, 1.12),
          }}
        >
          {hook.line1}
        </Interactive.Div>
        <Interactive.Div
          name="Question line 2"
          style={{
            marginTop: 6,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 94,
            lineHeight: 1.1,
            color: GOLD_LIGHT,
            textShadow: "0 0 40px rgba(201,169,110,0.35)",
            scale: settle(LINE2_AT, 1.2),
            opacity: interpolate(
              frame,
              [LINE2_AT, LINE2_AT + 5],
              [0, 1],
              clamp,
            ),
          }}
        >
          {hook.line2}
        </Interactive.Div>
        <div
          style={{
            marginTop: 44,
            width: 120,
            height: 2,
            backgroundColor: GOLD,
            scale: `${interpolate(frame, [RULE_AT, RULE_AT + 16], [0, 1], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            })} 1`,
          }}
        />
        <Interactive.Div
          name="Question tease"
          style={{
            marginTop: 40,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 54,
            color: GOLD_LIGHT,
            opacity: interpolate(
              frame,
              [TEASE_AT, TEASE_AT + 6],
              [0, 1],
              clamp,
            ),
            translate: interpolate(
              frame,
              [TEASE_AT, TEASE_AT + 16],
              ["0px 36px", "0px 0px"],
              { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) },
            ),
          }}
        >
          {hook.tease}
        </Interactive.Div>
      </div>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};
