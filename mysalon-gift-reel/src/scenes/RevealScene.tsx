import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { GiftCard } from "../components/GiftCard";
import { BoxBody, BoxLid, Burst } from "../components/GiftBox";
import { Flash, Twinkles } from "../components/Overlays";
import { StarPattern } from "../components/Pattern";
import { Sfx } from "../components/Sfx";
import { Starburst } from "../components/Starburst";
import { DISPLAY, SERIF } from "../fonts";
import type { GiftCardContent, GiftReelProps, Partner } from "../schema";
import { BEAT } from "../timing";
import { EMERALD_DEEP, GOLD, GOLD_DEEP, LIGHT_BG } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const BOX_LEFT = 310;
const BOX_TOP = 1080;
const BOX_WIDTH = 460;
const BOX_HEIGHT = 340;
const LID_AT = BEAT;
const RISE_FROM = LID_AT + 4;
const RISE_TO = RISE_FROM + 26;
const CARD_Y = 840;
const NAMES_AT = BEAT * 3;
const CAPTION_AT = BEAT * 4;

// Bars 3-4 (the drop): "UNE VRAIE EXPÉRIENCE" slams in, the gift box pops
// open and the gift card floats out, its name rewritten on every beat
// (Maman, Ma chérie, Ma best...): whoever is watching sees their person.
export const RevealScene: React.FC<{
  readonly reveal: GiftReelProps["reveal"];
  readonly card: GiftCardContent;
  readonly partner: Partner;
}> = ({ reveal, card, partner }) => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, 12], [0, 1], {
    ...clamp,
    easing: Easing.spring({ damping: 13, stiffness: 140, mass: 0.8 }),
  });
  const wiggle =
    frame >= 6 && frame < LID_AT
      ? Math.sin(((frame - 6) / 2.5) * Math.PI) * 6
      : 0;
  const sink = interpolate(frame, [RISE_FROM + 12, RISE_FROM + 36], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.55, 0, 0.75, 0.4),
  });
  const lidUp = interpolate(frame, [LID_AT, LID_AT + 22], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const rise = interpolate(frame, [RISE_FROM, RISE_TO], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.2, 0.9, 0.3, 1),
  });
  const cardY = interpolate(rise, [0, 1], [BOX_TOP + 170, CARD_Y]);
  const cardScale = interpolate(rise, [0, 1], [0.6, 1]);
  const tiltY =
    frame > RISE_TO
      ? Math.sin((frame - RISE_TO) / 20) * 8
      : interpolate(rise, [0, 1], [-25, 0]);
  const tiltX =
    frame > RISE_TO
      ? Math.cos((frame - RISE_TO) / 26) * 4 - 4
      : interpolate(rise, [0, 1], [35, 0]);
  const halo = interpolate(frame, [LID_AT, LID_AT + 20], [0, 1], clamp);
  const cardInFront = frame >= RISE_FROM + 14;
  // A little zoom punch on every name change.
  const sinceName = (frame - NAMES_AT) % BEAT;
  const namePunch =
    frame >= NAMES_AT ? interpolate(sinceName, [0, 6], [1.035, 1], clamp) : 1;

  const giftCard = (
    <div
      style={{
        position: "absolute",
        left: 540 - 330,
        top: cardY - 206,
        scale: String(cardScale * namePunch * 1.12),
        transform: `perspective(1600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        opacity: interpolate(frame, [RISE_FROM, RISE_FROM + 3], [0, 1], clamp),
      }}
    >
      <GiftCard
        id="reveal-card"
        content={card}
        logo={partner.logo}
        name={partner.name}
        city={partner.city}
        recipients={reveal.names}
        writeAt={NAMES_AT}
        writeEvery={BEAT}
        shineAt={RISE_TO + 2}
        recipientSize={66}
      />
    </div>
  );

  return (
    <AbsoluteFill
      name="Reveal scene"
      style={{ background: LIGHT_BG, overflow: "hidden" }}
    >
      <StarPattern id="reveal-pattern" color={GOLD} opacity={0.08} size={120} />
      <Sfx name="sparkle" at={LID_AT} volume={0.4} />
      <Sfx name="whoosh" at={RISE_FROM} volume={0.25} />
      {reveal.names.map((n, i) => (
        <Sfx key={n} name="tick" at={NAMES_AT + i * BEAT} volume={0.45} />
      ))}
      <AbsoluteFill
        style={{ opacity: halo, translate: `0px ${cardY - 960}px` }}
      >
        <Starburst
          colorA="rgba(201,169,110,0.12)"
          colorB="rgba(201,169,110,0)"
          rays={16}
          opacity={1}
          degreesPerFrame={0.3}
        />
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,250,236,0.95) 0%, rgba(255,250,236,0) 32%)",
          }}
        />
      </AbsoluteFill>
      <Twinkles
        points={[
          { x: 14, y: 36 },
          { x: 86, y: 40 },
          { x: 10, y: 58 },
          { x: 90, y: 56 },
        ]}
        color={GOLD}
      />
      <div
        style={{
          position: "absolute",
          left: 30,
          right: 30,
          top: 210,
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="Reveal line 1"
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 80,
            lineHeight: 1.05,
            color: GOLD_DEEP,
            scale: interpolate(frame, [0, 10], [1.4, 1], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            }),
          }}
        >
          {reveal.line1}
        </Interactive.Div>
        <Interactive.Div
          name="Reveal line 2"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 118,
            lineHeight: 1.1,
            letterSpacing: "0.03em",
            color: EMERALD_DEEP,
            scale: interpolate(frame, [2, 12], [1.6, 1], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            }),
          }}
        >
          {reveal.line2}
        </Interactive.Div>
      </div>
      {cardInFront ? null : giftCard}
      <div
        style={{
          position: "absolute",
          left: BOX_LEFT,
          top: BOX_TOP,
          translate: `0px ${(1 - enter) * 700 + sink * 1100}px`,
          rotate: `${wiggle * 0.6}deg`,
          transformOrigin: "50% 100%",
          opacity: 1 - sink,
        }}
      >
        <BoxBody width={BOX_WIDTH} height={BOX_HEIGHT} />
      </div>
      <div
        style={{
          position: "absolute",
          left: BOX_LEFT - 20,
          top: BOX_TOP - 80,
          translate: `${lidUp * 260}px ${(1 - enter) * 700 + sink * 1100 - lidUp * 900 + (frame < LID_AT ? -Math.abs(wiggle) * 2 : 0)}px`,
          rotate: `${wiggle + lidUp * 38}deg`,
          opacity: interpolate(
            frame,
            [LID_AT + 12, LID_AT + 22],
            [1, 0],
            clamp,
          ),
        }}
      >
        <BoxLid width={BOX_WIDTH + 40} height={100} />
      </div>
      <Burst at={LID_AT} x={540} y={BOX_TOP - 30} count={30} />
      {cardInFront ? giftCard : null}
      <Interactive.Div
        name="Reveal caption"
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: 1110,
          textAlign: "center",
          fontFamily: SERIF,
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 76,
          color: EMERALD_DEEP,
          opacity: interpolate(
            frame,
            [CAPTION_AT, CAPTION_AT + 6],
            [0, 1],
            clamp,
          ),
          translate: interpolate(
            frame,
            [CAPTION_AT, CAPTION_AT + 14],
            ["0px 36px", "0px 0px"],
            {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        {reveal.caption}
      </Interactive.Div>
      <Flash at={1} peak={0.55} />
    </AbsoluteFill>
  );
};
