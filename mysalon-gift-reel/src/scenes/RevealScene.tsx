import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Logo } from "../components/Brand";
import { GiftCard } from "../components/GiftCard";
import { BoxBody, BoxLid, Burst } from "../components/GiftBox";
import { Twinkles } from "../components/Overlays";
import { StarPattern } from "../components/Pattern";
import { Sfx } from "../components/Sfx";
import { Starburst } from "../components/Starburst";
import { SANS, SERIF } from "../fonts";
import type { GiftCardContent, GiftReelProps, Partner } from "../schema";
import { BEAT } from "../timing";
import { EMERALD_DEEP, GOLD, GOLD_DEEP, IVORY, LIGHT_BG } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const BOX_LEFT = 310;
const BOX_TOP = 1000;
const BOX_WIDTH = 460;
const BOX_HEIGHT = 340;
const LID_AT = BEAT * 2;
const RISE_FROM = LID_AT + 4;
const RISE_TO = RISE_FROM + 30;
const CARD_Y = 720;

// Bars 3-5 (the drop): a gift box wiggles, the lid pops, and the gift card
// floats out with someone's name being written on it.
export const RevealScene: React.FC<{
  readonly reveal: GiftReelProps["reveal"];
  readonly card: GiftCardContent;
  readonly partner: Partner;
}> = ({ reveal, card, partner }) => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, 18], [0, 1], {
    ...clamp,
    easing: Easing.spring({ damping: 13, stiffness: 120, mass: 0.9 }),
  });
  const wiggle =
    frame >= 14 && frame < LID_AT
      ? Math.sin(((frame - 14) / 3) * Math.PI) *
        interpolate(frame, [14, 20, LID_AT], [0, 5, 7], clamp)
      : 0;
  const sink = interpolate(frame, [RISE_FROM + 14, RISE_FROM + 44], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.55, 0, 0.75, 0.4),
  });
  const lidUp = interpolate(frame, [LID_AT, LID_AT + 26], [0, 1], {
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
      ? Math.sin((frame - RISE_TO) / 22) * 9
      : interpolate(rise, [0, 1], [-25, 0]);
  const tiltX =
    frame > RISE_TO
      ? Math.cos((frame - RISE_TO) / 28) * 4 - 4
      : interpolate(rise, [0, 1], [35, 0]);
  const halo = interpolate(frame, [LID_AT, LID_AT + 24], [0, 1], clamp);
  const cardInFront = frame >= RISE_FROM + 16;

  const giftCard = (
    <div
      style={{
        position: "absolute",
        left: 540 - 330,
        top: cardY - 206,
        scale: String(cardScale),
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
        recipient={reveal.recipient}
        writeAt={BEAT * 5}
        shineAt={BEAT * 4 + 8}
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
      <Sfx name="tick" at={16} volume={0.45} />
      <Sfx name="tick" at={22} volume={0.45} />
      <Sfx name="sparkle" at={LID_AT} volume={0.6} />
      <Sfx name="whoosh" at={RISE_FROM} volume={0.35} />
      <Sfx name="pop" at={BEAT * 6} volume={0.4} />
      <AbsoluteFill
        style={{ opacity: halo, translate: `0px ${cardY - 960}px` }}
      >
        <Starburst
          colorA="rgba(201,169,110,0.12)"
          colorB="rgba(201,169,110,0)"
          rays={16}
          opacity={1}
          degreesPerFrame={0.25}
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
          { x: 16, y: 24 },
          { x: 84, y: 30 },
          { x: 12, y: 50 },
          { x: 88, y: 48 },
        ]}
        color={GOLD}
      />
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
            [LID_AT + 14, LID_AT + 26],
            [1, 0],
            clamp,
          ),
        }}
      >
        <BoxLid width={BOX_WIDTH + 40} height={100} />
      </div>
      <Burst at={LID_AT} x={540} y={BOX_TOP - 30} count={30} />
      {cardInFront ? giftCard : null}
      <div
        style={{
          position: "absolute",
          left: 50,
          right: 50,
          top: 1020,
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="Reveal line 1"
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 70,
            lineHeight: 1.15,
            color: EMERALD_DEEP,
            opacity: interpolate(
              frame,
              [BEAT * 6, BEAT * 6 + 8],
              [0, 1],
              clamp,
            ),
            translate: interpolate(
              frame,
              [BEAT * 6, BEAT * 6 + 16],
              ["0px 40px", "0px 0px"],
              {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
          }}
        >
          {reveal.line1}
        </Interactive.Div>
        <Interactive.Div
          name="Reveal line 2"
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 70,
            lineHeight: 1.15,
            color: GOLD_DEEP,
            opacity: interpolate(
              frame,
              [BEAT * 7, BEAT * 7 + 8],
              [0, 1],
              clamp,
            ),
            translate: interpolate(
              frame,
              [BEAT * 7, BEAT * 7 + 16],
              ["0px 40px", "0px 0px"],
              {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
          }}
        >
          {reveal.line2}
        </Interactive.Div>
        <div
          style={{
            marginTop: 54,
            display: "inline-flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 18,
            padding: "20px 40px",
            borderRadius: 999,
            backgroundColor: EMERALD_DEEP,
            boxShadow:
              "0 18px 40px rgba(8,34,28,0.25), inset 0 0 0 1.5px rgba(201,169,110,0.6)",
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 32,
            color: IVORY,
            opacity: interpolate(
              frame,
              [BEAT * 8, BEAT * 8 + 6],
              [0, 1],
              clamp,
            ),
            scale: interpolate(frame, [BEAT * 8, BEAT * 8 + 14], [0.7, 1], {
              ...clamp,
              easing: Easing.spring({ damping: 12, stiffness: 180, mass: 0.8 }),
              output: "perceptual-scale",
            }),
          }}
        >
          {reveal.bookOn}
          <Logo size={38} color={IVORY} accent={GOLD} starColor={GOLD} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
