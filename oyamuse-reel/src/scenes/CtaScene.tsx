import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { LogoBadge } from "../components/Logo";
import { Flash, Twinkles } from "../components/Overlays";
import { DISPLAY, SANS } from "../fonts";
import type { OyamuseReelProps } from "../schema";

// Bars 15-16: the one and only invite. Logo, "Réservez votre moment",
// what for, and where: link in bio.
export const CtaScene: React.FC<{
  readonly cta: OyamuseReelProps["cta"];
  readonly handle: string;
  readonly logo: string;
}> = ({ cta, handle, logo }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="CTA scene"
      style={{
        background:
          "radial-gradient(70% 45% at 50% 40%, #fbf5ea 0%, #f6efe2 55%, #eadfcc 100%)",
        overflow: "hidden",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={1500}
        height={1500}
        style={{
          position: "absolute",
          left: -210,
          top: 210,
          opacity: 0.05,
          rotate: `${interpolate(frame, [0, 112], [0, 22])}deg`,
        }}
      >
        <rect
          x="22"
          y="22"
          width="56"
          height="56"
          fill="none"
          stroke="#1f4b3c"
          strokeWidth="1.2"
        />
        <rect
          x="22"
          y="22"
          width="56"
          height="56"
          fill="none"
          stroke="#1f4b3c"
          strokeWidth="1.2"
          transform="rotate(45 50 50)"
        />
      </svg>
      <Twinkles
        points={[
          { x: 16, y: 26 },
          { x: 84, y: 22 },
          { x: 14, y: 62 },
          { x: 86, y: 58 },
        ]}
        color="#c4a24f"
      />
      <AbsoluteFill
        name="Copy"
        style={{ alignItems: "center", padding: "250px 80px 0" }}
      >
        <div
          style={{
            scale: interpolate(frame, [0, 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 11, stiffness: 160, mass: 0.9 }),
              output: "perceptual-scale",
            }),
          }}
        >
          <LogoBadge image={logo} size={400} ring />
        </div>
        <Interactive.Div
          name="CTA title 1"
          style={{
            marginTop: 70,
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 92,
            lineHeight: 1,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#1f4b3c",
            textAlign: "center",
            scale: interpolate(frame, [14, 30], [0.8, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 12, stiffness: 180, mass: 0.8 }),
              output: "perceptual-scale",
            }),
            opacity: interpolate(frame, [14, 20], [0, 1], {
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
            marginTop: 18,
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 92,
            lineHeight: 1,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#1f4b3c",
            textAlign: "center",
            scale: interpolate(frame, [21, 37], [0.8, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 12, stiffness: 180, mass: 0.8 }),
              output: "perceptual-scale",
            }),
            opacity: interpolate(frame, [21, 27], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {cta.title2}
        </Interactive.Div>
        <Interactive.Div
          name="CTA subtitle"
          style={{
            marginTop: 34,
            fontFamily: DISPLAY,
            fontWeight: 600,
            fontSize: 38,
            letterSpacing: "0.34em",
            paddingLeft: "0.34em",
            textTransform: "uppercase",
            color: "#c4a24f",
            textAlign: "center",
            opacity: interpolate(frame, [42, 50], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [42, 56], ["0px 24px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          {cta.subtitle}
        </Interactive.Div>
        <div
          style={{
            marginTop: 64,
            scale: interpolate(frame, [56, 72], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 11, stiffness: 170, mass: 0.8 }),
              output: "perceptual-scale",
            }),
          }}
        >
          <Interactive.Div
            name="CTA button"
            style={{
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 22,
              padding: "0 76px",
              height: 130,
              borderRadius: 65,
              backgroundColor: "#1f4b3c",
              color: "#f6efe2",
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 50,
              boxShadow: "0 26px 60px rgba(31,75,60,0.35)",
              scale: interpolate(frame % 14, [0, 3, 11], [1.04, 1.025, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <svg
              width="46"
              height="46"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f6efe2"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17 17 7" />
              <path d="M8 7h9v9" />
            </svg>
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
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)",
                pointerEvents: "none",
                translate: interpolate(
                  frame,
                  [74, 98],
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
          name="Handle"
          style={{
            marginTop: 40,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 42,
            color: "rgba(31,75,60,0.75)",
            opacity: interpolate(frame, [70, 80], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {handle}
        </Interactive.Div>
      </AbsoluteFill>
      <Flash at={0} peak={0.7} />
    </AbsoluteFill>
  );
};
