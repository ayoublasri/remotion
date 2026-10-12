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
import type { ChatScene } from "../schema";
import { TEAL } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const WA_GREEN = "#008069";
const WA_BG = "#efe7dd";
const WA_OUT = "#d9fdd3";
const WA_INK = "#111b21";
const WA_GREY = "#667781";
const WA_BLUE = "#53bdeb";

const DoubleTick: React.FC = () => (
  <svg width="30" height="18" viewBox="0 0 30 18" style={{ display: "block" }}>
    <path
      d="M2 9.5 7 14.5 17 3.5"
      fill="none"
      stroke={WA_BLUE}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 10.5 15 14.5 27 3.5"
      fill="none"
      stroke={WA_BLUE}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Bubble: React.FC<{
  readonly from: "them" | "me";
  readonly text: string;
  readonly time: string;
  readonly at: number;
}> = ({ from, text, time, at }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [at, at + 14], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.2)),
  });

  if (frame < at) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: from === "me" ? "flex-end" : "flex-start",
        padding: "0 22px",
        opacity: enter,
        translate: `0px ${(1 - enter) * 20}px`,
        scale: String(0.94 + 0.06 * enter),
        transformOrigin: from === "me" ? "100% 100%" : "0% 100%",
      }}
    >
      <Interactive.Div
        name={`Bubble ${from} ${time}`}
        style={{
          maxWidth: "80%",
          padding: "14px 18px 10px",
          borderRadius: 18,
          borderTopLeftRadius: from === "them" ? 4 : 18,
          borderTopRightRadius: from === "me" ? 4 : 18,
          backgroundColor: from === "me" ? WA_OUT : "#ffffff",
          boxShadow: "0 1px 1px rgba(0,0,0,0.12)",
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 30,
          lineHeight: 1.3,
          color: WA_INK,
        }}
      >
        {text}
        <div
          style={{
            marginTop: 4,
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 8,
            fontSize: 22,
            color: WA_GREY,
          }}
        >
          {time}
          {from === "me" ? <DoubleTick /> : null}
        </div>
      </Interactive.Div>
    </div>
  );
};

// Friday, 20:00: Nada's WhatsApp, the reminder from the salon arriving by
// itself, her reply. Drawn, so every word is real and readable.
export const ChatSceneView: React.FC<{ readonly scene: ChatScene }> = ({
  scene,
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [scene.at, scene.at + 16], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill name="Chat scene" style={{ overflow: "hidden" }}>
      <Still src={scene.still} blur={16} darken={0.42} />
      {scene.messages.map((m) => (
        <Sfx
          key={m.at}
          name={m.from === "me" ? "pop" : "ding"}
          at={m.at}
          volume={m.from === "me" ? 0.6 : 0.9}
        />
      ))}
      {frame >= scene.at ? (
        <div
          style={{
            position: "absolute",
            left: SAFE.left,
            width: SAFE_WIDTH,
            top: 420,
            borderRadius: 36,
            overflow: "hidden",
            backgroundColor: WA_BG,
            boxShadow: "0 30px 70px rgba(0,0,0,0.3)",
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
              padding: "20px 24px",
              backgroundColor: WA_GREEN,
              color: "#ffffff",
              fontFamily: SANS,
            }}
          >
            <svg width="22" height="34" viewBox="0 0 22 34">
              <path
                d="M18 3 5 17l13 14"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: "#f6efe8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StarMark size={34} color={TEAL} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 30 }}>
                {scene.contact}
              </div>
              <div style={{ fontWeight: 500, fontSize: 22, opacity: 0.85 }}>
                {scene.status}
              </div>
            </div>
            <svg width="40" height="28" viewBox="0 0 40 28">
              <rect
                x="2"
                y="4"
                width="24"
                height="20"
                rx="4"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
              />
              <path
                d="M26 11l11-6v18l-11-6z"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinejoin="round"
              />
            </svg>
            <svg width="30" height="30" viewBox="0 0 30 30">
              <path
                d="M7 3h6l3 7-4 3c2 4 5 7 9 9l3-4 7 3v6c0 1-1 2-2 2C14 29 1 16 1 5c0-1 1-2 2-2z"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.6"
                strokeLinejoin="round"
                transform="translate(1 -1) scale(0.9)"
              />
            </svg>
          </div>
          <div style={{ padding: "18px 0 22px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  padding: "6px 16px",
                  borderRadius: 10,
                  backgroundColor: "#ffffff",
                  boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
                  fontFamily: SANS,
                  fontWeight: 600,
                  fontSize: 22,
                  color: "#54656f",
                }}
              >
                {scene.dateLabel}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {scene.messages.map((m) => (
                <Bubble
                  key={m.at}
                  from={m.from}
                  text={m.text}
                  time={m.time}
                  at={m.at}
                />
              ))}
            </div>
            {frame >= scene.noteAt ? (
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                  fontFamily: SANS,
                  fontWeight: 600,
                  fontSize: 22,
                  color: "#54656f",
                  opacity: interpolate(
                    frame,
                    [scene.noteAt, scene.noteAt + 8],
                    [0, 1],
                    clamp,
                  ),
                }}
              >
                <StarMark size={18} color={TEAL} />
                {scene.note}
              </div>
            ) : null}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              padding: "0 18px 18px",
            }}
          >
            <div
              style={{
                flex: 1,
                height: 64,
                borderRadius: 32,
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                padding: "0 24px",
                fontFamily: SANS,
                fontWeight: 500,
                fontSize: 26,
                color: "#8696a0",
              }}
            >
              Message
            </div>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: WA_GREEN,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="26" height="34" viewBox="0 0 26 34">
                <rect
                  x="7"
                  y="2"
                  width="12"
                  height="20"
                  rx="6"
                  fill="#ffffff"
                />
                <path
                  d="M3 15c0 6 4 10 10 10s10-4 10-10M13 25v6M8 31h10"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
