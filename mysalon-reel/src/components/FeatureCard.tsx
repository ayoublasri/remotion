import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS } from "../fonts";
import type { Feature } from "../schema";
import { FeatureIconGlyph } from "./Icons";

// Card at the top of the product scene naming the feature the phone is demonstrating.
export const FeatureCard: React.FC<{
  readonly feature: Feature;
  readonly step: number;
  readonly total: number;
}> = ({ feature, step, total }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: 226,
        height: 200,
        borderRadius: 32,
        backgroundColor: "#ffffff",
        boxShadow: "0 24px 60px rgba(15,61,58,0.14)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 28,
        padding: "0 36px",
        boxSizing: "border-box",
        translate: interpolate(frame, [0, 14], ["0px 40px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        scale: interpolate(frame, [0, 14], [0.96, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        opacity: interpolate(
          frame,
          [0, 8, durationInFrames - 8, durationInFrames - 1],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        ),
      }}
    >
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: "#0f5c57",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 12px 26px rgba(15,92,87,0.3)",
        }}
      >
        <FeatureIconGlyph
          name={feature.icon}
          size={50}
          color="#ffffff"
          strokeWidth={2.2}
        />
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 46,
            color: "#1a1a1a",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
          }}
        >
          {feature.title}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 30,
            color: "#5d5d5d",
            lineHeight: 1.2,
          }}
        >
          {feature.description}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 32,
          top: 20,
          display: "flex",
          flexDirection: "row",
          gap: 6,
        }}
      >
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            style={{
              width: i === step ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === step ? "#b81238" : "#e4dcd8",
            }}
          />
        ))}
      </div>
    </div>
  );
};
