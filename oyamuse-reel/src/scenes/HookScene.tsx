import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Grain, Twinkles, Vignette } from "../components/Overlays";
import { Photo } from "../components/Photo";
import { PopLine } from "../components/Text";
import { SERIF } from "../fonts";
import type { OyamuseReelProps, Photo as PhotoProps } from "../schema";

// Bars 1-2: "Look at your nails." then "Now look at these." while the music builds.
export const HookScene: React.FC<{
  readonly hook: OyamuseReelProps["hook"];
  readonly photo: PhotoProps;
}> = ({ hook, photo }) => {
  const frame = useCurrentFrame();
  const shake = interpolate(frame, [56, 112], [0, 7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  return (
    <AbsoluteFill name="Hook scene" style={{ backgroundColor: "#12100e" }}>
      <AbsoluteFill
        name="Shake"
        style={{
          translate: `${Math.sin(frame * 12.9) * shake}px ${Math.cos(frame * 7.3) * shake}px`,
        }}
      >
        <Photo
          image={photo.image}
          focusX={photo.focusX}
          focusY={photo.focusY}
          zoomFrom={1.16}
          zoomTo={1.3}
          driftX={0}
          driftY={-30}
          rotation={0}
          punch={false}
          pulse
        />
      </AbsoluteFill>
      <AbsoluteFill
        name="Darken"
        style={{
          background:
            "linear-gradient(180deg, rgba(12,10,8,0.3) 0%, rgba(12,10,8,0.5) 55%, rgba(12,10,8,0.82) 100%)",
        }}
      />
      <Vignette />
      <Twinkles points={photo.sparkles} color="#fff3e6" />
      <AbsoluteFill
        name="Hook text"
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 80px",
          gap: 26,
          textAlign: "center",
        }}
      >
        <PopLine
          name="Hook line 1"
          text={hook.line1}
          at={2}
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 86,
            lineHeight: 1.08,
            color: "#ffffff",
            textShadow: "0 12px 40px rgba(0,0,0,0.45)",
          }}
        />
        <PopLine
          name="Hook line 2"
          text={hook.line2}
          at={56}
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 86,
            lineHeight: 1.08,
            color: "#e6cf9f",
            textShadow: "0 12px 40px rgba(0,0,0,0.45)",
          }}
        />
      </AbsoluteFill>
      <Grain />
      <AbsoluteFill
        name="Fade in"
        style={{
          backgroundColor: "#12100e",
          pointerEvents: "none",
          opacity: interpolate(frame, [0, 8], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
