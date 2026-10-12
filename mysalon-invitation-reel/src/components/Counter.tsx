import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { SANS } from "../fonts";
import { SAFE } from "../layout";
import { Sfx } from "./Sfx";
import { TEAL, WHITE } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// "+12 réservations", counting up at the top right, a tick per booking.
export const Counter: React.FC<{
  readonly label: string;
  readonly to: number;
  readonly at: number;
  readonly end: number;
}> = ({ label, to, at, end }) => {
  const frame = useCurrentFrame();
  const stop = Math.max(at + to, end - 20);
  const count = Math.round(
    interpolate(frame, [at, stop], [0, to], {
      ...clamp,
      easing: Easing.out(Easing.quad),
    }),
  );
  const enter = interpolate(frame, [at, at + 12], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.6)),
  });
  // One tick per increment, at the frame it happens.
  const ticks: number[] = [];
  let last = 0;
  for (let f = at; f <= stop; f++) {
    const c = Math.round(
      interpolate(f, [at, stop], [0, to], {
        ...clamp,
        easing: Easing.out(Easing.quad),
      }),
    );
    if (c > last) {
      ticks.push(f);
      last = c;
    }
  }
  const bump = ticks.some((t) => frame >= t && frame < t + 4) ? 1.08 : 1;

  if (frame < at) {
    return null;
  }

  return (
    <>
      {ticks.map((t) => (
        <Sfx key={t} name="tick" at={t} volume={0.4} />
      ))}
      <Interactive.Div
        name="Counter"
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
          opacity: enter,
          scale: String(enter * bump),
        }}
      >
        {`+${count} ${count <= 1 && label.endsWith("s") ? label.slice(0, -1) : label}`}
      </Interactive.Div>
    </>
  );
};
