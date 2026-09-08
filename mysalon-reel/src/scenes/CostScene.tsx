import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { SANS, SERIF } from "../fonts";
import type { MySalonReelProps } from "../schema";

const LostAmount: React.FC<{
  readonly label: string;
  readonly amount: string;
  readonly at: number;
}> = ({ label, amount, at }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        scale: interpolate(frame, [at, at + 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 12, stiffness: 170, mass: 0.8 }),
          output: "perceptual-scale",
        }),
        translate: interpolate(
          frame,
          [at + 24, at + 38],
          ["0px 0px", "0px 34px"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.4, 0, 0.6, 1),
          },
        ),
        opacity: interpolate(
          frame,
          [at, at + 4, at + 24, at + 38],
          [0, 1, 1, 0.35],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        ),
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 26,
          color: "#9fcac4",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: "relative",
          fontFamily: SERIF,
          fontWeight: 900,
          fontSize: 58,
          color: "#ffffff",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {amount}
        <div
          style={{
            position: "absolute",
            left: -8,
            right: -8,
            top: "50%",
            height: 8,
            marginTop: -4,
            borderRadius: 4,
            backgroundColor: "#e8365d",
            transformOrigin: "left center",
            scale: interpolate(frame, [at + 22, at + 30], ["0 1", "1 1"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        />
      </div>
    </div>
  );
};

// "Every missed call is a lost client": the money that walks out of the door.
export const CostScene: React.FC<{
  readonly cost: MySalonReelProps["cost"];
}> = ({ cost }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Cost scene"
      style={{
        background:
          "radial-gradient(90% 60% at 50% 35%, #1a5450 0%, #0f3d3a 60%, #0a2d2b 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 560,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="Cost line 1"
          style={{
            fontFamily: SERIF,
            fontWeight: 900,
            fontSize: 86,
            lineHeight: 1.05,
            color: "#ffffff",
            scale: interpolate(frame, [0, 16], [0.7, 1], {
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
          {cost.line1}
        </Interactive.Div>
        <Interactive.Div
          name="Cost line 2"
          style={{
            fontFamily: SERIF,
            fontWeight: 900,
            fontSize: 116,
            lineHeight: 1.05,
            color: "#f47c97",
            scale: interpolate(frame, [6, 22], [0.7, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 12, stiffness: 170, mass: 0.8 }),
              output: "perceptual-scale",
            }),
            opacity: interpolate(frame, [6, 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {cost.line2}
        </Interactive.Div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1010,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: 48,
        }}
      >
        <LostAmount label="Coupe femme" amount="− 150 DH" at={18} />
        <LostAmount label="Coloration" amount="− 400 DH" at={24} />
        <LostAmount label="Soin visage" amount="− 250 DH" at={30} />
      </div>
      <Interactive.Div
        name="Cost footnote"
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1290,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 40,
          color: "#9fcac4",
          opacity: interpolate(frame, [46, 56], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [46, 60], ["0px 30px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {cost.footnote}
      </Interactive.Div>
    </AbsoluteFill>
  );
};
