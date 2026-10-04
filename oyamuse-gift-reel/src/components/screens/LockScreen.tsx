import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { SANS } from "../../fonts";
import { CREAM, GOLD, GREEN, GREEN_DEEP, INK, MUTED } from "../../theme";
import { StarMark } from "../Brand";

// Step 2: the person you chose receives the gift and its code on their phone.
export const LockScreen: React.FC<{
  readonly wallpaper: string;
  readonly time: string;
  readonly date: string;
  readonly title: string;
  readonly body: string;
  readonly code: string;
  readonly notifAt: number;
  readonly pulseAt: number;
}> = ({ wallpaper, time, date, title, body, code, notifAt, pulseAt }) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(
    frame,
    [pulseAt, pulseAt + 6, pulseAt + 14],
    [1, 1.1, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    },
  );
  const glow = interpolate(
    frame,
    [pulseAt, pulseAt + 6, pulseAt + 30],
    [0, 1, 0.45],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: GREEN_DEEP }}>
      <Img
        src={staticFile(`images/${wallpaper}`)}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(6px)",
          scale: "1.1",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(15,44,34,0.55) 0%, rgba(15,44,34,0.25) 45%, rgba(15,44,34,0.7) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 120,
          textAlign: "center",
          color: CREAM,
        }}
      >
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24 }}>
          {date}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 124,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          {time}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          top: 380,
          borderRadius: 32,
          padding: "20px 22px 24px",
          backgroundColor: "rgba(253,249,241,0.94)",
          boxShadow: "0 24px 50px rgba(0,0,0,0.3)",
          opacity: interpolate(frame, [notifAt, notifAt + 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [notifAt, notifAt + 16],
            ["0px -160px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 14, stiffness: 170, mass: 0.8 }),
            },
          ),
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: GREEN,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StarMark size={24} color={GOLD} />
          </div>
          <div
            style={{
              flex: 1,
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 19,
              letterSpacing: "0.08em",
              color: MUTED,
            }}
          >
            MYSALON.MA
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 18,
              color: MUTED,
            }}
          >
            maintenant
          </div>
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 28,
            lineHeight: 1.2,
            color: INK,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 23,
            lineHeight: 1.35,
            color: "#4a4842",
          }}
        >
          {body}
        </div>
        <div
          style={{
            marginTop: 16,
            alignSelf: "flex-start",
            display: "inline-block",
            padding: "12px 24px",
            borderRadius: 16,
            border: `3px dashed ${GOLD}`,
            backgroundColor: "rgba(196,162,79,0.12)",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 34,
            letterSpacing: "0.1em",
            color: GREEN_DEEP,
            scale: String(pulse),
            transformOrigin: "0% 50%",
            boxShadow: `0 0 ${36 * glow}px rgba(196,162,79,${0.9 * glow})`,
          }}
        >
          {code}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 22,
          width: 150,
          height: 6,
          marginLeft: -75,
          borderRadius: 3,
          backgroundColor: "rgba(255,255,255,0.8)",
        }}
      />
    </AbsoluteFill>
  );
};
