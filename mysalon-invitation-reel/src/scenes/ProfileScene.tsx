import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Sfx } from "../components/Sfx";
import { Still } from "../components/Still";
import { SANS } from "../fonts";
import { SAFE, SAFE_WIDTH } from "../layout";
import type { ProfileScene } from "../schema";
import { INK, MUTED, TEAL, WHITE } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Tuesday: Sara's Instagram profile, drawn, with the MySalon link in the bio
// and the booking button. The link lights up, then the button appears.
export const ProfileSceneView: React.FC<{ readonly scene: ProfileScene }> = ({
  scene,
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [scene.at, scene.at + 16], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const glow = interpolate(
    frame,
    [scene.linkAt, scene.linkAt + 10, scene.linkAt + 40, scene.linkAt + 56],
    [0, 1, 1, 0.35],
    clamp,
  );
  const button = interpolate(
    frame,
    [scene.buttonAt, scene.buttonAt + 14],
    [0, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.back(1.6)),
    },
  );

  return (
    <AbsoluteFill name="Profile scene" style={{ overflow: "hidden" }}>
      <Still src={scene.still} blur={16} darken={0.42} />
      <Sfx name="tick" at={scene.linkAt} volume={0.6} />
      <Sfx name="pop" at={scene.buttonAt} volume={0.7} />
      {frame >= scene.at ? (
        <div
          style={{
            position: "absolute",
            left: SAFE.left,
            width: SAFE_WIDTH,
            top: 420,
            boxSizing: "border-box",
            padding: "28px 30px 30px",
            borderRadius: 32,
            backgroundColor: "rgba(255,255,255,0.97)",
            boxShadow: "0 30px 70px rgba(0,0,0,0.3)",
            fontFamily: SANS,
            opacity: enter,
            translate: `0px ${(1 - enter) * 60}px`,
            scale: String(0.96 + 0.04 * enter),
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 26,
            }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                flexShrink: 0,
                backgroundColor: "#f3c4c4",
                boxShadow: "0 0 0 4px #ffffff, 0 0 0 7px #e1306c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 50,
                color: INK,
              }}
            >
              {scene.name.slice(0, 1)}
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                textAlign: "center",
              }}
            >
              {scene.stats.map((st) => (
                <div key={st.label}>
                  <div style={{ fontWeight: 800, fontSize: 34, color: INK }}>
                    {st.value}
                  </div>
                  <div style={{ fontWeight: 500, fontSize: 22, color: MUTED }}>
                    {st.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              marginTop: 22,
              fontWeight: 700,
              fontSize: 30,
              color: INK,
            }}
          >
            {scene.name}
          </div>
          {scene.bio.map((line) => (
            <div
              key={line}
              style={{
                marginTop: 4,
                fontWeight: 500,
                fontSize: 27,
                color: INK,
              }}
            >
              {line}
            </div>
          ))}
          <Interactive.Div
            name="Profile link"
            style={{
              marginTop: 10,
              display: "inline-flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              padding: "6px 14px",
              marginLeft: -14,
              borderRadius: 14,
              backgroundColor: `rgba(15,92,87,${0.14 * glow})`,
              boxShadow: `0 0 0 ${3 * glow}px rgba(15,92,87,${0.35 * glow})`,
              fontWeight: 700,
              fontSize: 27,
              color: "#00376b",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24">
              <path
                d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"
                fill="none"
                stroke="#00376b"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
            {scene.link}
          </Interactive.Div>
          <div
            style={{
              marginTop: 22,
              display: "flex",
              flexDirection: "row",
              gap: 14,
            }}
          >
            <Interactive.Div
              name="Profile booking button"
              style={{
                flex: 1.4,
                height: 68,
                borderRadius: 14,
                backgroundColor: TEAL,
                color: WHITE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 28,
                opacity: button,
                scale: String(0.8 + 0.2 * button),
              }}
            >
              {scene.button}
            </Interactive.Div>
            {scene.secondary.map((label) => (
              <div
                key={label}
                style={{
                  flex: 1,
                  height: 68,
                  borderRadius: 14,
                  backgroundColor: "#efefef",
                  color: INK,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontSize: 26,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
