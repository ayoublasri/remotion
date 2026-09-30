import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { OfferCard } from "../components/OfferCard";
import { Flash } from "../components/Overlays";
import { Sfx } from "../components/Sfx";
import { SectionLabel } from "../components/Text";
import { SANS } from "../fonts";
import type { Offer } from "../schema";
import { CREAM, CREAM_DEEP, GREEN } from "../theme";

// Bars 5-8: three offers stack up, one per bar; the fourth bar holds the full list.
export const OffersScene: React.FC<{
  readonly offers: Offer[];
  readonly label: string;
  readonly logo: string;
  readonly footer: string;
}> = ({ offers, label, logo, footer }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Offers scene"
      style={{
        background: `radial-gradient(80% 50% at 50% 30%, ${CREAM} 0%, ${CREAM_DEEP} 100%)`,
        scale: interpolate(frame, [0, 10], [1.04, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }),
      }}
    >
      <SectionLabel label={label} logo={logo} color={GREEN} />
      {offers.map((offer, i) => (
        <div
          key={offer.title}
          style={{ position: "absolute", left: 80, top: 400 + i * 340 }}
        >
          <OfferCard offer={offer} at={i * 56} />
        </div>
      ))}
      <Sfx name="stamp" at={168} volume={0.6} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1450,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "18px 40px",
            borderRadius: 999,
            backgroundColor: GREEN,
            color: CREAM,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: "0.06em",
            scale: interpolate(frame, [168, 182], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 12, stiffness: 180, mass: 0.8 }),
              output: "perceptual-scale",
            }),
          }}
        >
          {footer}
        </div>
      </div>
      <Flash at={0} peak={0.55} />
    </AbsoluteFill>
  );
};
