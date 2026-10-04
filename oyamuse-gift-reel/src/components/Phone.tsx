import { SANS } from "../fonts";

export const PHONE_WIDTH = 500;
export const PHONE_HEIGHT = 1000;
const BEZEL = 14;

const StatusIcons: React.FC<{ readonly color: string }> = ({ color }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
    }}
  >
    <svg
      width="26"
      height="16"
      viewBox="0 0 26 16"
      style={{ display: "block" }}
    >
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={i * 7}
          y={12 - i * 4}
          width="5"
          height={4 + i * 4}
          rx="1.2"
          fill={color}
        />
      ))}
    </svg>
    <svg
      width="22"
      height="16"
      viewBox="0 0 24 18"
      fill="none"
      stroke={color}
      strokeWidth="2.6"
      strokeLinecap="round"
      style={{ display: "block" }}
    >
      <path d="M2 6.5a15 15 0 0 1 20 0" />
      <path d="M5.5 10.2a10 10 0 0 1 13 0" />
      <path d="M9 13.8a5 5 0 0 1 6 0" />
    </svg>
    <svg
      width="34"
      height="16"
      viewBox="0 0 34 16"
      style={{ display: "block" }}
    >
      <rect
        x="1"
        y="1"
        width="28"
        height="14"
        rx="4"
        fill="none"
        stroke={color}
        strokeOpacity="0.5"
        strokeWidth="1.6"
      />
      <rect x="3.5" y="3.5" width="20" height="9" rx="2" fill={color} />
      <rect
        x="30.5"
        y="5.5"
        width="2.5"
        height="5"
        rx="1"
        fill={color}
        fillOpacity="0.5"
      />
    </svg>
  </div>
);

// A modern phone: coloured frame, dynamic island and status bar. The screen
// content is passed as children and fills 472 x 972.
export const Phone: React.FC<{
  readonly frameColor: string;
  readonly edgeColor: string;
  readonly statusColor: string;
  readonly time: string;
  readonly children: React.ReactNode;
}> = ({ frameColor, edgeColor, statusColor, time, children }) => (
  <div
    style={{
      position: "relative",
      width: PHONE_WIDTH,
      height: PHONE_HEIGHT,
      borderRadius: 72,
      backgroundColor: frameColor,
      boxShadow: `0 60px 120px rgba(15,44,34,0.35), 0 0 0 3px ${edgeColor}, inset 0 0 0 2px rgba(255,255,255,0.12)`,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: BEZEL,
        borderRadius: 58,
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      {children}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 64,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 34px 0 46px",
          boxSizing: "border-box",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 21,
          color: statusColor,
          pointerEvents: "none",
        }}
      >
        <span>{time}</span>
        <StatusIcons color={statusColor} />
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 16,
          width: 130,
          height: 38,
          marginLeft: -65,
          borderRadius: 19,
          backgroundColor: "#000",
        }}
      />
    </div>
  </div>
);
