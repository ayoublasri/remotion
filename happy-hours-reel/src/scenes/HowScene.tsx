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
import type { HappyHoursReelProps } from "../schema";
import { CARD, CREAM, CREAM_DEEP, GOLD, GREEN, INK, MUTED } from "../theme";

const StepRow: React.FC<{
  readonly index: number;
  readonly title: string;
  readonly subtitle: string;
  readonly at: number;
  readonly children: React.ReactNode;
}> = ({ index, title, subtitle, at, children }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        top: 470 + index * 290,
        width: 920,
        height: 250,
        borderRadius: 30,
        backgroundColor: CARD,
        boxShadow:
          "0 24px 50px rgba(15,92,87,0.12), 0 0 0 1px rgba(196,162,79,0.3)",
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
          backgroundColor: GREEN,
          color: GOLD,
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
            fontSize: 42,
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
          {title}
        </Interactive.Div>
        <Interactive.Div
          name="Step subtitle"
          style={{
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 29,
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
          {subtitle}
        </Interactive.Div>
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
};

// Bars 11-13: how to book, three steps landing two beats apart, then a hold.
export const HowScene: React.FC<{
  readonly how: HappyHoursReelProps["how"];
  readonly site: string;
}> = ({ how, site }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="How scene"
      style={{
        background: `radial-gradient(80% 50% at 50% 30%, ${CREAM} 0%, ${CREAM_DEEP} 100%)`,
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
          padding: "200px 80px 0",
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
            fontSize: 44,
            letterSpacing: "0.14em",
            color: GREEN,
          }}
        />
        <PopLine
          name="How answer"
          text={how.answer}
          at={6}
          style={{
            marginTop: 8,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 90,
            lineHeight: 1.1,
            color: GREEN,
          }}
        />
      </AbsoluteFill>
      <StepRow
        index={0}
        title={how.steps[0].title}
        subtitle={how.steps[0].subtitle}
        at={0}
      >
        <DmPayIllustration
          at={6}
          message={how.dmMessage}
          payLabel={how.payLabel}
          paidLabel={how.paidLabel}
        />
      </StepRow>
      <StepRow
        index={1}
        title={how.steps[1].title}
        subtitle={how.steps[1].subtitle}
        at={28}
      >
        <CodeIllustration at={34} code={how.code} label="VOTRE CODE" />
      </StepRow>
      <StepRow
        index={2}
        title={how.steps[2].title}
        subtitle={how.steps[2].subtitle}
        at={56}
      >
        <BookIllustration at={62} site={site} slotLabel={how.slotLabel} />
      </StepRow>
      <Sfx name="pop" at={112} volume={0.6} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1392,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "16px 36px",
            borderRadius: 999,
            backgroundColor: GREEN,
            color: CREAM,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: "0.04em",
            scale: interpolate(frame, [112, 126], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 12, stiffness: 180, mass: 0.8 }),
              output: "perceptual-scale",
            }),
          }}
        >
          {how.footer}
        </div>
      </div>
      <Flash at={0} peak={0.55} />
    </AbsoluteFill>
  );
};
