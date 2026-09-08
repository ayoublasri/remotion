import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Grain, Twinkles, Vignette } from "../components/Overlays";
import { Photo } from "../components/Photo";
import { PopLine } from "../components/Text";
import { SERIF } from "../fonts";
import type { OyamuseReelProps } from "../schema";

// Bars 1-2. "Look at your nails. Now." over the pearl set, then "See? It's time."
export const HookScene: React.FC<{
  readonly hook: OyamuseReelProps["hook"];
  readonly image: string;
}> = ({ hook, image }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill name="Hook scene" style={{ backgroundColor: "#1e130e" }}>
      <Photo
        image={image}
        focusX={50}
        focusY={40}
        zoomFrom={1.12}
        zoomTo={1.26}
        driftX={0}
        driftY={-30}
        pulse
      />
      <AbsoluteFill
        name="Darken"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,12,8,0.35) 0%, rgba(20,12,8,0.5) 55%, rgba(20,12,8,0.82) 100%)",
        }}
      />
      <Vignette />
      <Twinkles
        points={[
          { x: 63, y: 24 },
          { x: 47, y: 31 },
          { x: 74, y: 55 },
        ]}
        color="#fff3e6"
      />
      <AbsoluteFill
        name="Hook part 1"
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 80px",
          gap: 22,
          textAlign: "center",
          opacity: interpolate(frame, [70, 78], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [70, 80], ["0px 0px", "0px -50px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.quad),
          }),
        }}
      >
        <PopLine
          name="Hook line 1"
          text={hook.line1}
          at={2}
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 96,
            lineHeight: 1.08,
            color: "#ffffff",
            textShadow: "0 12px 40px rgba(0,0,0,0.4)",
          }}
        />
        <PopLine
          name="Hook line 2"
          text={hook.line2}
          at={36}
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 96,
            lineHeight: 1.08,
            color: "#e9c3b6",
            textShadow: "0 12px 40px rgba(0,0,0,0.4)",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        name="Hook part 2"
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 80px",
          gap: 22,
          textAlign: "center",
        }}
      >
        <PopLine
          name="Hook line 3"
          text={hook.line3}
          at={76}
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 96,
            lineHeight: 1.08,
            color: "#ffffff",
            textShadow: "0 12px 40px rgba(0,0,0,0.4)",
          }}
        />
        <PopLine
          name="Hook line 4"
          text={hook.line4}
          at={108}
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 104,
            lineHeight: 1.08,
            color: "#e6cf9f",
            textShadow: "0 12px 40px rgba(0,0,0,0.4)",
          }}
        />
      </AbsoluteFill>
      <Grain />
      <AbsoluteFill
        name="Fade in"
        style={{
          backgroundColor: "#1e130e",
          pointerEvents: "none",
          opacity: interpolate(frame, [0, 10], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
