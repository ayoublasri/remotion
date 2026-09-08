import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { SANS, SERIF } from "../fonts";
import { MissedCallIcon } from "../components/Icons";
import type { MySalonReelProps } from "../schema";

const MissedCall: React.FC<{
  readonly title: string;
  readonly subtitle: string;
  readonly time: string;
  readonly delay: number;
  readonly top: number;
  readonly rotation: number;
  readonly badge: number | null;
}> = ({ title, subtitle, time, delay, top, rotation, badge }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top,
        height: 140,
        borderRadius: 28,
        backgroundColor: "#1b4f4a",
        boxShadow:
          "0 30px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 26,
        padding: "0 34px",
        boxSizing: "border-box",
        rotate: `${rotation}deg`,
        translate: interpolate(
          frame,
          [delay, delay + 22],
          ["0px -460px", "0px 0px"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 14, stiffness: 130, mass: 1 }),
          },
        ),
        opacity: interpolate(frame, [delay, delay + 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: "#e8365d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <MissedCallIcon size={36} color="#ffffff" strokeWidth={3} />
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 40,
            color: "#ffffff",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 28,
            color: "#9fcac4",
          }}
        >
          {subtitle}
        </div>
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 28,
          color: "#9fcac4",
        }}
      >
        {time}
      </div>
      {badge === null ? null : (
        <div
          style={{
            position: "absolute",
            top: -16,
            right: -12,
            width: 54,
            height: 54,
            borderRadius: 27,
            backgroundColor: "#e8365d",
            color: "#ffffff",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
            scale: interpolate(frame, [delay + 18, delay + 32], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 10, stiffness: 180, mass: 0.7 }),
              output: "perceptual-scale",
            }),
          }}
        >
          {badge}
        </div>
      )}
    </div>
  );
};

const HookLine: React.FC<{
  readonly text: string;
  readonly at: number;
  readonly color: string;
  readonly size: number;
}> = ({ text, at, color, size }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        fontFamily: SERIF,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.12,
        color,
        textShadow: "0 12px 40px rgba(0,0,0,0.35)",
        scale: interpolate(frame, [at, at + 16], [0.8, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 13, stiffness: 160, mass: 0.8 }),
          output: "perceptual-scale",
        }),
        opacity: interpolate(frame, [at, at + 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {text}
    </div>
  );
};

// Pain hook: missed calls pile up while the owner's hands are busy.
export const HookScene: React.FC<{
  readonly hook: MySalonReelProps["hook"];
}> = ({ hook }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Hook scene"
      style={{
        background:
          "radial-gradient(90% 60% at 50% 30%, #1a5450 0%, #0f3d3a 60%, #0a2d2b 100%)",
      }}
    >
      <AbsoluteFill
        name="Notifications"
        style={{
          translate: interpolate(
            frame,
            [12, 14, 16, 18, 20, 24, 26, 28, 30, 32, 36, 38, 40, 42, 44],
            [
              "0px 0px",
              "5px 0px",
              "-5px 0px",
              "3px 0px",
              "0px 0px",
              "0px 0px",
              "5px 0px",
              "-5px 0px",
              "3px 0px",
              "0px 0px",
              "0px 0px",
              "6px 0px",
              "-6px 0px",
              "4px 0px",
              "0px 0px",
            ],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
        }}
      >
        <MissedCall
          title="Numéro inconnu"
          subtitle="Appel manqué"
          time="10:12"
          delay={4}
          top={330}
          rotation={-1.5}
          badge={null}
        />
        <MissedCall
          title="Nouvelle cliente ?"
          subtitle="Appel manqué"
          time="13:47"
          delay={16}
          top={496}
          rotation={1}
          badge={null}
        />
        <MissedCall
          title="Appel manqué (3)"
          subtitle="Aujourd'hui"
          time="18:05"
          delay={28}
          top={662}
          rotation={-0.6}
          badge={3}
        />
      </AbsoluteFill>
      <Interactive.Div
        name="Hook text"
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 930,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 16,
        }}
      >
        <HookLine text={hook.line1} at={46} color="#ffffff" size={84} />
        <HookLine text={hook.line2} at={56} color="#ffffff" size={84} />
        <HookLine text={hook.line3} at={68} color="#f47c97" size={84} />
      </Interactive.Div>
    </AbsoluteFill>
  );
};
