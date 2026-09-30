import {
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { SANS } from "../fonts";
import type { Offer } from "../schema";
import { CARD, GREEN, INK, MUTED, RED } from "../theme";
import { Callout } from "./Callout";
import { Price } from "./Price";
import { Sfx } from "./Sfx";

// Remix of the Product Offer element as a horizontal card: photo, title,
// the old price struck through, the new price counting down and landing,
// and a scarcity callout hanging over the corner.
export const OfferCard: React.FC<{
  readonly offer: Offer;
  readonly at: number;
}> = ({ offer, at }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "relative",
        width: 920,
        height: 300,
        translate: interpolate(
          frame,
          [at, at + 20],
          ["1200px 0px", "0px 0px"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 15, stiffness: 140, mass: 0.9 }),
          },
        ),
        opacity: interpolate(frame, [at, at + 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        scale: interpolate((frame - at) % 14, [0, 2, 10], [1.012, 1.008, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <Sfx name="whoosh" at={at} volume={0.5} />
      <Sfx name="stamp" at={at + 30} volume={0.7} />
      <Interactive.Div
        name="Offer card"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 30,
          backgroundColor: CARD,
          boxShadow:
            "0 30px 60px rgba(31,75,60,0.16), 0 0 0 1px rgba(196,162,79,0.35)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 24,
          padding: 22,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: 360,
            height: 256,
            borderRadius: 22,
            overflow: "hidden",
            flexShrink: 0,
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
          }}
        >
          <Img
            name="Offer photo"
            src={staticFile(`images/${offer.image}`)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: `${offer.focusX}% ${offer.focusY}%`,
              transformOrigin: `${offer.focusX}% ${offer.focusY}%`,
              scale: interpolate(
                frame,
                [at, at + 90],
                [offer.zoom * 1.12, offer.zoom],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.quad),
                },
              ),
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            flex: 1,
            minWidth: 0,
          }}
        >
          <Interactive.Div
            name="Offer title"
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 40,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              color: INK,
              textTransform: "uppercase",
              opacity: interpolate(frame, [at + 6, at + 14], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              translate: interpolate(
                frame,
                [at + 6, at + 20],
                ["0px 20px", "0px 0px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
            }}
          >
            {offer.title}
          </Interactive.Div>
          <Interactive.Div
            name="Offer subtitle"
            style={{
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 28,
              lineHeight: 1.1,
              color: GREEN,
              opacity: interpolate(frame, [at + 10, at + 18], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              translate: interpolate(
                frame,
                [at + 10, at + 24],
                ["0px 20px", "0px 0px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
            }}
          >
            {offer.subtitle}
          </Interactive.Div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 10,
            flexShrink: 0,
            paddingRight: 12,
          }}
        >
          <div style={{ position: "relative" }}>
            <Interactive.Div
              name="Old price"
              style={{
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: 34,
                lineHeight: 1,
                color: MUTED,
                whiteSpace: "nowrap",
                opacity: interpolate(frame, [at + 8, at + 14], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              {`${offer.oldPrice} DH`}
            </Interactive.Div>
            <div
              style={{
                position: "absolute",
                left: -6,
                right: -6,
                top: "50%",
                height: 5,
                marginTop: -2,
                borderRadius: 3,
                backgroundColor: RED,
                transformOrigin: "left center",
                scale: interpolate(frame, [at + 24, at + 32], ["0 1", "1 1"], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                }),
              }}
            />
          </div>
          <Price
            from={offer.oldPrice}
            to={offer.newPrice}
            at={at + 12}
            duration={18}
            size={72}
            color={GREEN}
            unit="DH"
          />
        </div>
      </Interactive.Div>
      <div style={{ position: "absolute", right: 18, top: -58 }}>
        <Callout
          text={offer.scarcity}
          at={at + 34}
          fill={RED}
          color="#ffffff"
          width={290}
        />
      </div>
    </div>
  );
};
