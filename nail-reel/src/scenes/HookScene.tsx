import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Grain, Vignette } from "../components/Overlays";
import { Photo } from "../components/Photo";
import { ACCENT_FONT, DISPLAY_FONT } from "../fonts";
import type { NailReelProps, NailSet } from "../schema";

// First 2 seconds: hard punch-in on the hero photo + a three-line hook
// that pops in word group by word group.
export const HookScene: React.FC<{
  readonly hook: NailReelProps["hook"];
  readonly set: NailSet;
}> = ({ hook, set }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill name="Hook scene" style={{ backgroundColor: "#0b0709" }}>
      <Photo
        image={set.image}
        focusX={set.focusX}
        zoomFrom={1.6}
        zoomTo={1.18}
        driftX={0}
        punch
      />
      <AbsoluteFill
        name="Darken"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,4,6,0.30) 0%, rgba(8,4,6,0.55) 50%, rgba(8,4,6,0.85) 100%)",
        }}
      />
      <Vignette />
      <AbsoluteFill
        name="Hook text"
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 26,
          padding: "0 80px",
        }}
      >
        <Interactive.Div
          name="Hook top"
          style={{
            fontFamily: DISPLAY_FONT,
            fontSize: 150,
            lineHeight: 1,
            color: "#ffffff",
            backgroundColor: "#ff2a55",
            padding: "16px 36px 6px",
            borderRadius: 8,
            rotate: "-3deg",
            boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
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
          {hook.top}
        </Interactive.Div>
        <Interactive.Div
          name="Hook middle"
          style={{
            fontFamily: ACCENT_FONT,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 92,
            lineHeight: 1.1,
            color: "#ffd6df",
            textShadow: "0 8px 30px rgba(0,0,0,0.6)",
            translate: interpolate(frame, [12, 28], ["0px 50px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            opacity: interpolate(frame, [12, 22], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {hook.middle}
        </Interactive.Div>
        <Interactive.Div
          name="Hook bottom"
          style={{
            fontFamily: DISPLAY_FONT,
            fontSize: 150,
            lineHeight: 1,
            color: "#ffffff",
            textShadow: "0 14px 40px rgba(0,0,0,0.6)",
            scale: interpolate(frame, [20, 36], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 12, stiffness: 170, mass: 0.8 }),
              output: "perceptual-scale",
            }),
            opacity: interpolate(frame, [20, 24], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {hook.bottom}
        </Interactive.Div>
      </AbsoluteFill>
      <Grain />
      <AbsoluteFill
        name="Shutter flash"
        style={{
          backgroundColor: "#ffffff",
          pointerEvents: "none",
          opacity: interpolate(frame, [0, 9], [0.75, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.quad),
          }),
        }}
      />
    </AbsoluteFill>
  );
};
