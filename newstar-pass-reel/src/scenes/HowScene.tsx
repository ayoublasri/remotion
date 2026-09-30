import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {
  BookIllustration,
  CodeIllustration,
  DmPayIllustration,
} from "../components/Illustrations";
import { Flash } from "../components/Overlays";
import { Sfx } from "../components/Sfx";
import { PopLine, RiseLine } from "../components/Text";
import { DISPLAY, SANS, SERIF } from "../fonts";
import type { PassReelProps, Step } from "../schema";
import { CARD, BLUSH, BLUSH_DEEP, ROSE, PLUM, INK, MUTED } from "../theme";

const StepRow: React.FC<{
  readonly index: number;
  readonly step: Step;
  readonly at: number;
  readonly children: React.ReactNode;
}> = ({ index, step, at, children }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        top: 500 + index * 300,
        width: 920,
        height: 260,
        borderRadius: 30,
        backgroundColor: CARD,
        boxShadow:
          "0 24px 50px rgba(61,20,38,0.12), 0 0 0 1px rgba(201,120,140,0.3)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 26,
        padding: "0 20px 0 28px",
        boxSizing: "border-box",
        translate: interpolate(
          frame,
          [at, at + 20],
          ["-1200px 0px", "0px 0px"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 15, stiffness: 140, mass: 0.9 }),
          },
        ),
        opacity: interpolate(frame, [at, at + 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <Sfx name="whoosh" at={at} volume={0.45} />
      <div
        style={{
          width: 92,
          height: 92,
          borderRadius: 46,
          backgroundColor: PLUM,
          color: ROSE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: 48,
          flexShrink: 0,
          paddingTop: 4,
          boxSizing: "border-box",
          scale: interpolate(frame, [at + 10, at + 24], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 11, stiffness: 190, mass: 0.7 }),
            output: "perceptual-scale",
          }),
        }}
      >
        {index + 1}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          flex: 1,
          minWidth: 0,
        }}
      >
        <Interactive.Div
          name="Step title"
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 44,
            lineHeight: 1.05,
            color: INK,
            opacity: interpolate(frame, [at + 8, at + 16], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(
              frame,
              [at + 8, at + 22],
              ["0px 18px", "0px 0px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
          }}
        >
          {step.title}
        </Interactive.Div>
        <Interactive.Div
          name="Step subtitle"
          style={{
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 30,
            lineHeight: 1.2,
            color: MUTED,
            opacity: interpolate(frame, [at + 14, at + 22], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(
              frame,
              [at + 14, at + 28],
              ["0px 18px", "0px 0px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
          }}
        >
          {step.subtitle}
        </Interactive.Div>
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
};

// Bars 11-13: how to get the pass, one step per bar.
export const HowScene: React.FC<{
  readonly how: PassReelProps["how"];
  readonly site: string;
}> = ({ how, site }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="How scene"
      style={{
        background: `radial-gradient(80% 50% at 50% 30%, ${BLUSH} 0%, ${BLUSH_DEEP} 100%)`,
        scale: interpolate(frame, [0, 10], [1.04, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }),
      }}
    >
      <AbsoluteFill
        name="Header"
        style={{
          alignItems: "center",
          padding: "220px 80px 0",
          textAlign: "center",
        }}
      >
        <RiseLine
          name="How question"
          text={how.question}
          at={0}
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            fontSize: 46,
            letterSpacing: "0.12em",
            color: PLUM,
          }}
        />
        <PopLine
          name="How answer"
          text={how.answer}
          at={6}
          style={{
            marginTop: 10,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 92,
            lineHeight: 1.1,
            color: PLUM,
          }}
        />
      </AbsoluteFill>
      <StepRow index={0} step={how.steps[0]} at={0}>
        <DmPayIllustration
          at={6}
          message={how.dmMessage}
          payLabel={how.payLabel}
          paidLabel={how.paidLabel}
        />
      </StepRow>
      <StepRow index={1} step={how.steps[1]} at={56}>
        <CodeIllustration at={62} code={how.code} label="VOTRE CODE" />
      </StepRow>
      <StepRow index={2} step={how.steps[2]} at={112}>
        <BookIllustration at={118} site={site} slotLabel={how.slotLabel} />
      </StepRow>
      <Flash at={0} peak={0.55} />
    </AbsoluteFill>
  );
};
