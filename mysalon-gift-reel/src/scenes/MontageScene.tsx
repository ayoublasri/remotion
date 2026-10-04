import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { foil } from "../components/Icons";
import { LogoBadge } from "../components/Logo";
import { Flash } from "../components/Overlays";
import { Sfx } from "../components/Sfx";
import { DISPLAY, SANS, SERIF } from "../fonts";
import type { GiftReelProps, Partner, Shot } from "../schema";
import { BEAT } from "../timing";
import {
  EMERALD_INK,
  GOLD,
  GOLD_FOIL,
  GOLD_LIGHT,
  IVORY,
  SAGE,
} from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SHOT = BEAT * 2;
const FINALE_AT = SHOT * 3;

const ShotView: React.FC<{ readonly shot: Shot; readonly at: number }> = ({
  shot,
  at,
}) => {
  const frame = useCurrentFrame();
  const local = frame - at;
  const zoom = interpolate(local, [0, SHOT], [1.16, 1.03], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const labelPop = interpolate(local, [2, 10], [1.35, 1], {
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
          <AbsoluteFill style={{ backgroundColor: "rgba(8,34,28,0.42)" }} />
          <div
            style={{
              position: "absolute",
              left: 60,
              top: 520,
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
            "linear-gradient(180deg, rgba(8,34,28,0) 45%, rgba(8,34,28,0.75) 80%, rgba(8,34,28,0.85) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: 1150,
          textAlign: "center",
          scale: String(labelPop),
        }}
      >
        <Interactive.Div
          name={`Shot ${shot.label}`}
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 132,
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
            fontSize: 56,
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

// Bars 5-6: what the experience is, in quick beat-synced cuts (nails, lashes,
// brows), landing on the salon: "Chez OYA MUSE, Témara".
export const MontageScene: React.FC<{
  readonly montage: GiftReelProps["montage"];
  readonly partner: Partner;
}> = ({ montage, partner }) => {
  const frame = useCurrentFrame();
  const shotIndex = Math.min(2, Math.floor(frame / SHOT));
  const finale = frame >= FINALE_AT;
  const local = frame - FINALE_AT;

  return (
    <AbsoluteFill
      name="Montage scene"
      style={{ backgroundColor: EMERALD_INK, overflow: "hidden" }}
    >
      {[0, SHOT, SHOT * 2, FINALE_AT].map((at) => (
        <Sfx key={at} name="whoosh" at={at} volume={0.32} />
      ))}
      <Sfx name="sparkle" at={FINALE_AT + 4} volume={0.4} />
      {finale ? null : (
        <ShotView shot={montage.shots[shotIndex]} at={shotIndex * SHOT} />
      )}
      {finale ? (
        <AbsoluteFill>
          <Img
            src={staticFile(`images/${montage.finaleImage}`)}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              scale: String(
                interpolate(local, [0, 40], [1.18, 1.05], {
                  ...clamp,
                  easing: Easing.out(Easing.quad),
                }),
              ),
            }}
          />
          <AbsoluteFill
            style={{
              background:
                "radial-gradient(70% 45% at 50% 50%, rgba(8,34,28,0.62) 0%, rgba(8,34,28,0.88) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 40,
              right: 40,
              top: 560,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                scale: String(
                  interpolate(local, [0, 10], [0.6, 1], {
                    ...clamp,
                    easing: Easing.out(Easing.back(1.6)),
                  }),
                ),
              }}
            >
              <LogoBadge
                image={partner.logo}
                size={170}
                ring
                ringColor={GOLD}
              />
            </div>
            <Interactive.Div
              name="Finale lead"
              style={{
                marginTop: 34,
                fontFamily: SERIF,
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: 74,
                color: IVORY,
                opacity: interpolate(local, [3, 9], [0, 1], clamp),
              }}
            >
              {montage.finaleLead}
            </Interactive.Div>
            <Interactive.Div
              name="Finale salon"
              style={{
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: 138,
                lineHeight: 1.08,
                letterSpacing: "0.05em",
                ...foil(GOLD_FOIL),
                backgroundSize: "200% 100%",
                backgroundPosition: `${interpolate(local, [0, 40], [100, 0], clamp)}% 0%`,
                filter: "drop-shadow(0 0 30px rgba(201,169,110,0.35))",
                scale: interpolate(local, [4, 14], [1.4, 1], {
                  ...clamp,
                  easing: Easing.out(Easing.cubic),
                }),
                opacity: interpolate(local, [4, 8], [0, 1], clamp),
              }}
            >
              {partner.name}
            </Interactive.Div>
            <Interactive.Div
              name="Finale city"
              style={{
                marginTop: 18,
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 32,
                letterSpacing: "0.34em",
                marginRight: "-0.34em",
                color: SAGE,
                opacity: interpolate(local, [10, 16], [0, 1], clamp),
              }}
            >
              {partner.city.toUpperCase()}
            </Interactive.Div>
          </div>
        </AbsoluteFill>
      ) : null}
      {[SHOT, SHOT * 2, FINALE_AT].map((at) => (
        <Flash key={at} at={at} peak={0.4} />
      ))}
    </AbsoluteFill>
  );
};
