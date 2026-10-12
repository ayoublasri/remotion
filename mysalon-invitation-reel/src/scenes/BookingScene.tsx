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
import type { BookingScene } from "../schema";
import { INK, MUTED, TEAL, WHITE } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const GREEN = "#1f9d6f";

// A step of the booking, fading and sliding in at `from` and out at `to`.
const Step: React.FC<{
  readonly from: number;
  readonly to: number | null;
  readonly children: React.ReactNode;
}> = ({ from, to, children }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [from, from + 12], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const exit =
    to === null ? 1 : interpolate(frame, [to - 8, to], [1, 0], clamp);
  if (frame < from || (to !== null && frame >= to)) {
    return null;
  }
  return (
    <div
      style={{
        opacity: enter * exit,
        translate: `${(1 - enter) * 60 - (1 - exit) * 60}px 0px`,
      }}
    >
      {children}
    </div>
  );
};

// Thursday, 14:02: Nada books on Sara's MySalon page, drawn: the services,
// the day and the time, the confirmation. Every label is real.
export const BookingSceneView: React.FC<{ readonly scene: BookingScene }> = ({
  scene,
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [scene.at, scene.at + 16], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const picked = frame >= scene.pickAt;
  const slotPicked = frame >= scene.slotAt;
  const check = interpolate(
    frame,
    [scene.confirmAt, scene.confirmAt + 14],
    [0, 1],
    {
      ...clamp,
      easing: Easing.out(Easing.back(1.8)),
    },
  );

  const row = (
    label: string,
    sub: string,
    right: string,
    on: boolean,
    key: string,
  ) => (
    <div
      key={key}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 18,
        padding: "16px 18px",
        borderRadius: 18,
        backgroundColor: on ? "rgba(15,92,87,0.1)" : "transparent",
        boxShadow: on
          ? `inset 0 0 0 3px ${TEAL}`
          : "inset 0 0 0 2px rgba(26,26,26,0.1)",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          boxSizing: "border-box",
          border: `3px solid ${on ? TEAL : "rgba(26,26,26,0.25)"}`,
          backgroundColor: on ? TEAL : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {on ? <CheckIcon size={20} color={WHITE} /> : null}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 28, color: INK }}>{label}</div>
        <div style={{ fontWeight: 500, fontSize: 23, color: MUTED }}>{sub}</div>
      </div>
      <div style={{ fontWeight: 700, fontSize: 26, color: on ? TEAL : INK }}>
        {right}
      </div>
    </div>
  );

  return (
    <AbsoluteFill name="Booking scene" style={{ overflow: "hidden" }}>
      <Still src={scene.still} blur={16} darken={0.42} />
      <Sfx name="tick" at={scene.pickAt} volume={0.6} />
      <Sfx name="whoosh" at={scene.calendarAt} volume={0.35} />
      <Sfx name="tick" at={scene.slotAt} volume={0.6} />
      {frame >= scene.at ? (
        <div
          style={{
            position: "absolute",
            left: SAFE.left,
            width: SAFE_WIDTH,
            top: 420,
            boxSizing: "border-box",
            padding: "24px 26px 28px",
            borderRadius: 32,
            backgroundColor: "rgba(255,255,255,0.97)",
            boxShadow: "0 30px 70px rgba(0,0,0,0.3)",
            fontFamily: SANS,
            overflow: "hidden",
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
              gap: 16,
              paddingBottom: 18,
              borderBottom: "2px solid rgba(26,26,26,0.08)",
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "#f3c4c4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 28,
                color: INK,
              }}
            >
              {scene.salon.slice(0, 1)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 30, color: INK }}>
                {scene.salon}
              </div>
              <div style={{ fontWeight: 500, fontSize: 23, color: MUTED }}>
                {scene.city}
              </div>
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
          <div style={{ position: "relative", marginTop: 18, minHeight: 330 }}>
            <Step from={scene.at} to={scene.calendarAt}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 24,
                  letterSpacing: "0.08em",
                  color: MUTED,
                  marginBottom: 12,
                }}
              >
                {scene.servicesLabel}
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {scene.services.map((s, i) =>
                  row(
                    s.name,
                    s.duration,
                    s.price,
                    picked && i === scene.pickIndex,
                    s.name,
                  ),
                )}
              </div>
            </Step>
            <div style={{ position: "absolute", inset: 0 }}>
              <Step from={scene.calendarAt} to={scene.confirmAt}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 24,
                    letterSpacing: "0.08em",
                    color: MUTED,
                    marginBottom: 12,
                  }}
                >
                  {scene.dateLabel}
                </div>
                <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                  {scene.days.map((d, i) => {
                    const on = i === scene.dayIndex;
                    return (
                      <div
                        key={d}
                        style={{
                          flex: 1,
                          padding: "12px 0",
                          borderRadius: 16,
                          textAlign: "center",
                          backgroundColor: on ? TEAL : "#f2f2f2",
                          color: on ? WHITE : INK,
                          fontWeight: 700,
                          fontSize: 25,
                          whiteSpace: "pre-line",
                          lineHeight: 1.25,
                        }}
                      >
                        {d}
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    marginTop: 22,
                    fontWeight: 700,
                    fontSize: 24,
                    letterSpacing: "0.08em",
                    color: MUTED,
                    marginBottom: 12,
                  }}
                >
                  {scene.slotsLabel}
                </div>
                <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                  {scene.slots.map((t, i) => {
                    const on = slotPicked && i === scene.slotIndex;
                    return (
                      <div
                        key={t}
                        style={{
                          flex: 1,
                          padding: "14px 0",
                          borderRadius: 16,
                          textAlign: "center",
                          boxSizing: "border-box",
                          border: `3px solid ${on ? TEAL : "rgba(26,26,26,0.12)"}`,
                          backgroundColor: on
                            ? "rgba(15,92,87,0.1)"
                            : "transparent",
                          color: on ? TEAL : INK,
                          fontWeight: 700,
                          fontSize: 27,
                        }}
                      >
                        {t}
                      </div>
                    );
                  })}
                </div>
              </Step>
            </div>
            <div style={{ position: "absolute", inset: 0 }}>
              <Step from={scene.confirmAt} to={null}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    paddingTop: 14,
                  }}
                >
                  <div
                    style={{
                      width: 110,
                      height: 110,
                      borderRadius: 55,
                      backgroundColor: GREEN,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 18px 40px rgba(31,157,111,0.35)",
                      scale: String(0.5 + 0.5 * check),
                      opacity: check,
                    }}
                  >
                    <CheckIcon size={60} color={WHITE} />
                  </div>
                  <Interactive.Div
                    name="Booking confirmed"
                    style={{
                      marginTop: 22,
                      fontWeight: 800,
                      fontSize: 38,
                      color: INK,
                    }}
                  >
                    {scene.confirmTitle}
                  </Interactive.Div>
                  <div
                    style={{
                      marginTop: 8,
                      fontWeight: 500,
                      fontSize: 28,
                      color: MUTED,
                    }}
                  >
                    {scene.confirmDetail}
                  </div>
                </div>
              </Step>
            </div>
          </div>
          <div
            style={{
              marginTop: 18,
              height: 76,
              borderRadius: 18,
              backgroundColor: frame >= scene.confirmAt ? "#f2f2f2" : TEAL,
              color: frame >= scene.confirmAt ? MUTED : WHITE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 28,
            }}
          >
            {frame >= scene.confirmAt
              ? scene.doneLabel
              : frame >= scene.calendarAt
                ? scene.confirmLabel
                : scene.nextLabel}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
