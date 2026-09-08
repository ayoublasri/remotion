import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Logo, StarMark } from "../components/Brand";
import { SendIcon } from "../components/Icons";
import { SANS, SERIF } from "../fonts";
import type { MySalonReelProps } from "../schema";

// Launch offer and the call to action.
export const OfferScene: React.FC<{
  readonly offer: MySalonReelProps["offer"];
  readonly handle: string;
}> = ({ offer, handle }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Offer scene"
      style={{
        background:
          "radial-gradient(90% 60% at 50% 30%, #1a5450 0%, #0f3d3a 60%, #0a2d2b 100%)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -320,
          top: -260,
          opacity: 0.05,
          rotate: `${interpolate(frame, [0, 136], [0, 18])}deg`,
        }}
      >
        <StarMark size={1000} color="#ffffff" />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 236,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [0, 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Logo size={56} color="#ffffff" accent="#f47c97" starColor="#9fcac4" />
      </div>
      <Interactive.Div
        name="Offer title 1"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 460,
          textAlign: "center",
          fontFamily: SERIF,
          fontWeight: 900,
          fontSize: 150,
          lineHeight: 1,
          color: "#ffffff",
          letterSpacing: "-0.01em",
          scale: interpolate(frame, [4, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 12, stiffness: 170, mass: 0.8 }),
            output: "perceptual-scale",
          }),
          opacity: interpolate(frame, [4, 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {offer.title1}
      </Interactive.Div>
      <Interactive.Div
        name="Offer title 2"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 620,
          textAlign: "center",
          fontFamily: SERIF,
          fontWeight: 900,
          fontSize: 150,
          lineHeight: 1,
          color: "#f47c97",
          letterSpacing: "-0.01em",
          scale: interpolate(frame, [10, 26], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 12, stiffness: 170, mass: 0.8 }),
            output: "perceptual-scale",
          }),
          opacity: interpolate(frame, [10, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {offer.title2}
      </Interactive.Div>
      <Interactive.Div
        name="Stamp"
        style={{
          position: "absolute",
          right: 70,
          top: 372,
          padding: "14px 26px",
          border: "8px double #e8365d",
          borderRadius: 16,
          color: "#e8365d",
          textAlign: "center",
          fontFamily: SANS,
          textTransform: "uppercase",
          lineHeight: 1.15,
          rotate: "-9deg",
          scale: interpolate(frame, [28, 40], [2.6, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 15, stiffness: 200, mass: 0.7 }),
          }),
          opacity: interpolate(frame, [28, 33], [0, 0.95], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 28, letterSpacing: "0.12em" }}>
          {offer.stampLine1}
        </div>
        <div style={{ fontWeight: 700, fontSize: 24, letterSpacing: "0.08em" }}>
          {offer.stampLine2}
        </div>
      </Interactive.Div>
      <Interactive.Div
        name="Offer details"
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 880,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 40,
          lineHeight: 1.35,
          color: "#a9d8d2",
          opacity: interpolate(frame, [44, 54], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [44, 58], ["0px 30px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {offer.details1}
        <br />
        <span style={{ fontWeight: 700, color: "#ffffff" }}>
          {offer.details2}
        </span>
      </Interactive.Div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1040,
          display: "flex",
          justifyContent: "center",
          scale: interpolate(frame, [58, 74], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 12, stiffness: 170, mass: 0.8 }),
            output: "perceptual-scale",
          }),
        }}
      >
        <Interactive.Div
          name="CTA button"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            padding: "0 64px",
            height: 128,
            borderRadius: 64,
            backgroundColor: "#d81b47",
            color: "#ffffff",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 52,
            boxShadow: "0 24px 60px rgba(216,27,71,0.45)",
            scale: interpolate(
              frame,
              [90, 100, 110, 120, 130, 136],
              [1, 1.045, 1, 1.045, 1, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
          }}
        >
          <SendIcon size={48} color="#ffffff" strokeWidth={2.4} />
          {offer.cta}
        </Interactive.Div>
      </div>
      <Interactive.Div
        name="Handle"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1204,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 62,
          color: "#ffffff",
          letterSpacing: "-0.01em",
          opacity: interpolate(frame, [72, 82], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [72, 86], ["0px 30px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {handle}
      </Interactive.Div>
      <Interactive.Div
        name="Founder line"
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1304,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 34,
          color: "#a9d8d2",
          opacity: interpolate(frame, [84, 94], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {offer.founder}
      </Interactive.Div>
      <Interactive.Div
        name="Footer"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1420,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 30,
          letterSpacing: "0.06em",
          color: "#7fb8b2",
          opacity: interpolate(frame, [94, 104], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {offer.footer}
      </Interactive.Div>
    </AbsoluteFill>
  );
};
