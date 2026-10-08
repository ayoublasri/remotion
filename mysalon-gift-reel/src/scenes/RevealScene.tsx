import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { GiftCard } from "../components/GiftCard";
import { BoxBody, BoxLid, Burst } from "../components/GiftBox";
import { LogoBadge } from "../components/Logo";
import { Flash, Twinkles } from "../components/Overlays";
import { StarPattern } from "../components/Pattern";
import { Sfx } from "../components/Sfx";
import { Starburst } from "../components/Starburst";
import { DISPLAY, SCRIPT, SERIF } from "../fonts";
import { SAFE } from "../layout";
import type { GiftCardContent, GiftReelProps, Partner } from "../schema";
import { EMERALD_DEEP, GOLD, GOLD_DEEP, IVORY, LIGHT_BG } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const BOX_LEFT = 310;
const BOX_TOP = 1060;
const BOX_WIDTH = 460;
const BOX_HEIGHT = 340;
const LID_AT = 15;
const RISE_FROM = LID_AT + 4;
const RISE_TO = RISE_FROM + 26;
const CARD_Y = 870;
const WORDS_AT = 30;
const WORD_EVERY = 30;
const SALON_AT = 56;
const WORD_SLOT = 430;

// Scene 2, the answer: "Offrez une expérience beauté à votre maman / amie /
// sœur / femme / chérie", a word a second, while the gift box pops open and
// the digital gift card floats out with the same name written on it; then
// "chez OYA MUSE · Témara".
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
  const cardScale = interpolate(rise, [0, 1], [0.6, 1.06]);
  const tiltY =
    frame > RISE_TO
      ? Math.sin((frame - RISE_TO) / 22) * 8
      : interpolate(rise, [0, 1], [-25, 0]);
  const tiltX =
    frame > RISE_TO
      ? Math.cos((frame - RISE_TO) / 28) * 4 - 4
      : interpolate(rise, [0, 1], [35, 0]);
  const halo = interpolate(frame, [LID_AT, LID_AT + 20], [0, 1], clamp);
  const cardInFront = frame >= RISE_FROM + 14;
  const sinceWord = (frame - WORDS_AT) % WORD_EVERY;
  const wordPunch =
    frame >= WORDS_AT ? interpolate(sinceWord, [0, 6], [1.03, 1], clamp) : 1;

  const giftCard = (
    <div
      style={{
        position: "absolute",
        left: 540 - 330,
        top: cardY - 206,
        scale: String(cardScale * wordPunch),
        transform: `perspective(1600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        opacity: interpolate(frame, [RISE_FROM, RISE_FROM + 3], [0, 1], clamp),
      }}
    >
      <GiftCard
        id="reveal-card"
        content={card}
        partner={partner}
        recipients={reveal.recipients.map((r) => r.card)}
        writeAt={WORDS_AT}
        writeEvery={WORD_EVERY}
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
      <Sfx name="pop" at={SALON_AT} volume={0.4} />
      {reveal.recipients.map((r, i) => (
        <Sfx
          key={r.word}
          name="tick"
          at={WORDS_AT + i * WORD_EVERY}
          volume={0.4}
        />
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
          { x: 14, y: 40 },
          { x: 86, y: 44 },
          { x: 12, y: 60 },
          { x: 88, y: 58 },
        ]}
        color={GOLD}
      />
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          right: 1080 - SAFE.right,
          top: SAFE.top + 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="Reveal line 1"
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 60,
            lineHeight: 1.1,
            color: GOLD_DEEP,
            scale: interpolate(frame, [0, 10], [1.3, 1], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            }),
          }}
        >
          {reveal.line1}
        </Interactive.Div>
        <div
          style={{
            marginTop: 6,
            height: 160,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 22,
            opacity: interpolate(
              frame,
              [WORDS_AT, WORDS_AT + 6],
              [0, 1],
              clamp,
            ),
            translate: interpolate(
              frame,
              [WORDS_AT, WORDS_AT + 14],
              ["0px 30px", "0px 0px"],
              { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) },
            ),
          }}
        >
          <Interactive.Div
            name="Reveal lead"
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: 60,
              color: EMERALD_DEEP,
              whiteSpace: "nowrap",
              paddingBottom: 10,
            }}
          >
            {reveal.lead}
          </Interactive.Div>
          <div style={{ position: "relative", width: WORD_SLOT, height: 160 }}>
            {reveal.recipients.map((r, i) => {
              const at = WORDS_AT + i * WORD_EVERY;
              const last = i === reveal.recipients.length - 1;
              const out = last ? 100000 : at + WORD_EVERY;
              return (
                <Interactive.Div
                  key={r.word}
                  name={`Recipient ${r.word}`}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: 160,
                    display: "flex",
                    alignItems: "center",
                    fontFamily: SCRIPT,
                    fontSize: 128,
                    lineHeight: 1,
                    color: EMERALD_DEEP,
                    whiteSpace: "nowrap",
                    paddingBottom: 22,
                    opacity: interpolate(
                      frame,
                      [at, at + 6, out - 5, out],
                      [0, 1, 1, 0],
                      clamp,
                    ),
                    translate: interpolate(
                      frame,
                      [at, at + 12],
                      ["0px 24px", "0px 0px"],
                      { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) },
                    ),
                  }}
                >
                  {r.word}
                </Interactive.Div>
              );
            })}
          </div>
        </div>
        <div
          style={{
            marginTop: 8,
            display: "inline-flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            padding: "8px 30px 8px 8px",
            borderRadius: 999,
            backgroundColor: EMERALD_DEEP,
            boxShadow:
              "0 18px 40px rgba(8,34,28,0.25), inset 0 0 0 1.5px rgba(201,169,110,0.6)",
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 27,
            letterSpacing: "0.08em",
            color: IVORY,
            whiteSpace: "nowrap",
            opacity: interpolate(
              frame,
              [SALON_AT, SALON_AT + 6],
              [0, 1],
              clamp,
            ),
            scale: interpolate(frame, [SALON_AT, SALON_AT + 14], [0.7, 1], {
              ...clamp,
              easing: Easing.spring({ damping: 12, stiffness: 180, mass: 0.8 }),
              output: "perceptual-scale",
            }),
          }}
        >
          <LogoBadge
            image={partner.logo}
            size={54}
            ring={false}
            ringColor={GOLD}
          />
          <span>
            <span
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: 30,
                letterSpacing: 0,
                color: GOLD,
              }}
            >
              {reveal.atLabel}
            </span>
            {` ${partner.name} · ${partner.city}`}
          </span>
        </div>
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
          translate: `${lidUp * 380}px ${(1 - enter) * 700 + sink * 1100 - lidUp * 900 + (frame < LID_AT ? -Math.abs(wiggle) * 2 : 0)}px`,
          rotate: `${wiggle + lidUp * 38}deg`,
          opacity: interpolate(frame, [LID_AT + 8, LID_AT + 18], [1, 0], clamp),
        }}
      >
        <BoxLid width={BOX_WIDTH + 40} height={100} />
      </div>
      <Burst at={LID_AT} x={540} y={BOX_TOP - 30} count={30} />
      {cardInFront ? giftCard : null}
      <Flash at={1} peak={0.55} />
    </AbsoluteFill>
  );
};
