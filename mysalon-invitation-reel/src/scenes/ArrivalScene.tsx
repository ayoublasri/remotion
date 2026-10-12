import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { StarMark } from "../components/Brand";
import { CheckIcon } from "../components/Icons";
import { Sfx } from "../components/Sfx";
import { Still } from "../components/Still";
import { SANS } from "../fonts";
import { SAFE, SAFE_WIDTH } from "../layout";
import type { ArrivalScene } from "../schema";
import { INK, MUTED, TEAL, WHITE } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const GREEN = "#1f9d6f";

// Saturday, 11:02: Nada checked in on the salon's MySalon, and her loyalty
// card gains a stamp. Drawn, so it reads at a glance.
export const ArrivalSceneView: React.FC<{ readonly scene: ArrivalScene }> = ({
  scene,
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [scene.at, scene.at + 16], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const check = interpolate(
    frame,
    [scene.checkAt, scene.checkAt + 12],
    [0, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.back(1.8)),
    },
  );
  const stamp = interpolate(
    frame,
    [scene.stampAt, scene.stampAt + 14],
    [0, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.back(2)),
    },
  );
  const plus = interpolate(
    frame,
    [scene.stampAt, scene.stampAt + 8, scene.stampAt + 40, scene.stampAt + 52],
    [0, 1, 1, 0],
    clamp,
  );
  const filled = scene.points.from + (frame >= scene.stampAt ? 1 : 0);

  return (
    <AbsoluteFill name="Arrival scene" style={{ overflow: "hidden" }}>
      <Still src={scene.still} blur={16} darken={0.42} />
      <Sfx name="success" at={scene.checkAt} volume={0.9} />
      <Sfx name="sparkle" at={scene.stampAt} volume={0.7} />
      {frame >= scene.at ? (
        <div
          style={{
            position: "absolute",
            left: SAFE.left,
            width: SAFE_WIDTH,
            top: 470,
            boxSizing: "border-box",
            padding: "26px 30px 30px",
            borderRadius: 32,
            backgroundColor: "rgba(255,255,255,0.96)",
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
              gap: 14,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: TEAL,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StarMark size={26} color={WHITE} />
            </div>
            <span
              style={{
                flex: 1,
                fontWeight: 700,
                fontSize: 24,
                letterSpacing: "0.14em",
                color: MUTED,
              }}
            >
              {scene.app}
            </span>
            <span style={{ fontWeight: 500, fontSize: 24, color: MUTED }}>
              {scene.time}
            </span>
          </div>
          <div
            style={{
              marginTop: 24,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: 42,
                backgroundColor: "#f3c4c4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 38,
                color: INK,
              }}
            >
              {scene.client.slice(0, 1)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 36, color: INK }}>
                {scene.client}
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontWeight: 500,
                  fontSize: 28,
                  color: MUTED,
                }}
              >
                {scene.detail}
              </div>
            </div>
            <Interactive.Div
              name="Arrival status"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                padding: "10px 20px 10px 12px",
                borderRadius: 999,
                backgroundColor: GREEN,
                color: WHITE,
                fontWeight: 700,
                fontSize: 26,
                whiteSpace: "nowrap",
                opacity: check,
                scale: String(0.6 + 0.4 * check),
              }}
            >
              <CheckIcon size={28} color={WHITE} />
              {scene.status}
            </Interactive.Div>
          </div>
          <div
            style={{
              marginTop: 26,
              height: 2,
              backgroundColor: "rgba(26,26,26,0.08)",
            }}
          />
          <div
            style={{
              marginTop: 22,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span
              style={{ flex: 1, fontWeight: 700, fontSize: 28, color: INK }}
            >
              {scene.points.label}
            </span>
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                gap: 12,
              }}
            >
              {Array.from({ length: scene.points.max }, (_, i) => {
                const isNew = i === scene.points.from;
                const on = i < filled;
                return (
                  <div
                    key={i}
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 23,
                      boxSizing: "border-box",
                      border: `3px solid ${TEAL}`,
                      backgroundColor: on ? TEAL : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      scale: isNew && on ? String(0.6 + 0.4 * stamp) : "1",
                    }}
                  >
                    {on ? <CheckIcon size={24} color={WHITE} /> : null}
                  </div>
                );
              })}
              <div
                style={{
                  position: "absolute",
                  right: -8,
                  top: -54,
                  padding: "6px 14px",
                  borderRadius: 999,
                  backgroundColor: GREEN,
                  color: WHITE,
                  fontWeight: 800,
                  fontSize: 26,
                  whiteSpace: "nowrap",
                  opacity: plus,
                  translate: `0px ${(1 - plus) * 14}px`,
                }}
              >
                +1
              </div>
            </div>
            <span
              style={{
                fontWeight: 700,
                fontSize: 28,
                color: TEAL,
                minWidth: 90,
                textAlign: "right",
              }}
            >
              {`${filled}/${scene.points.max}`}
            </span>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
