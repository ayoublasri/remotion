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
import type { AgendaScene } from "../schema";
import { INK, MUTED, TEAL, WHITE } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PAD = 24;
const GUTTER = 58;
const ROW = 62;
const TONES = [
  { bg: "rgba(15,92,87,0.14)", bar: "#0f5c57", text: "#0a3f3b" },
  { bg: "rgba(31,157,111,0.16)", bar: "#1f9d6f", text: "#135f44" },
  { bg: "rgba(225,48,108,0.12)", bar: "#d9748f", text: "#8a2f4a" },
];

// This week: Sara's agenda on MySalon, drawn, filling up booking by booking
// while she works. The one Nada made is the highlighted block.
export const AgendaSceneView: React.FC<{ readonly scene: AgendaScene }> = ({
  scene,
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [scene.at, scene.at + 16], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const arrived = scene.bookings.filter((b) => frame >= b.at);
  const count = arrived.length;
  const lastAt = count > 0 ? arrived[count - 1].at : -100;
  const bump = interpolate(
    frame,
    [lastAt, lastAt + 3, lastAt + 10],
    [1, 1.12, 1],
    clamp,
  );
  const cols = scene.days.length;
  const gridWidth = SAFE_WIDTH - 2 * PAD - GUTTER;
  const colWidth = gridWidth / cols;
  const rows = scene.hourTo - scene.hourFrom;
  const label =
    count <= 1 && scene.counterLabel.endsWith("s")
      ? scene.counterLabel.slice(0, -1)
      : scene.counterLabel;

  return (
    <AbsoluteFill name="Agenda scene" style={{ overflow: "hidden" }}>
      <Still src={scene.still} blur={16} darken={0.42} />
      {scene.bookings.map((b) => (
        <Sfx key={`${b.day}-${b.start}`} name="tick" at={b.at} volume={0.5} />
      ))}
      {count > 0 ? (
        <Interactive.Div
          name="Bookings counter"
          style={{
            position: "absolute",
            right: 1080 - SAFE.right,
            top: SAFE.top + 6,
            padding: "12px 26px",
            borderRadius: 999,
            backgroundColor: TEAL,
            boxShadow: "0 12px 30px rgba(15,92,87,0.35)",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 30,
            color: WHITE,
            whiteSpace: "nowrap",
            scale: String(bump),
          }}
        >
          {`+${count} ${label}`}
        </Interactive.Div>
      ) : null}
      {frame >= scene.at ? (
        <div
          style={{
            position: "absolute",
            left: SAFE.left,
            width: SAFE_WIDTH,
            top: 400,
            boxSizing: "border-box",
            padding: PAD,
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
              gap: 14,
              height: 56,
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 30, color: INK }}>
              {scene.title}
            </div>
            <div
              style={{ fontWeight: 500, fontSize: 24, color: MUTED, flex: 1 }}
            >
              {scene.range}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                fontWeight: 700,
                fontSize: 21,
                letterSpacing: "0.1em",
                color: TEAL,
              }}
            >
              <StarMark size={20} color={TEAL} />
              MYSALON
            </div>
          </div>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              flexDirection: "row",
              marginLeft: GUTTER,
            }}
          >
            {scene.days.map((d, i) => (
              <div
                key={d}
                style={{
                  width: colWidth,
                  textAlign: "center",
                  fontWeight: i === scene.todayIndex ? 800 : 600,
                  fontSize: 20,
                  lineHeight: 1.2,
                  whiteSpace: "pre-line",
                  color: i === scene.todayIndex ? TEAL : INK,
                }}
              >
                {d}
              </div>
            ))}
          </div>
          <div
            style={{
              position: "relative",
              marginTop: 12,
              height: rows * ROW,
            }}
          >
            {Array.from({ length: rows + 1 }, (_, r) => (
              <div key={r}>
                <div
                  style={{
                    position: "absolute",
                    left: GUTTER,
                    right: 0,
                    top: r * ROW,
                    height: 1,
                    backgroundColor: "rgba(26,26,26,0.1)",
                  }}
                />
                {r < rows ? (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: r * ROW - 11,
                      width: GUTTER - 10,
                      textAlign: "right",
                      fontWeight: 600,
                      fontSize: 18,
                      color: MUTED,
                    }}
                  >
                    {`${scene.hourFrom + r}:00`}
                  </div>
                ) : null}
              </div>
            ))}
            {scene.days.map((d, i) => (
              <div
                key={`col-${d}`}
                style={{
                  position: "absolute",
                  left: GUTTER + i * colWidth,
                  top: 0,
                  bottom: 0,
                  width: 1,
                  backgroundColor: "rgba(26,26,26,0.06)",
                }}
              />
            ))}
            {scene.bookings.map((b, k) => {
              if (frame < b.at) return null;
              const pop = interpolate(frame, [b.at, b.at + 12], [0, 1], {
                ...clamp,
                easing: Easing.out(Easing.back(1.6)),
              });
              const tone = TONES[k % TONES.length];
              return (
                <Interactive.Div
                  key={`${b.day}-${b.start}`}
                  name={`Booking ${b.client}`}
                  style={{
                    position: "absolute",
                    left: GUTTER + b.day * colWidth + 4,
                    top: (b.start - scene.hourFrom) * ROW + 3,
                    width: colWidth - 8,
                    height: b.hours * ROW - 6,
                    boxSizing: "border-box",
                    padding: "5px 8px",
                    borderRadius: 10,
                    overflow: "hidden",
                    backgroundColor: b.highlight ? TEAL : tone.bg,
                    borderLeft: `4px solid ${b.highlight ? "#0a3f3b" : tone.bar}`,
                    color: b.highlight ? WHITE : tone.text,
                    opacity: pop,
                    scale: String(0.7 + 0.3 * pop),
                    transformOrigin: "50% 50%",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 21,
                      lineHeight: 1.15,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {b.client}
                  </div>
                  <div
                    style={{
                      fontWeight: 500,
                      fontSize: 18,
                      lineHeight: 1.15,
                      opacity: 0.85,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {b.service}
                  </div>
                </Interactive.Div>
              );
            })}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
