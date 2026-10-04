import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { StarMark } from "../components/Brand";
import { LogoBadge } from "../components/Logo";
import { Flash } from "../components/Overlays";
import { StarPattern } from "../components/Pattern";
import { Sfx } from "../components/Sfx";
import { DISPLAY, SANS, SERIF } from "../fonts";
import type { GiftReelProps, Partner, Shot } from "../schema";
import { DARK_BG, EMERALD_INK, GOLD, GOLD_LIGHT, IVORY, SAGE } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CHIPS_AT = 20;
const FEATURE_AT = 40;
const MONTAGE_AT = 72;
const SHOT = 40;

const ShotView: React.FC<{ readonly shot: Shot; readonly at: number }> = ({
  shot,
  at,
}) => {
  const frame = useCurrentFrame();
  const local = frame - at;
  const zoom = interpolate(local, [0, SHOT], [1.14, 1.03], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const labelPop = interpolate(local, [2, 10], [1.3, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const src = staticFile(`images/${shot.image}`);

  return (
    <AbsoluteFill style={{ backgroundColor: EMERALD_INK, overflow: "hidden" }}>
      {shot.framed ? (
        <>
          <Img
            src={src}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(34px)",
              scale: "1.3",
            }}
          />
          <AbsoluteFill style={{ backgroundColor: "rgba(8,34,28,0.45)" }} />
          <div
            style={{
              position: "absolute",
              left: 60,
              top: 560,
              width: 960,
              height: 554,
              borderRadius: 36,
              overflow: "hidden",
              boxShadow:
                "0 40px 90px rgba(0,0,0,0.45), 0 0 0 6px rgba(246,232,198,0.9)",
              scale: String(
                interpolate(local, [0, 8], [0.9, 1], {
                  ...clamp,
                  easing: Easing.out(Easing.cubic),
                }),
              ),
            }}
          >
            <Img
              src={src}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: `${shot.focusX}% ${shot.focusY}%`,
                scale: String(zoom * 1.04),
              }}
            />
          </div>
        </>
      ) : (
        <Img
          src={src}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${shot.focusX}% ${shot.focusY}%`,
            scale: String(zoom),
          }}
        />
      )}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(8,34,28,0.8) 0%, rgba(8,34,28,0.2) 26%, rgba(8,34,28,0) 48%, rgba(8,34,28,0.75) 80%, rgba(8,34,28,0.85) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: 1180,
          textAlign: "center",
          scale: String(labelPop),
        }}
      >
        <Interactive.Div
          name={`Shot ${shot.label}`}
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 124,
            lineHeight: 1,
            letterSpacing: "0.06em",
            color: IVORY,
            textShadow: "0 6px 30px rgba(0,0,0,0.5)",
          }}
        >
          {shot.label}
        </Interactive.Div>
        <Interactive.Div
          name={`Shot ${shot.label} detail`}
          style={{
            marginTop: 14,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 54,
            color: GOLD_LIGHT,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          {shot.detail}
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};

// Bars 6-8: where. "À Témara, dans l'un de nos salons partenaires": the
// partner salons, the featured one highlighted, then its treatments in slow
// photo cuts under its name.
export const WhereScene: React.FC<{
  readonly where: GiftReelProps["where"];
  readonly partner: Partner;
}> = ({ where, partner }) => {
  const frame = useCurrentFrame();
  const montage = frame >= MONTAGE_AT;
  const shotIndex = Math.min(2, Math.floor((frame - MONTAGE_AT) / SHOT));

  return (
    <AbsoluteFill
      name="Where scene"
      style={{ background: DARK_BG, overflow: "hidden" }}
    >
      <StarPattern id="where-pattern" color={GOLD} opacity={0.06} size={120} />
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
      <Sfx name="whoosh" at={0} volume={0.3} />
      <Sfx name="pop" at={CHIPS_AT} volume={0.4} />
      <Sfx name="sparkle" at={FEATURE_AT} volume={0.4} />
      {[MONTAGE_AT, MONTAGE_AT + SHOT, MONTAGE_AT + SHOT * 2].map((at) => (
        <Sfx key={at} name="whoosh" at={at} volume={0.3} />
      ))}
      {montage ? null : (
        <AbsoluteFill
          style={{ alignItems: "center", paddingTop: 430, textAlign: "center" }}
        >
          <Interactive.Div
            name="Where line 1"
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: 84,
              lineHeight: 1.05,
              color: IVORY,
              opacity: interpolate(frame, [0, 6], [0, 1], clamp),
              translate: interpolate(frame, [0, 14], ["0px 30px", "0px 0px"], {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            {where.line1}
          </Interactive.Div>
          <Interactive.Div
            name="Where line 2"
            style={{
              marginTop: 14,
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 44,
              color: SAGE,
              opacity: interpolate(frame, [8, 14], [0, 1], clamp),
              translate: interpolate(frame, [8, 22], ["0px 30px", "0px 0px"], {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            {where.line2}
          </Interactive.Div>
          <div
            style={{
              marginTop: 70,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 22,
            }}
          >
            {where.salons.map((salon, i) => {
              const featured = salon.name === partner.name;
              const at = CHIPS_AT + i * 6;
              const ring = featured
                ? interpolate(
                    frame,
                    [FEATURE_AT, FEATURE_AT + 10],
                    [0, 1],
                    clamp,
                  )
                : 0;
              return (
                <div
                  key={salon.name}
                  style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 14,
                    padding: "10px 26px 10px 10px",
                    borderRadius: 999,
                    backgroundColor: featured
                      ? `rgba(201,169,110,${0.1 + 0.16 * ring})`
                      : "rgba(255,255,255,0.07)",
                    boxShadow: `inset 0 0 0 ${1.5 + 1.5 * ring}px rgba(201,169,110,${featured ? 0.4 + 0.6 * ring : 0.25})`,
                    fontFamily: DISPLAY,
                    fontWeight: 700,
                    fontSize: 27,
                    letterSpacing: "0.1em",
                    color: featured ? GOLD_LIGHT : SAGE,
                    whiteSpace: "nowrap",
                    opacity: interpolate(frame, [at, at + 6], [0, 1], clamp),
                    scale:
                      interpolate(frame, [at, at + 14], [0.7, 1], {
                        ...clamp,
                        easing: Easing.spring({
                          damping: 12,
                          stiffness: 180,
                          mass: 0.8,
                        }),
                        output: "perceptual-scale",
                      }) *
                      (1 + 0.06 * ring),
                  }}
                >
                  <LogoBadge
                    image={salon.logo}
                    size={66}
                    ring={false}
                    ringColor={GOLD}
                  />
                  {salon.name}
                  {featured ? (
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: -46,
                        translate: "-50% 0px",
                        padding: "6px 18px",
                        borderRadius: 999,
                        background:
                          "linear-gradient(100deg, #b8955a 0%, #e9d5a6 45%, #c9a96e 100%)",
                        color: EMERALD_INK,
                        fontFamily: SANS,
                        fontWeight: 800,
                        fontSize: 19,
                        letterSpacing: "0.22em",
                        whiteSpace: "nowrap",
                        opacity: ring,
                        scale: String(0.6 + 0.4 * ring),
                      }}
                    >
                      {where.featuredLabel}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}
      {montage ? (
        <>
          <ShotView
            shot={where.shots[shotIndex]}
            at={MONTAGE_AT + shotIndex * SHOT}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 230,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                scale: String(
                  interpolate(frame, [MONTAGE_AT, MONTAGE_AT + 12], [0.5, 1], {
                    ...clamp,
                    easing: Easing.out(Easing.back(1.5)),
                  }),
                ),
              }}
            >
              <LogoBadge
                image={partner.logo}
                size={132}
                ring
                ringColor={GOLD}
              />
            </div>
            <Interactive.Div
              name="Where salon"
              style={{
                marginTop: 20,
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: 76,
                lineHeight: 1,
                letterSpacing: "0.08em",
                color: GOLD_LIGHT,
                textShadow: "0 6px 30px rgba(0,0,0,0.5)",
                opacity: interpolate(
                  frame,
                  [MONTAGE_AT + 4, MONTAGE_AT + 10],
                  [0, 1],
                  clamp,
                ),
              }}
            >
              {partner.name}
            </Interactive.Div>
            <Interactive.Div
              name="Where salon city"
              style={{
                marginTop: 12,
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 27,
                letterSpacing: "0.3em",
                marginRight: "-0.3em",
                color: IVORY,
                opacity: interpolate(
                  frame,
                  [MONTAGE_AT + 8, MONTAGE_AT + 14],
                  [0, 0.9],
                  clamp,
                ),
              }}
            >
              {`${partner.city} · ${partner.services}`.toUpperCase()}
            </Interactive.Div>
          </div>
        </>
      ) : null}
      {[MONTAGE_AT, MONTAGE_AT + SHOT, MONTAGE_AT + SHOT * 2].map((at) => (
        <Flash key={at} at={at} peak={0.4} />
      ))}
    </AbsoluteFill>
  );
};
