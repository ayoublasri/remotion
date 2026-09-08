import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SANS, SERIF } from "../../fonts";
import { CheckIcon } from "../Icons";

const formatTime = (t: number) =>
  `${Math.floor(t)}:${String(Math.round((t % 1) * 60)).padStart(2, "0")}`;

const HOUR_HEIGHT = 66;
const FIRST_HOUR = 9;

const Block: React.FC<{
  readonly start: number;
  readonly end: number;
  readonly label: string;
  readonly kind: "booked" | "pause" | "new";
  readonly appearAt: number | null;
}> = ({ start, end, label, kind, appearAt }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: 4,
        right: 4,
        top: (start - FIRST_HOUR) * HOUR_HEIGHT + 2,
        height: (end - start) * HOUR_HEIGHT - 4,
        borderRadius: 10,
        padding: "8px 10px",
        boxSizing: "border-box",
        overflow: "hidden",
        fontFamily: SANS,
        fontWeight: kind === "new" ? 700 : 600,
        fontSize: 16,
        lineHeight: 1.25,
        color:
          kind === "new" ? "#ffffff" : kind === "pause" ? "#7a7a7a" : "#0f5c57",
        backgroundColor:
          kind === "new" ? "#0f5c57" : kind === "pause" ? "#f1ece9" : "#dcefec",
        backgroundImage:
          kind === "pause"
            ? "repeating-linear-gradient(135deg, rgba(0,0,0,0.05) 0 6px, transparent 6px 14px)"
            : undefined,
        borderLeft:
          kind === "new" ? "4px solid #e8365d" : "4px solid transparent",
        boxShadow:
          kind === "new" ? "0 10px 24px rgba(15,92,87,0.35)" : undefined,
        scale:
          appearAt === null
            ? 1
            : interpolate(frame, [appearAt, appearAt + 16], [0.6, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.spring({
                  damping: 12,
                  stiffness: 170,
                  mass: 0.8,
                }),
                output: "perceptual-scale",
              }),
        opacity:
          appearAt === null
            ? 1
            : interpolate(frame, [appearAt, appearAt + 6], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
      }}
    >
      {label}
      <div style={{ fontWeight: 500, opacity: 0.85, fontSize: 14 }}>
        {`${formatTime(start)} – ${formatTime(end)}`}
      </div>
    </div>
  );
};

// Live agenda, one column per workstation / employee, with the new booking
// dropping in and a toast confirming it.
export const AgendaScreen: React.FC<{ readonly newAt: number }> = ({
  newAt,
}) => {
  const frame = useCurrentFrame();
  const hours = Array.from({ length: 10 }, (_, i) => FIRST_HOUR + i);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        backgroundColor: "#fdf4f1",
        translate: interpolate(frame, [0, 14], ["520px 0px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <div
        style={{
          padding: "64px 18px 0",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontWeight: 900,
              fontSize: 30,
              color: "#1a1a1a",
            }}
          >
            Agenda
          </div>
          <div style={{ fontFamily: SANS, fontSize: 18, color: "#6b6b6b" }}>
            Jeudi 12 sept.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            borderRadius: 999,
            backgroundColor: "#e6f2f0",
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 16,
            color: "#0f5c57",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: "#22c55e",
              opacity: interpolate(frame % 30, [0, 15, 30], [1, 0.3, 1]),
            }}
          />
          En direct
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          padding: "14px 18px 0",
          gap: 6,
        }}
      >
        <div style={{ width: 52 }} />
        {["Yasmine", "Cabine soins"].map((name) => (
          <div
            key={name}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 10px",
              borderRadius: 12,
              backgroundColor: "#ffffff",
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 17,
              color: "#1a1a1a",
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                backgroundColor: name === "Yasmine" ? "#b81238" : "#0f5c57",
                color: "#ffffff",
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {name[0]}
            </div>
            {name}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "relative",
          margin: "10px 18px 0",
          display: "flex",
          flexDirection: "row",
          gap: 6,
          height: hours.length * HOUR_HEIGHT,
        }}
      >
        <div style={{ width: 52, position: "relative" }}>
          {hours.map((h, i) => (
            <div
              key={h}
              style={{
                position: "absolute",
                top: i * HOUR_HEIGHT - 9,
                fontFamily: SANS,
                fontSize: 15,
                color: "#8a8a8a",
              }}
            >
              {`${h}:00`}
            </div>
          ))}
        </div>
        <div
          style={{
            flex: 1,
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 6,
          }}
        >
          {hours.map((h, i) => (
            <div
              key={h}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: i * HOUR_HEIGHT,
                height: 1,
                backgroundColor: "#e9e1dd",
              }}
            />
          ))}
          <div style={{ flex: 1, position: "relative" }}>
            <Block
              start={10}
              end={10.5}
              label="Brushing"
              kind="booked"
              appearAt={null}
            />
            <Block
              start={11}
              end={13}
              label="Coloration"
              kind="booked"
              appearAt={null}
            />
            <Block
              start={13}
              end={14}
              label="Pause"
              kind="pause"
              appearAt={null}
            />
            <Block
              start={14.5}
              end={15.25}
              label="Coupe femme"
              kind="new"
              appearAt={newAt}
            />
            <Block
              start={16}
              end={17}
              label="Brushing"
              kind="booked"
              appearAt={null}
            />
          </div>
          <div style={{ flex: 1, position: "relative" }}>
            <Block
              start={9.5}
              end={10.5}
              label="Manucure"
              kind="booked"
              appearAt={null}
            />
            <Block
              start={13}
              end={14}
              label="Pause"
              kind="pause"
              appearAt={null}
            />
            <Block
              start={15}
              end={16}
              label="Soin du visage"
              kind="booked"
              appearAt={null}
            />
            <Block
              start={17}
              end={17.5}
              label="Épilation"
              kind="booked"
              appearAt={null}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 18,
          right: 18,
          top: 60,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          borderRadius: 16,
          backgroundColor: "#ffffff",
          boxShadow: "0 14px 34px rgba(15,61,58,0.22)",
          fontFamily: SANS,
          fontSize: 18,
          color: "#1a1a1a",
          translate: interpolate(
            frame,
            [newAt + 4, newAt + 18],
            ["0px -140px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 200 }),
            },
          ),
          opacity: interpolate(frame, [newAt + 4, newAt + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "#0f5c57",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckIcon size={20} color="#ffffff" strokeWidth={3} />
        </div>
        <div>
          <div style={{ fontWeight: 700 }}>Nouveau RDV · Salma B.</div>
          <div style={{ color: "#6b6b6b", fontSize: 16 }}>
            Coupe femme · 14:30 · Yasmine
          </div>
        </div>
      </div>
    </div>
  );
};
