import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { Logo, StarMark } from "../components/Brand";
import { FeatureCard } from "../components/FeatureCard";
import { Phone } from "../components/Phone";
import { AgendaScreen } from "../components/screens/AgendaScreen";
import { BookingPage } from "../components/screens/BookingPage";
import { ClientsScreen } from "../components/screens/ClientsScreen";
import { SANS, SERIF } from "../fonts";
import type { Feature, MySalonReelProps } from "../schema";

const BrandReveal: React.FC<{ readonly brand: MySalonReelProps["brand"] }> = ({
  brand,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Brand reveal"
      style={{
        alignItems: "center",
        padding: "0 80px",
        opacity: interpolate(frame, [74, 86], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(frame, [74, 86], ["0px 0px", "0px -40px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.in(Easing.quad),
        }),
      }}
    >
      <div
        style={{
          marginTop: 560,
          scale: interpolate(frame, [0, 26], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 12, stiffness: 150, mass: 0.9 }),
            output: "perceptual-scale",
          }),
          rotate: interpolate(frame, [0, 26], ["-120deg", "0deg"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <StarMark size={150} color="#0f5c57" />
      </div>
      <div
        style={{
          marginTop: 26,
          opacity: interpolate(frame, [18, 26], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [18, 34], ["0px 40px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <Logo
          size={116}
          color="#1c1c1c"
          accent="#b81238"
          starColor="#0f5c57"
          showStar={false}
        />
      </div>
      <Interactive.Div
        name="Tagline"
        style={{
          marginTop: 24,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 40,
          color: "#b81238",
          textAlign: "center",
          opacity: interpolate(frame, [32, 40], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [32, 46], ["0px 30px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {brand.tagline}
      </Interactive.Div>
      <Interactive.Div
        name="Badge"
        style={{
          marginTop: 22,
          padding: "12px 30px",
          borderRadius: 999,
          backgroundColor: "#0f5c57",
          color: "#ffffff",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: "0.04em",
          scale: interpolate(frame, [42, 56], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 12, stiffness: 170, mass: 0.8 }),
            output: "perceptual-scale",
          }),
        }}
      >
        {brand.badge}
      </Interactive.Div>
      <Interactive.Div
        name="Headline"
        style={{
          marginTop: 64,
          fontFamily: SERIF,
          fontWeight: 900,
          fontSize: 86,
          lineHeight: 1.08,
          color: "#1c1c1c",
          textAlign: "center",
          letterSpacing: "-0.01em",
          opacity: interpolate(frame, [54, 62], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [54, 70], ["0px 40px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {brand.headline}
      </Interactive.Div>
      <Interactive.Div
        name="Subheadline"
        style={{
          marginTop: 22,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 38,
          lineHeight: 1.3,
          color: "#5d5d5d",
          textAlign: "center",
          opacity: interpolate(frame, [62, 70], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [62, 78], ["0px 30px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {brand.subheadline}
      </Interactive.Div>
    </AbsoluteFill>
  );
};

const Header: React.FC<{ readonly handle: string }> = ({ handle }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: 118,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        opacity: interpolate(frame, [0, 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(frame, [0, 14], ["0px -24px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <Logo size={54} color="#1c1c1c" accent="#b81238" starColor="#0f5c57" />
      <div
        style={{
          padding: "12px 24px",
          borderRadius: 999,
          border: "2px solid #0f5c57",
          color: "#0f5c57",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 30,
        }}
      >
        {handle}
      </div>
    </div>
  );
};

const PhoneDemo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: 280,
        top: 452,
        width: 520,
        height: 1040,
        transformOrigin: "50% 42%",
        translate: interpolate(frame, [0, 28], ["0px 1500px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        scale: interpolate(
          frame,
          [0, 28, 66, 82, 136, 152],
          [0.94, 1, 1, 1.08, 1.08, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          },
        ),
      }}
    >
      <Phone>
        <Sequence durationInFrames={160} name="Booking page">
          <BookingPage scrollAt={36} tapAt={66} slotAt={94} confirmAt={104} />
        </Sequence>
        <Sequence from={146} durationInFrames={50} name="Agenda">
          <AgendaScreen newAt={10} />
        </Sequence>
        <Sequence from={182} name="Clients">
          <ClientsScreen tapAt={12} />
        </Sequence>
      </Phone>
    </div>
  );
};

// Brand reveal, then the product demo: booking flow, agenda and clients on a
// phone, with a feature card naming what is being shown.
export const ProductScene: React.FC<{
  readonly handle: string;
  readonly brand: MySalonReelProps["brand"];
  readonly features: Feature[];
}> = ({ handle, brand, features }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill name="Product scene" style={{ backgroundColor: "#0f3d3a" }}>
      <AbsoluteFill
        name="Cream reveal"
        style={{
          backgroundColor: "#f8f4ee",
          clipPath: `circle(${interpolate(frame, [0, 30], [0, 1500], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}px at 50% 50%)`,
        }}
      >
        <AbsoluteFill
          name="Blush glow"
          style={{
            background:
              "radial-gradient(60% 40% at 50% 62%, rgba(184,18,56,0.10) 0%, rgba(184,18,56,0) 100%), radial-gradient(70% 45% at 50% 15%, rgba(15,92,87,0.10) 0%, rgba(15,92,87,0) 100%)",
          }}
        />
      </AbsoluteFill>
      <Sequence durationInFrames={92} layout="none" name="Brand reveal">
        <BrandReveal brand={brand} />
      </Sequence>
      <Sequence from={84} layout="none" name="Header">
        <Header handle={handle} />
      </Sequence>
      <Sequence from={84} layout="none" name="Phone demo">
        <PhoneDemo />
      </Sequence>
      <Sequence from={96} durationInFrames={44} layout="none" name="Feature 1">
        <FeatureCard feature={features[0]} step={0} total={5} />
      </Sequence>
      <Sequence from={140} durationInFrames={46} layout="none" name="Feature 2">
        <FeatureCard feature={features[1]} step={1} total={5} />
      </Sequence>
      <Sequence from={186} durationInFrames={40} layout="none" name="Feature 3">
        <FeatureCard feature={features[2]} step={2} total={5} />
      </Sequence>
      <Sequence from={226} durationInFrames={36} layout="none" name="Feature 4">
        <FeatureCard feature={features[3]} step={3} total={5} />
      </Sequence>
      <Sequence from={262} durationInFrames={34} layout="none" name="Feature 5">
        <FeatureCard feature={features[4]} step={4} total={5} />
      </Sequence>
    </AbsoluteFill>
  );
};
