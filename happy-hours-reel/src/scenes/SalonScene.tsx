import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { HairIcon } from "../components/HairIcon";
import { HourClock } from "../components/HourClock";
import { LogoBadge } from "../components/Logo";
import { Flash, Star, Twinkles } from "../components/Overlays";
import { Price } from "../components/Price";
import { Sfx } from "../components/Sfx";
import { DISPLAY, SANS } from "../fonts";
import { useLayout } from "../layout";
import type { HourWindow, Palette, Salon, WindowRow } from "../schema";
import { CARD, INK, MUTED } from "../theme";

const Row: React.FC<{
  readonly row: WindowRow;
  readonly at: number;
  readonly palette: Palette;
}> = ({ row, at, palette }) => {
  const frame = useCurrentFrame();
  const { pick } = useLayout();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: pick(22, 18),
        height: pick(104, 82),
        borderTop: "1px solid rgba(0,0,0,0.07)",
        opacity: interpolate(frame, [at, at + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(frame, [at, at + 16], ["-40px 0px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <Sfx name="tick" at={at} volume={0.5} />
      <div
        style={{
          width: pick(80, 64),
          height: pick(80, 64),
          borderRadius: 40,
          overflow: "hidden",
          flexShrink: 0,
          backgroundColor: palette.soft,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.06)",
        }}
      >
        {row.image === null ? (
          row.hair === null ? null : (
            <HairIcon
              length={row.hair}
              size={pick(54, 44)}
              hair={palette.deep}
              skin={palette.bg}
            />
          )
        ) : (
          <Img
            src={staticFile(`images/${row.image}`)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: pick(32, 27),
          lineHeight: 1.08,
          color: INK,
        }}
      >
        {row.name}
      </div>
      <div style={{ position: "relative", flexShrink: 0, marginRight: 6 }}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: pick(28, 23),
            lineHeight: 1,
            color: MUTED,
            whiteSpace: "nowrap",
          }}
        >{`${row.oldPrice} DH`}</div>
        <div
          style={{
            position: "absolute",
            left: -6,
            right: -6,
            top: "50%",
            height: 4,
            marginTop: -2,
            borderRadius: 2,
            backgroundColor: palette.accent,
            transformOrigin: "left center",
            scale: interpolate(frame, [at + 18, at + 26], ["0 1", "1 1"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        />
      </div>
      <div
        style={{
          width: pick(236, 196),
          display: "flex",
          justifyContent: "flex-end",
          flexShrink: 0,
        }}
      >
        <Price
          from={row.oldPrice}
          to={row.newPrice}
          at={at + 6}
          duration={16}
          size={row.newPrice >= 1000 ? pick(46, 38) : pick(54, 44)}
          color={palette.deep}
          unit="DH"
        />
      </div>
    </div>
  );
};

const WindowCard: React.FC<{
  readonly window: HourWindow;
  readonly at: number;
  readonly palette: Palette;
}> = ({ window, at, palette }) => {
  const frame = useCurrentFrame();
  const { pick } = useLayout();

  return (
    <div
      style={{
        borderRadius: 30,
        backgroundColor: CARD,
        boxShadow: "0 30px 60px rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.05)",
        padding: pick("22px 30px 14px", "14px 24px 8px"),
        display: "flex",
        flexDirection: "column",
        translate: interpolate(
          frame,
          [at, at + 20],
          ["1200px 0px", "0px 0px"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 15, stiffness: 140, mass: 0.9 }),
          },
        ),
        opacity: interpolate(frame, [at, at + 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <Sfx name="whoosh" at={at} volume={0.5} />
      <Sfx name="stamp" at={at + 12} volume={0.6} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: pick(22, 16),
          paddingBottom: pick(16, 10),
        }}
      >
        <HourClock
          size={pick(100, 82)}
          fromHour={window.fromHour}
          toHour={window.toHour}
          at={at + 14}
          duration={50}
          face={palette.bg}
          ink={palette.deep}
          accent={palette.accent}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            flex: 1,
            minWidth: 0,
          }}
        >
          {window.title === "" ? null : (
            <div
              style={{
                fontFamily: DISPLAY,
                fontWeight: 600,
                fontSize: pick(24, 20),
                letterSpacing: "0.3em",
                color: palette.accent,
              }}
            >
              {window.title}
            </div>
          )}
          <div
            style={{
              fontFamily: DISPLAY,
              fontWeight: 600,
              fontSize: pick(30, 25),
              letterSpacing: "0.12em",
              color: palette.deep,
              whiteSpace: "nowrap",
            }}
          >
            {window.days}
          </div>
        </div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: pick(54, 44),
            lineHeight: 1,
            letterSpacing: "0.02em",
            color: palette.accent,
            whiteSpace: "nowrap",
            scale: interpolate(
              frame,
              [at + 12, at + 18, at + 28],
              [0.9, 1.08, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
          }}
        >
          {window.hours}
        </div>
      </div>
      {window.rows.map((row, i) => (
        <Row key={row.name} row={row} at={at + 24 + i * 10} palette={palette} />
      ))}
    </div>
  );
};

// Four bars per salon: who, when, what and how much. Everything lands within
// the first two bars and holds, so there is time to read.
export const SalonScene: React.FC<{ readonly salon: Salon }> = ({ salon }) => {
  const frame = useCurrentFrame();
  const { pick } = useLayout();
  const { palette } = salon;

  return (
    <AbsoluteFill
      name="Salon scene"
      style={{
        backgroundColor: palette.bg,
        scale: interpolate(frame, [0, 10], [1.04, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }),
      }}
    >
      <Backdrop
        image={salon.backdrop}
        blur={34}
        tint={palette.bgDeep}
        base={palette.bg}
      />
      <Twinkles
        points={[
          { x: 8, y: 8 },
          { x: 92, y: 7 },
          { x: 7, y: 92 },
          { x: 93, y: 90 },
        ]}
        color={palette.accent}
      />
      <Sfx name="whoosh" at={0} volume={0.4} />
      <div
        style={{
          position: "absolute",
          left: pick(80, 70),
          top: pick(140, 64),
          fontFamily: DISPLAY,
          fontWeight: 600,
          fontSize: pick(30, 26),
          letterSpacing: "0.34em",
          color: palette.deep,
          opacity: interpolate(frame, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [0, 14], ["-30px 0px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {salon.label}
      </div>
      <AbsoluteFill
        name="Content"
        style={{
          justifyContent: "center",
          padding: pick("200px 80px 200px", "116px 70px 96px"),
          gap: pick(26, 18),
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 18,
            fontFamily: DISPLAY,
            fontWeight: 600,
            fontSize: pick(30, 24),
            letterSpacing: "0.4em",
            color: palette.accent,
            opacity: interpolate(frame, [0, 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [0, 16], ["-30px 0px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          <Star size={24} color={palette.accent} />
          HAPPY HOUR
          <div
            style={{
              flex: 1,
              height: 2,
              backgroundColor: palette.accent,
              opacity: 0.5,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 28,
            marginBottom: 8,
            opacity: interpolate(frame, [2, 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [2, 20], ["-60px 0px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          <div
            style={{
              scale: interpolate(frame, [4, 20], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.spring({
                  damping: 11,
                  stiffness: 160,
                  mass: 0.9,
                }),
                output: "perceptual-scale",
              }),
            }}
          >
            <LogoBadge
              image={salon.logo}
              size={pick(160, 122)}
              ring
              ringColor={palette.accent}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: pick(60, 48),
                lineHeight: 1,
                letterSpacing: "0.06em",
                color: palette.deep,
              }}
            >
              {salon.name}
            </div>
            {salon.nameLine2 === "" ? null : (
              <div
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: pick(60, 48),
                  lineHeight: 1,
                  letterSpacing: "0.06em",
                  color: palette.deep,
                }}
              >
                {salon.nameLine2}
              </div>
            )}
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: pick(26, 22),
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: palette.accent,
              }}
            >
              {salon.place}
            </div>
          </div>
        </div>
        {salon.windows.map((window, i) => (
          <WindowCard
            key={window.hours}
            window={window}
            at={26 + i * 36}
            palette={palette}
          />
        ))}
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 6 }}
        >
          <div
            style={{
              padding: pick("16px 36px", "12px 28px"),
              borderRadius: 999,
              backgroundColor: palette.deep,
              color: palette.bg,
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: pick(30, 25),
              letterSpacing: "0.04em",
              scale: interpolate(frame, [112, 126], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.spring({
                  damping: 12,
                  stiffness: 180,
                  mass: 0.8,
                }),
                output: "perceptual-scale",
              }),
            }}
          >
            <Sfx name="pop" at={112} volume={0.6} />
            {salon.note}
          </div>
        </div>
      </AbsoluteFill>
      <Flash at={0} peak={0.55} />
    </AbsoluteFill>
  );
};
