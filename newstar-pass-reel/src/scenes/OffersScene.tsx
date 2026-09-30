import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { OfferCard } from "../components/OfferCard";
import { Flash } from "../components/Overlays";
import { Sfx } from "../components/Sfx";
import { SectionLabel } from "../components/Text";
import { SANS } from "../fonts";
import type { OfferSection } from "../schema";
import { BLUSH, PLUM, PLUM_DEEP, ROSE_SOFT } from "../theme";

// Four bars: the section's time window, then three offers stacking up one per
// bar; the fourth bar holds the full list with a footer note.
export const OffersScene: React.FC<{
  readonly section: OfferSection;
  readonly logo: string;
}> = ({ section, logo }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Offers scene"
      style={{
        backgroundColor: BLUSH,
        scale: interpolate(frame, [0, 10], [1.04, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }),
      }}
    >
      <Backdrop
        image={section.backdrop}
        blur={34}
        tint="rgba(236,213,206,0.84)"
        opacity={1}
      />
      <SectionLabel label={section.label} logo={logo} color={PLUM} />
      <Sfx name="pop" at={4} volume={0.6} />
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 262,
          padding: "14px 30px",
          borderRadius: 999,
          backgroundColor: PLUM,
          color: ROSE_SOFT,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: "0.06em",
          transformOrigin: "left center",
          scale: interpolate(frame, [4, 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 12, stiffness: 180, mass: 0.8 }),
            output: "perceptual-scale",
          }),
        }}
      >
        {section.window}
      </div>
      {section.offers.map((offer, i) => (
        <div
          key={offer.title}
          style={{ position: "absolute", left: 80, top: 420 + i * 340 }}
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
          top: 1460,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "18px 40px",
            borderRadius: 999,
            backgroundColor: PLUM_DEEP,
            color: BLUSH,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: "0.04em",
            scale: interpolate(frame, [168, 182], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 12, stiffness: 180, mass: 0.8 }),
              output: "perceptual-scale",
            }),
          }}
        >
          {section.footer}
        </div>
      </div>
      <Flash at={0} peak={0.55} />
    </AbsoluteFill>
  );
};
