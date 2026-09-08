import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { LogoBadge } from "../components/Logo";
import { Flash, Twinkles } from "../components/Overlays";
import { SANS } from "../fonts";

// Bar 3: the drop. The logo slams in on the crash.
export const LogoScene: React.FC<{
  readonly logo: string;
  readonly handle: string;
}> = ({ logo, handle }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Logo scene"
      style={{
        background:
          "radial-gradient(70% 45% at 50% 46%, #fbf5ea 0%, #f6efe2 55%, #eadfcc 100%)",
        justifyContent: "center",
        alignItems: "center",
        gap: 44,
        scale: interpolate(frame, [0, 12], [1.06, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }),
      }}
    >
      <Twinkles
        points={[
          { x: 22, y: 30 },
          { x: 78, y: 26 },
          { x: 18, y: 68 },
          { x: 82, y: 66 },
        ]}
        color="#c4a24f"
      />
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
        <LogoBadge image={logo} size={660} ring />
      </div>
      <Interactive.Div
        name="Handle"
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 42,
          color: "#1f4b3c",
          letterSpacing: "0.02em",
          opacity: interpolate(frame, [14, 22], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [14, 28], ["0px 24px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {handle}
      </Interactive.Div>
      <Flash at={0} peak={0.7} />
    </AbsoluteFill>
  );
};
