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
import { DARK_BG, EMERALD_INK, GOLD, GOLD_LIGHT, IVORY, SAGE } from "../theme";

const ICONS = ["flowers", "perfume", "chocolates"] as const;
// The first row is already on screen at frame 0: the hook reads as a full
// sentence before anyone can scroll away. Then one idea at a time.
const ROW_AT = [-8, 22, 44];
const STRIKE_AT = [64, 72, 80];
const TURN_AT = 92;
const TEASE_AT = 102;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Row: React.FC<{ readonly index: number; readonly text: string }> = ({
  index,
  text,
}) => {
  const frame = useCurrentFrame();
  const at = ROW_AT[index];
  const strikeAt = STRIKE_AT[index];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 30,
        opacity: interpolate(frame, [at, at + 6], [0, 1], clamp),
        translate: interpolate(frame, [at, at + 14], ["0px 46px", "0px 0px"], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <LineIcon kind={ICONS[index]} at={at} size={124} color={GOLD} />
      <div style={{ position: "relative" }}>
        <Interactive.Div
          name={`Hook item ${index + 1}`}
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 94,
            lineHeight: 1.1,
            color: IVORY,
            whiteSpace: "nowrap",
            opacity: interpolate(
              frame,
              [strikeAt, strikeAt + 8],
              [1, 0.42],
              clamp,
            ),
          }}
        >
          {text}
        </Interactive.Div>
        <div
          style={{
            position: "absolute",
            left: -10,
            right: -10,
            top: "54%",
            height: 8,
            borderRadius: 4,
            backgroundColor: GOLD,
            boxShadow: "0 0 18px rgba(233,213,166,0.85)",
            transformOrigin: "0% 50%",
            scale: `${interpolate(frame, [strikeAt, strikeAt + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) })} 1`,
            rotate: "-3deg",
          }}
        />
      </div>
    </div>
  );
};

// Bars 1-2: "ARRÊTE D'OFFRIR des fleurs" on the very first frame, the usual
// gifts crossed out one by one, then the turn: "Cette fois, offrez mieux."
export const HookScene: React.FC<{ readonly hook: GiftReelProps["hook"] }> = ({
  hook,
}) => {
  const frame = useCurrentFrame();
  const settle = interpolate(frame, [TURN_AT - 10, TURN_AT + 10], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const punch = interpolate(frame, [0, 7], [1.14, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      name="Hook scene"
      style={{ background: DARK_BG, overflow: "hidden" }}
    >
      <StarPattern id="hook-pattern" color={GOLD} opacity={0.06} size={120} />
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
      <Sfx name="stamp" at={0} volume={0.6} />
      {ROW_AT.slice(1).map((at) => (
        <Sfx key={at} name="pop" at={at} volume={0.5} />
      ))}
      {STRIKE_AT.map((at) => (
        <Sfx key={at} name="strike" at={at} volume={0.6} />
      ))}
      <Sfx name="whoosh" at={TURN_AT} volume={0.4} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 196,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [0, 8], [0, 1], clamp),
        }}
      >
        <Logo size={52} color={IVORY} accent={GOLD} starColor={GOLD} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          scale: String(punch),
        }}
      >
        <Interactive.Div
          name="Hook stop"
          style={{
            position: "relative",
            padding: "4px 34px 10px",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 168,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: EMERALD_INK,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 18,
              background:
                "linear-gradient(100deg, #b8955a 0%, #e9d5a6 45%, #c9a96e 100%)",
              rotate: "-2deg",
              boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
            }}
          />
          <span style={{ position: "relative" }}>{hook.stop}</span>
        </Interactive.Div>
        <Interactive.Div
          name="Hook lead"
          style={{
            marginTop: 26,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 86,
            lineHeight: 1,
            letterSpacing: "0.03em",
            color: IVORY,
          }}
        >
          {hook.lead}
        </Interactive.Div>
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 760,
          display: "flex",
          flexDirection: "column",
          gap: 28,
          translate: `-50% ${-36 * settle}px`,
          scale: String(1 - 0.16 * settle),
        }}
      >
        {hook.items.map((item, i) => (
          <Row key={item} index={i} text={item} />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: 1250,
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="Hook turn"
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 54,
            letterSpacing: "0.02em",
            color: SAGE,
            opacity: interpolate(frame, [TURN_AT, TURN_AT + 6], [0, 1], clamp),
            translate: interpolate(
              frame,
              [TURN_AT, TURN_AT + 14],
              ["0px 30px", "0px 0px"],
              {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
          }}
        >
          {hook.turn}
        </Interactive.Div>
        <Interactive.Div
          name="Hook tease"
          style={{
            marginTop: 8,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 110,
            lineHeight: 1.1,
            color: GOLD_LIGHT,
            textShadow: "0 0 40px rgba(201,169,110,0.45)",
            opacity: interpolate(
              frame,
              [TEASE_AT, TEASE_AT + 6],
              [0, 1],
              clamp,
            ),
            scale: interpolate(frame, [TEASE_AT, TEASE_AT + 30], [0.86, 1.06], {
              ...clamp,
              easing: Easing.out(Easing.quad),
            }),
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
