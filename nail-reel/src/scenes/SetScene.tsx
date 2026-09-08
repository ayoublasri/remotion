import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { HandleChip } from "../components/HandleChip";
import { Grain, Vignette } from "../components/Overlays";
import { Photo } from "../components/Photo";
import { ShineSweep } from "../components/ShineSweep";
import { Sparkles } from "../components/Sparkles";
import { ACCENT_FONT, BODY_FONT, DISPLAY_FONT } from "../fonts";
import type { NailSet } from "../schema";

const Tag: React.FC<{ readonly label: string; readonly delay: number }> = ({
  label,
  delay,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        padding: "14px 26px",
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.14)",
        border: "1px solid rgba(255,255,255,0.4)",
        backdropFilter: "blur(14px)",
        color: "#ffffff",
        fontFamily: BODY_FONT,
        fontWeight: 600,
        fontSize: 32,
        whiteSpace: "nowrap",
        scale: interpolate(frame, [delay, delay + 16], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 13, stiffness: 160, mass: 0.8 }),
          output: "perceptual-scale",
        }),
        opacity: interpolate(frame, [delay, delay + 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {label}
    </div>
  );
};

// One nail set: slow zoom on the photo, a shine sweep, sparkles,
// an outlined number and a title card in the lower third.
export const SetScene: React.FC<{
  readonly set: NailSet;
  readonly index: number;
  readonly handle: string;
}> = ({ set, index, handle }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill name="Set scene" style={{ backgroundColor: "#0b0709" }}>
      <Photo
        image={set.image}
        focusX={set.focusX}
        zoomFrom={1.04}
        zoomTo={1.16}
        driftX={index % 2 === 0 ? 30 : -30}
        punch={false}
      />
      <ShineSweep />
      <Sparkles sparkles={set.sparkles} />
      <AbsoluteFill
        name="Legibility gradient"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,4,6,0.45) 0%, rgba(8,4,6,0) 24%, rgba(8,4,6,0) 50%, rgba(8,4,6,0.85) 100%)",
          pointerEvents: "none",
        }}
      />
      <Vignette />
      <HandleChip handle={handle} />
      <Interactive.Div
        name="Set number"
        style={{
          position: "absolute",
          top: 226,
          left: 72,
          fontFamily: DISPLAY_FONT,
          fontSize: 250,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: "3px rgba(255,255,255,0.9)",
          translate: interpolate(frame, [0, 18], ["-100px 0px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
          }),
          opacity: interpolate(frame, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {`0${index + 1}`}
      </Interactive.Div>
      <AbsoluteFill
        name="Title card"
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: "0 80px 520px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", gap: 30 }}>
          <Interactive.Div
            name="Accent bar"
            style={{
              width: 10,
              borderRadius: 5,
              backgroundColor: set.accent,
              translate: interpolate(frame, [2, 18], ["0px 60px", "0px 0px"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
              opacity: interpolate(frame, [2, 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Interactive.Div
              name="Set title"
              style={{
                fontFamily: ACCENT_FONT,
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: 108,
                lineHeight: 1,
                color: "#ffffff",
                textShadow: "0 10px 40px rgba(0,0,0,0.6)",
                translate: interpolate(
                  frame,
                  [4, 20],
                  ["0px 70px", "0px 0px"],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  },
                ),
                opacity: interpolate(frame, [4, 14], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              {set.title}
            </Interactive.Div>
            <Interactive.Div
              name="Set subtitle"
              style={{
                fontFamily: BODY_FONT,
                fontWeight: 800,
                fontSize: 34,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: set.accent,
                translate: interpolate(
                  frame,
                  [10, 26],
                  ["0px 50px", "0px 0px"],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  },
                ),
                opacity: interpolate(frame, [10, 20], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              {set.subtitle}
            </Interactive.Div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 14,
                marginTop: 8,
              }}
            >
              {set.tags.map((tag, i) => (
                <Tag key={tag} label={tag} delay={18 + i * 5} />
              ))}
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};
