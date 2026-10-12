import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { StarMark } from "../components/Brand";
import { Sfx } from "../components/Sfx";
import { Still } from "../components/Still";
import { SANS } from "../fonts";
import { SAFE, SAFE_WIDTH } from "../layout";
import type { NotificationScene } from "../schema";
import { INK, MUTED, TEAL, WHITE } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Thursday, 14:03: Sara's phone gets the booking, on a frozen frame of the
// ad. She did nothing.
export const NotificationSceneView: React.FC<{
  readonly scene: NotificationScene;
}> = ({ scene }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [scene.at, scene.at + 18], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.2)),
  });

  return (
    <AbsoluteFill name="Notification scene" style={{ overflow: "hidden" }}>
      <Still src={scene.still} blur={16} darken={0.42} />
      <Sfx name="ding" at={scene.at} volume={0.9} />
      {frame >= scene.at ? (
        <Interactive.Div
          name="Booking notification"
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
            opacity: enter,
            translate: `0px ${(enter - 1) * 260}px`,
            scale: String(0.94 + 0.06 * enter),
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: TEAL,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StarMark size={34} color={WHITE} />
            </div>
            <span
              style={{
                flex: 1,
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 24,
                letterSpacing: "0.14em",
                color: MUTED,
              }}
            >
              {scene.app}
            </span>
            <span
              style={{
                fontFamily: SANS,
                fontWeight: 500,
                fontSize: 24,
                color: MUTED,
              }}
            >
              maintenant
            </span>
          </div>
          <div
            style={{
              marginTop: 18,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 40,
              color: INK,
            }}
          >
            {scene.title}
          </div>
          <div
            style={{
              marginTop: 8,
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 32,
              color: INK,
              opacity: 0.8,
            }}
          >
            {scene.body}
          </div>
        </Interactive.Div>
      ) : null}
    </AbsoluteFill>
  );
};
