import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Flash, Star } from "../components/Overlays";
import { SANS, SERIF } from "../fonts";
import type { OyamuseReelProps } from "../schema";

// Bar 3: the drums drop and the name appears.
export const BrandScene: React.FC<{
  readonly brand: OyamuseReelProps["brand"];
  readonly handle: string;
}> = ({ brand, handle }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Brand scene"
      style={{
        background:
          "radial-gradient(70% 45% at 50% 48%, #f9ebe3 0%, #f5eee6 55%, #ecdfd2 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          borderRadius: 650,
          border: "1px solid rgba(201,163,106,0.55)",
          scale: interpolate(frame, [0, 60], [0.55, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          opacity: interpolate(frame, [0, 14, 60], [0, 0.9, 0.35], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <div
        style={{
          scale: interpolate(frame, [4, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 12, stiffness: 170, mass: 0.8 }),
            output: "perceptual-scale",
          }),
          rotate: `${interpolate(frame, [4, 72], [0, 90])}deg`,
          marginBottom: 26,
        }}
      >
        <Star size={54} color="#c9a36a" />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 34,
        }}
      >
        <div
          style={{
            width: 120,
            height: 2,
            backgroundColor: "#c9a36a",
            transformOrigin: "right center",
            scale: interpolate(frame, [2, 20], ["0 1", "1 1"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        />
        <Interactive.Div
          name="Wordmark"
          style={{
            fontFamily: SERIF,
            fontWeight: 900,
            fontSize: 150,
            lineHeight: 1,
            letterSpacing: "0.16em",
            paddingLeft: "0.16em",
            color: "#2a1b14",
            scale: interpolate(frame, [0, 22], [1.25, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            opacity: interpolate(frame, [0, 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            filter: `blur(${interpolate(frame, [0, 16], [14, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}px)`,
          }}
        >
          {brand.name}
        </Interactive.Div>
        <div
          style={{
            width: 120,
            height: 2,
            backgroundColor: "#c9a36a",
            transformOrigin: "left center",
            scale: interpolate(frame, [2, 20], ["0 1", "1 1"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        />
      </div>
      <Interactive.Div
        name="Descriptor"
        style={{
          marginTop: 34,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 30,
          letterSpacing: "0.42em",
          paddingLeft: "0.42em",
          textTransform: "uppercase",
          color: "#c9a36a",
          opacity: interpolate(frame, [18, 28], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [18, 34], ["0px 24px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {brand.descriptor}
      </Interactive.Div>
      <Interactive.Div
        name="Handle"
        style={{
          marginTop: 30,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 34,
          color: "rgba(42,27,20,0.6)",
          opacity: interpolate(frame, [36, 46], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [36, 52], ["0px 20px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {handle}
      </Interactive.Div>
      <Flash at={0} peak={0.55} />
    </AbsoluteFill>
  );
};
