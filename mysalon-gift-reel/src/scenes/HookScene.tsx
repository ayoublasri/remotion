import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { CoBrand, StarMark } from "../components/Brand";
import { foil } from "../components/Icons";
import { LineIcon } from "../components/LineIcons";
import { Grain, Vignette } from "../components/Overlays";
import { StarPattern } from "../components/Pattern";
import { Sfx } from "../components/Sfx";
import { DISPLAY, SANS, SERIF } from "../fonts";
import type { GiftReelProps, Partner } from "../schema";
import { BEAT } from "../timing";
import { DARK_BG, GOLD, GOLD_FOIL, GOLD_LIGHT, IVORY, SAGE } from "../theme";

const ICONS = ["flowers", "perfume", "chocolates"] as const;
const ROW_AT = [0, BEAT, BEAT * 2];
const STRIKE_AT = [BEAT * 3, BEAT * 3 + 5, BEAT * 3 + 10];
const LINE1_AT = BEAT * 4;
const LINE2_AT = BEAT * 4 + 8;
const NAME_AT = BEAT * 5 + 3;
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
      <LineIcon kind={ICONS[index]} at={at} size={132} color={GOLD} />
      <div style={{ position: "relative" }}>
        <Interactive.Div
          name={`Hook item ${index + 1}`}
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 90,
            lineHeight: 1.1,
            color: IVORY,
            whiteSpace: "nowrap",
            opacity: interpolate(
              frame,
              [strikeAt, strikeAt + 10],
              [1, 0.4],
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
            height: 6,
            borderRadius: 3,
            backgroundColor: GOLD,
            boxShadow: "0 0 16px rgba(233,213,166,0.8)",
            transformOrigin: "0% 50%",
            scale: `${interpolate(frame, [strikeAt, strikeAt + 7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) })} 1`,
            rotate: "-3deg",
          }}
        />
      </div>
    </div>
  );
};

// Bars 1-2: the usual gifts get crossed out, then the idea: offer a moment at
// the salon.
export const HookScene: React.FC<{
  readonly hook: GiftReelProps["hook"];
  readonly partner: Partner;
}> = ({ hook, partner }) => {
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
      {ROW_AT.map((at) => (
        <Sfx key={at} name="pop" at={at} volume={0.5} />
      ))}
      {STRIKE_AT.map((at) => (
        <Sfx key={at} name="strike" at={at} volume={0.55} />
      ))}
      <Sfx name="sparkle" at={NAME_AT} volume={0.45} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 172,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [0, 10], [0, 1], clamp),
        }}
      >
        <CoBrand
          logo={partner.logo}
          name={partner.name}
          size={38}
          nameColor={GOLD}
          crossColor={SAGE}
          wordmark={{ color: IVORY, accent: GOLD, star: GOLD }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 500,
          display: "flex",
          flexDirection: "column",
          gap: 34,
          translate: `-50% ${-110 * settle}px`,
          scale: String(1 - 0.14 * settle),
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
          top: 990,
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="Hook line 1"
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 44,
            letterSpacing: "0.04em",
            color: SAGE,
            opacity: interpolate(
              frame,
              [LINE1_AT, LINE1_AT + 8],
              [0, 1],
              clamp,
            ),
            translate: interpolate(
              frame,
              [LINE1_AT, LINE1_AT + 16],
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
            marginTop: 10,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 84,
            lineHeight: 1.1,
            color: IVORY,
            opacity: interpolate(
              frame,
              [LINE2_AT, LINE2_AT + 8],
              [0, 1],
              clamp,
            ),
            translate: interpolate(
              frame,
              [LINE2_AT, LINE2_AT + 16],
              ["0px 30px", "0px 0px"],
              {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
          }}
        >
          {hook.line2}
        </Interactive.Div>
        <Interactive.Div
          name="Hook salon"
          style={{
            marginTop: 6,
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 132,
            lineHeight: 1.1,
            letterSpacing: "0.05em",
            ...foil(GOLD_FOIL),
            backgroundSize: "200% 100%",
            backgroundPosition: `${interpolate(frame, [NAME_AT, NAME_AT + 60], [100, 0], clamp)}% 0%`,
            filter: "drop-shadow(0 0 30px rgba(201,169,110,0.35))",
            opacity: interpolate(frame, [NAME_AT, NAME_AT + 6], [0, 1], clamp),
            scale: interpolate(frame, [NAME_AT, NAME_AT + 18], [0.8, 1], {
              ...clamp,
              easing: Easing.spring({ damping: 13, stiffness: 150, mass: 0.9 }),
              output: "perceptual-scale",
            }),
          }}
        >
          {partner.name}
        </Interactive.Div>
      </div>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};
