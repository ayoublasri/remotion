import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { SANS } from "../fonts";
import { SAFE } from "../layout";
import type { Chip } from "../schema";
import { BEIGE, INK, TEAL } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// The day and time of the story, top left: "LUNDI · 23:14". A new chip
// replaces the previous one.
export const StoryChips: React.FC<{ readonly chips: readonly Chip[] }> = ({
  chips,
}) => {
  const frame = useCurrentFrame();

  return (
    <>
      {chips.map((chip, i) => {
        const next = chips[i + 1]?.at ?? 100000;
        if (frame < chip.at || frame >= next + 6) {
          return null;
        }
        const enter = interpolate(frame, [chip.at, chip.at + 14], [0, 1], {
          ...clamp,
          easing: Easing.out(Easing.back(1.4)),
        });
        const exit = interpolate(frame, [next, next + 6], [1, 0], clamp);
        return (
          <Interactive.Div
            key={chip.text}
            name={`Chip ${chip.text}`}
            style={{
              position: "absolute",
              left: SAFE.left,
              top: SAFE.top + 6,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              padding: "12px 26px 12px 18px",
              borderRadius: 999,
              backgroundColor: BEIGE,
              boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: "0.18em",
              color: INK,
              whiteSpace: "nowrap",
              opacity: Math.min(enter, exit),
              translate: `${(enter - 1) * 60}px 0px`,
              scale: String(0.9 + 0.1 * enter),
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: TEAL,
                boxShadow: "0 0 0 4px rgba(15,92,87,0.18)",
              }}
            />
            {chip.text}
          </Interactive.Div>
        );
      })}
    </>
  );
};
