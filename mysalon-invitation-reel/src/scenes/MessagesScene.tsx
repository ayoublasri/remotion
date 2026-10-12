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
import type { MessagesScene } from "../schema";
import { INK, MUTED, WHITE } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const AVATARS = ["#f3c4c4", "#c9e4d8", "#f5e1b8", "#d6d1f2", "#f7d4bd"];
const CARD_TOP = 420;
const CARD_HEIGHT = 128;
const CARD_GAP = 16;

const MessageCard: React.FC<{
  readonly name: string;
  readonly text: string;
  readonly at: number;
  readonly index: number;
}> = ({ name, text, at, index }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [at, at + 16], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.3)),
  });

  if (frame < at) {
    return null;
  }

  return (
    <Interactive.Div
      name={`Message ${name}`}
      style={{
        position: "absolute",
        left: SAFE.left,
        width: SAFE_WIDTH,
        top: CARD_TOP + index * (CARD_HEIGHT + CARD_GAP),
        height: CARD_HEIGHT,
        boxSizing: "border-box",
        padding: "0 28px",
        borderRadius: 28,
        backgroundColor: "rgba(255,255,255,0.95)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.22)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 22,
        opacity: enter,
        translate: `0px ${(enter - 1) * 50}px`,
        scale: String(0.94 + 0.06 * enter),
      }}
    >
      <div
        style={{
          width: 74,
          height: 74,
          borderRadius: 37,
          flexShrink: 0,
          backgroundColor: AVATARS[index % AVATARS.length],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 34,
          color: INK,
        }}
      >
        {name.slice(0, 1)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "space-between",
            fontFamily: SANS,
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 30, color: INK }}>
            {name}
          </span>
          <span style={{ fontWeight: 500, fontSize: 24, color: MUTED }}>
            maintenant
          </span>
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 32,
            color: INK,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </div>
      </div>
    </Interactive.Div>
  );
};

// Monday, 23:16: the messages keep coming, with names, on a frozen frame of
// the ad. The unread badge climbs with each one.
export const MessagesSceneView: React.FC<{
  readonly scene: MessagesScene;
}> = ({ scene }) => {
  const frame = useCurrentFrame();
  const arrived = scene.messages.filter((m) => frame >= m.at);
  const count = scene.badgeFrom + arrived.length;
  const lastAt = arrived.length > 0 ? arrived[arrived.length - 1].at : -100;
  const bump = interpolate(
    frame,
    [lastAt, lastAt + 3, lastAt + 10],
    [1, 1.15, 1],
    clamp,
  );

  return (
    <AbsoluteFill name="Messages scene" style={{ overflow: "hidden" }}>
      <Still src={scene.still} blur={14} darken={0.38} />
      {scene.messages.map((m) => (
        <Sfx key={m.name} name="pop" at={m.at} volume={0.6} />
      ))}
      <Interactive.Div
        name="Unread badge"
        style={{
          position: "absolute",
          right: 1080 - SAFE.right,
          top: SAFE.top + 6,
          padding: "12px 26px",
          borderRadius: 999,
          backgroundColor: "#e5484d",
          boxShadow: "0 12px 30px rgba(229,72,77,0.35)",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 30,
          color: WHITE,
          whiteSpace: "nowrap",
          scale: String(bump),
        }}
      >
        {`${count} ${scene.badgeLabel}`}
      </Interactive.Div>
      {scene.messages.map((m, i) => (
        <MessageCard
          key={m.name}
          name={m.name}
          text={m.text}
          at={m.at}
          index={i}
        />
      ))}
    </AbsoluteFill>
  );
};
