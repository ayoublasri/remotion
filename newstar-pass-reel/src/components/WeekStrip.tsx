import { Easing, interpolate, useCurrentFrame } from "remotion";
import { DISPLAY } from "../fonts";
import { ROSE, PLUM_DEEP } from "../theme";
import { Sfx } from "./Sfx";

const DAYS = ["L", "M", "M", "J", "V", "S", "D"];

// Seven day pills; the active ones light up one after another on the beat.
export const WeekStrip: React.FC<{
  readonly activeDays: readonly number[];
  readonly at: number;
  readonly spacing: number;
}> = ({ activeDays, at, spacing }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 16,
        justifyContent: "center",
      }}
    >
      {activeDays.map((_, i) => (
        <Sfx key={i} name="tick" at={at + i * spacing} volume={0.6} />
      ))}
      {DAYS.map((day, i) => {
        const order = activeDays.indexOf(i);
        const lightAt = order === -1 ? null : at + order * spacing;
        const lit = lightAt !== null && frame >= lightAt;

        return (
          <div
            key={`${day}-${i}`}
            style={{
              width: 112,
              height: 136,
              borderRadius: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: 54,
              color: lit ? PLUM_DEEP : "rgba(236,213,206,0.45)",
              backgroundColor: lit ? ROSE : "rgba(236,213,206,0.08)",
              boxShadow: lit
                ? "0 18px 40px rgba(201,120,140,0.35)"
                : "inset 0 0 0 1px rgba(236,213,206,0.18)",
              scale:
                lightAt === null
                  ? 1
                  : interpolate(
                      frame,
                      [lightAt, lightAt + 6, lightAt + 16],
                      [1, 1.22, 1],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: Easing.bezier(0.16, 1, 0.3, 1),
                      },
                    ),
              opacity: interpolate(frame, [i * 2, i * 2 + 8], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {day}
          </div>
        );
      })}
    </div>
  );
};
