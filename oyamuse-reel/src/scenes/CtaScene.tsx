import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Flash, Grain, Twinkles } from "../components/Overlays";
import { SANS, SERIF } from "../fonts";
import type { OyamuseReelProps } from "../schema";

// Bars 11-12: a wall of the work behind the booking call to action.
export const CtaScene: React.FC<{
  readonly cta: OyamuseReelProps["cta"];
  readonly handle: string;
  readonly images: string[];
}> = ({ cta, handle, images }) => {
  const frame = useCurrentFrame();
  const tiles = Array.from({ length: 12 }, (_, i) => images[i % images.length]);

  return (
    <AbsoluteFill
      name="CTA scene"
      style={{ backgroundColor: "#1e130e", overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          left: -20,
          top: -80,
          width: 1120,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
          translate: interpolate(frame, [0, 144], ["0px 0px", "0px -110px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [0, 20], [1.08, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {tiles.map((image, i) => (
          <div
            key={i}
            style={{ height: 520, borderRadius: 18, overflow: "hidden" }}
          >
            <Img
              src={staticFile(`images/${image}`)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
      <AbsoluteFill
        name="Darken"
        style={{
          background:
            "radial-gradient(70% 55% at 50% 50%, rgba(30,19,14,0.7) 0%, rgba(30,19,14,0.82) 70%, rgba(30,19,14,0.93) 100%)",
        }}
      />
      <Twinkles
        points={[
          { x: 14, y: 22 },
          { x: 86, y: 30 },
          { x: 22, y: 74 },
          { x: 80, y: 70 },
        ]}
        color="#e6cf9f"
      />
      <AbsoluteFill
        name="Copy"
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
          padding: "0 80px",
        }}
      >
        <Interactive.Div
          name="CTA title 1"
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 112,
            lineHeight: 1,
            color: "#ffffff",
            textAlign: "center",
            scale: interpolate(frame, [0, 18], [0.8, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 12, stiffness: 170, mass: 0.8 }),
              output: "perceptual-scale",
            }),
            opacity: interpolate(frame, [0, 6], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {cta.title1}
        </Interactive.Div>
        <Interactive.Div
          name="CTA title 2"
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 100,
            lineHeight: 1,
            color: "#e9c3b6",
            textAlign: "center",
            scale: interpolate(frame, [8, 26], [0.8, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 12, stiffness: 170, mass: 0.8 }),
              output: "perceptual-scale",
            }),
            opacity: interpolate(frame, [8, 14], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {cta.title2}
        </Interactive.Div>
        <Interactive.Div
          name="Handle"
          style={{
            marginTop: 30,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 64,
            color: "#e6cf9f",
            letterSpacing: "-0.01em",
            opacity: interpolate(frame, [18, 28], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [18, 34], ["0px 30px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          {handle}
        </Interactive.Div>
        <div
          style={{
            marginTop: 34,
            scale: interpolate(frame, [36, 52], [0, 1], {
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
              position: "relative",
              overflow: "hidden",
              padding: "0 70px",
              height: 124,
              borderRadius: 62,
              backgroundColor: "#e9c3b6",
              color: "#2a1b14",
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 46,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 24px 60px rgba(233,195,182,0.35)",
              scale: interpolate(frame % 18, [0, 3, 14], [1.035, 1.02, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {cta.button}
            <div
              style={{
                position: "absolute",
                top: -40,
                left: 0,
                width: 120,
                height: 220,
                rotate: "20deg",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0) 100%)",
                pointerEvents: "none",
                translate: interpolate(
                  frame,
                  [66, 92],
                  ["-200px 0px", "900px 0px"],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.4, 0, 0.4, 1),
                  },
                ),
              }}
            />
          </Interactive.Div>
        </div>
        <Interactive.Div
          name="CTA footer"
          style={{
            marginTop: 40,
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 28,
            letterSpacing: "0.36em",
            paddingLeft: "0.36em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
            opacity: interpolate(frame, [54, 66], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {cta.footer}
        </Interactive.Div>
      </AbsoluteFill>
      <Grain />
      <Flash at={0} peak={0.5} />
    </AbsoluteFill>
  );
};
