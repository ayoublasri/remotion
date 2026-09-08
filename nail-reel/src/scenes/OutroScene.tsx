import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Grain } from "../components/Overlays";
import { BODY_FONT, DISPLAY_FONT } from "../fonts";
import type { NailReelProps, NailSet } from "../schema";

const PolaroidCard: React.FC<{
  readonly set: NailSet;
  readonly number: number;
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
  readonly delay: number;
}> = ({ set, number, x, y, rotation, delay }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: 290,
        top: 560,
        width: 500,
        height: 640,
        padding: 16,
        paddingBottom: 60,
        borderRadius: 12,
        backgroundColor: "#fff8f6",
        boxShadow: "0 40px 80px rgba(0,0,0,0.55)",
        rotate: `${rotation}deg`,
        translate: interpolate(
          frame,
          [delay, delay + 26],
          [`${x}px 1100px`, `${x}px ${y}px`],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 15, stiffness: 120, mass: 1 }),
          },
        ),
      }}
    >
      <Img
        name="Card photo"
        src={staticFile(`images/${set.image}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${set.focusX}% 50%`,
          borderRadius: 4,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 22,
          left: 22,
          width: 92,
          height: 92,
          borderRadius: 46,
          backgroundColor: set.accent,
          color: "#ffffff",
          fontFamily: DISPLAY_FONT,
          fontSize: 54,
          lineHeight: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 6,
          boxShadow: "0 10px 24px rgba(0,0,0,0.4)",
        }}
      >
        {number}
      </div>
    </div>
  );
};

// Closing beat: the three sets fan out as polaroids and the copy asks
// viewers to comment their favourite (comment bait = reach).
export const OutroScene: React.FC<{
  readonly sets: NailSet[];
  readonly outro: NailReelProps["outro"];
  readonly handle: string;
}> = ({ sets, outro, handle }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Outro scene"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 38%, #4a0d1d 0%, #1c060b 55%, #0b0709 100%)",
      }}
    >
      <Interactive.Div
        name="Outro title"
        style={{
          position: "absolute",
          top: 230,
          left: 0,
          width: "100%",
          textAlign: "center",
          fontFamily: DISPLAY_FONT,
          fontSize: 170,
          lineHeight: 1,
          color: "#ffffff",
          rotate: "-2deg",
          textShadow: "0 16px 50px rgba(0,0,0,0.5)",
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
        {outro.title}
      </Interactive.Div>
      <PolaroidCard
        set={sets[0]}
        number={1}
        x={-205}
        y={50}
        rotation={-9}
        delay={8}
      />
      <PolaroidCard
        set={sets[2]}
        number={3}
        x={205}
        y={60}
        rotation={8}
        delay={14}
      />
      <PolaroidCard
        set={sets[1]}
        number={2}
        x={0}
        y={-10}
        rotation={2}
        delay={20}
      />
      <Interactive.Div
        name="Outro CTA"
        style={{
          position: "absolute",
          top: 1290,
          left: 0,
          width: "100%",
          textAlign: "center",
          fontFamily: BODY_FONT,
          fontWeight: 800,
          fontSize: 62,
          color: "#ffffff",
          translate: interpolate(frame, [34, 50], ["0px 60px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          opacity: interpolate(frame, [34, 44], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(
            frame,
            [56, 62, 68, 74, 80],
            [1, 1.06, 1, 1.06, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              output: "perceptual-scale",
            },
          ),
        }}
      >
        {outro.cta}
      </Interactive.Div>
      <Interactive.Div
        name="Outro footer"
        style={{
          position: "absolute",
          top: 1400,
          left: 0,
          width: "100%",
          textAlign: "center",
          fontFamily: BODY_FONT,
          fontWeight: 600,
          fontSize: 36,
          letterSpacing: "0.06em",
          color: "rgba(255,255,255,0.72)",
          opacity: interpolate(frame, [44, 56], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {`${handle} · ${outro.footer}`}
      </Interactive.Div>
      <Grain />
    </AbsoluteFill>
  );
};
