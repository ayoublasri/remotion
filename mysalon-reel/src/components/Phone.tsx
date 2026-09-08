import { SANS } from "../fonts";

// iPhone-style device frame. Children are rendered inside the screen.
export const Phone: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      width: 520,
      height: 1040,
      borderRadius: 66,
      backgroundColor: "#151515",
      padding: 14,
      boxShadow:
        "0 50px 100px rgba(15,61,58,0.35), 0 0 0 2px #3a3a3a, inset 0 0 0 1px #000",
      position: "relative",
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 54,
        overflow: "hidden",
        backgroundColor: "#fdf4f1",
        position: "relative",
      }}
    >
      {children}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          translate: "-50% 0px",
          width: 118,
          height: 34,
          borderRadius: 20,
          backgroundColor: "#151515",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 30,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 22,
          color: "#1d1d1f",
        }}
      >
        9:41
      </div>
      <div
        style={{
          position: "absolute",
          top: 22,
          right: 30,
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
          <div
            style={{
              width: 4,
              height: 6,
              backgroundColor: "#1d1d1f",
              borderRadius: 1,
            }}
          />
          <div
            style={{
              width: 4,
              height: 9,
              backgroundColor: "#1d1d1f",
              borderRadius: 1,
            }}
          />
          <div
            style={{
              width: 4,
              height: 12,
              backgroundColor: "#1d1d1f",
              borderRadius: 1,
            }}
          />
          <div
            style={{
              width: 4,
              height: 15,
              backgroundColor: "#1d1d1f",
              borderRadius: 1,
            }}
          />
        </div>
        <div
          style={{
            width: 34,
            height: 16,
            borderRadius: 5,
            border: "2px solid #1d1d1f",
            padding: 2,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#1d1d1f",
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    </div>
  </div>
);
