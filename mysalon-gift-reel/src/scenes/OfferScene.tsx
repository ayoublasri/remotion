import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Heart } from "../components/Icons";
import { LogoBadge } from "../components/Logo";
import { StarPattern } from "../components/Pattern";
import { Sfx } from "../components/Sfx";
import { DISPLAY, SANS, SERIF } from "../fonts";
import type { GiftReelProps, Partner, Service } from "../schema";
import { BEAT } from "../timing";
import {
  CARD,
  EMERALD_DEEP,
  GOLD,
  GOLD_DEEP,
  INK,
  LIGHT_BG,
  MUTED,
  SAND,
} from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ROW_TOP = 470;
const ROW_HEIGHT = 262;
const ROW_GAP = 30;
const ROW_AT = [BEAT, BEAT * 2, BEAT * 3];
const NOTE_AT = BEAT * 5;

const ServiceRow: React.FC<{
  readonly service: Service;
  readonly index: number;
}> = ({ service, index }) => {
  const frame = useCurrentFrame();
  const at = ROW_AT[index];
  const fromRight = index % 2 === 1;

  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        top: ROW_TOP + index * (ROW_HEIGHT + ROW_GAP),
        width: 940,
        height: ROW_HEIGHT,
        borderRadius: 36,
        backgroundColor: CARD,
        boxShadow:
          "0 26px 60px rgba(8,34,28,0.12), 0 0 0 1px rgba(201,169,110,0.45)",
        overflow: "hidden",
        opacity: interpolate(frame, [at, at + 6], [0, 1], clamp),
        translate: interpolate(
          frame,
          [at, at + 20],
          [fromRight ? "260px 0px" : "-260px 0px", "0px 0px"],
          {
            ...clamp,
            easing: Easing.spring({ damping: 16, stiffness: 140, mass: 0.9 }),
          },
        ),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 15,
          top: 15,
          width: 440,
          height: ROW_HEIGHT - 30,
          borderRadius: 26,
          overflow: "hidden",
          backgroundColor: SAND,
        }}
      >
        <Img
          src={staticFile(`images/${service.image}`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${service.focusX}% ${service.focusY}%`,
            scale: String(
              interpolate(frame, [at, at + 110], [1.2, 1.08], {
                ...clamp,
                easing: Easing.out(Easing.quad),
              }),
            ),
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 8,
            borderRadius: 20,
            border: "1.5px solid rgba(253,249,241,0.8)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 490,
          right: 30,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: "0.2em",
            color: GOLD,
          }}
        >{`0${index + 1}`}</div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 52,
            lineHeight: 1.05,
            letterSpacing: "0.06em",
            color: EMERALD_DEEP,
          }}
        >
          {service.label}
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 33,
            lineHeight: 1.2,
            color: GOLD_DEEP,
          }}
        >
          {service.detail}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: -40,
          left: 0,
          width: 140,
          height: ROW_HEIGHT + 80,
          rotate: "20deg",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,250,236,0.75) 50%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
          translate: interpolate(
            frame,
            [at + 14, at + 40],
            ["-200px 0px", "1100px 0px"],
            {
              ...clamp,
              easing: Easing.bezier(0.45, 0, 0.35, 1),
            },
          ),
        }}
      />
    </div>
  );
};

// Bars 8-9: what can be offered at the salon, as an elegant menu of three
// treatments under the salon's own logo.
export const OfferScene: React.FC<{
  readonly offer: GiftReelProps["offer"];
  readonly partner: Partner;
}> = ({ offer, partner }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Offer scene"
      style={{ background: LIGHT_BG, overflow: "hidden" }}
    >
      <StarPattern id="offer-pattern" color={GOLD} opacity={0.08} size={120} />
      <Sfx name="whoosh" at={0} volume={0.35} />
      {ROW_AT.map((at) => (
        <Sfx key={at} name="pop" at={at} volume={0.45} />
      ))}
      <Sfx name="ding" at={NOTE_AT} volume={0.3} />
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 166,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Interactive.Div
          name="Offer salon"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            opacity: interpolate(frame, [0, 8], [0, 1], clamp),
            scale: interpolate(frame, [0, 16], [0.8, 1], {
              ...clamp,
              easing: Easing.spring({ damping: 12, stiffness: 170, mass: 0.8 }),
              output: "perceptual-scale",
            }),
          }}
        >
          <LogoBadge image={partner.logo} size={96} ring ringColor={GOLD} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: 50,
                lineHeight: 1,
                letterSpacing: "0.08em",
                color: EMERALD_DEEP,
              }}
            >
              {partner.name}
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: 20,
                letterSpacing: "0.24em",
                color: MUTED,
              }}
            >
              {partner.city.toUpperCase()}
            </div>
          </div>
        </Interactive.Div>
        <Interactive.Div
          name="Offer title"
          style={{
            marginTop: 30,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 72,
            lineHeight: 1.1,
            color: INK,
            textAlign: "center",
            opacity: interpolate(frame, [2, 10], [0, 1], clamp),
            translate: interpolate(frame, [2, 18], ["0px 36px", "0px 0px"], {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          {offer.title}
        </Interactive.Div>
      </div>
      {offer.services.map((service, i) => (
        <ServiceRow key={service.label} service={service} index={i} />
      ))}
      <Interactive.Div
        name="Offer note"
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: ROW_TOP + 3 * (ROW_HEIGHT + ROW_GAP) + 22,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          fontFamily: SERIF,
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 50,
          color: EMERALD_DEEP,
          opacity: interpolate(frame, [NOTE_AT, NOTE_AT + 8], [0, 1], clamp),
          translate: interpolate(
            frame,
            [NOTE_AT, NOTE_AT + 16],
            ["0px 30px", "0px 0px"],
            {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        <Heart size={40} color={GOLD} />
        {offer.note}
      </Interactive.Div>
    </AbsoluteFill>
  );
};
