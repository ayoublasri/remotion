import { PLUM, ROSE, ROSE_SOFT } from "../theme";
import { Star } from "./Overlays";

const SKIN = "#f4dcd2";
const SKIN_SHADE = "#e3bfb3";
const PINK = "#efb7c4";
const RED = "#c42a44";

type NailStyle = {
  readonly color: string;
  readonly extra: number; // how far the nail rises above the fingertip
};

const Nail: React.FC<{
  readonly cx: number;
  readonly top: number;
  readonly style: NailStyle;
  readonly width: number;
}> = ({ cx, top, style, width }) => {
  const w = width / 2;
  const tip = top - style.extra;
  return (
    <g>
      <path
        d={`M ${cx - w} ${top + 30} C ${cx - w} ${tip + 10} ${cx - w * 0.4} ${tip} ${cx} ${tip} C ${cx + w * 0.4} ${tip} ${cx + w} ${tip + 10} ${cx + w} ${top + 30} C ${cx + w} ${top + 42} ${cx - w} ${top + 42} ${cx - w} ${top + 30} Z`}
        fill={style.color}
      />
      <path
        d={`M ${cx - w * 0.5} ${top + 26} C ${cx - w * 0.5} ${tip + 14} ${cx - w * 0.25} ${tip + 6} ${cx} ${tip + 4}`}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.7"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </g>
  );
};

// Back of a hand, fingers up, with painted nails. Drawn in the same flat
// style as the salon logo and the hair icons.
const Hand: React.FC<{ readonly style: NailStyle; readonly ring: boolean }> = ({
  style,
  ring,
}) => {
  const fingers = [
    { cx: 68, top: 58 },
    { cx: 96, top: 38 },
    { cx: 124, top: 46 },
    { cx: 152, top: 80 },
  ];
  return (
    <g>
      <ellipse
        cx="104"
        cy="228"
        rx="70"
        ry="10"
        fill={SKIN_SHADE}
        opacity="0.45"
      />
      <g transform="translate(40 170) rotate(-40)">
        <rect x="-13" y="-46" width="26" height="86" rx="13" fill={SKIN} />
        <Nail cx={0} top={-46} style={style} width={22} />
      </g>
      {fingers.map((f) => (
        <g key={f.cx}>
          <rect
            x={f.cx - 13}
            y={f.top}
            width="26"
            height={172 - f.top}
            rx="13"
            fill={SKIN}
          />
          <rect
            x={f.cx - 13}
            y={f.top + 30}
            width="26"
            height="2"
            fill={SKIN_SHADE}
            opacity="0.5"
          />
        </g>
      ))}
      <path
        d="M 53 150 C 53 132 155 132 155 150 L 160 206 C 160 234 48 234 48 206 Z"
        fill={SKIN}
      />
      {fingers.map((f) => (
        <Nail key={f.cx} cx={f.cx} top={f.top} style={style} width={22} />
      ))}
      {ring ? (
        <rect x="111" y="104" width="26" height="7" rx="2" fill={PLUM} />
      ) : null}
    </g>
  );
};

const Bottle: React.FC<{ readonly color: string }> = ({ color }) => (
  <g>
    <rect x="0" y="0" width="30" height="26" rx="5" fill={PLUM} />
    <rect x="8" y="24" width="14" height="10" fill={PLUM} />
    <rect x="-8" y="32" width="46" height="62" rx="12" fill={color} />
    <path
      d="M 2 44 C 2 58 2 72 4 84"
      fill="none"
      stroke="#ffffff"
      strokeOpacity="0.65"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </g>
);

// Top view of a foot with painted toenails.
const Foot: React.FC<{ readonly style: NailStyle }> = ({ style }) => {
  const toes = [
    { cx: 64, cy: 96, r: 21 },
    { cx: 98, cy: 76, r: 15 },
    { cx: 124, cy: 80, r: 13 },
    { cx: 146, cy: 92, r: 11 },
    { cx: 162, cy: 108, r: 10 },
  ];
  return (
    <g>
      <ellipse
        cx="104"
        cy="228"
        rx="62"
        ry="10"
        fill={SKIN_SHADE}
        opacity="0.45"
      />
      <path
        d="M 50 118 C 40 160 52 206 74 232 C 92 242 124 242 138 230 C 162 200 170 150 160 120 C 142 102 72 98 50 118 Z"
        fill={SKIN}
      />
      {toes.map((t) => (
        <g key={t.cx}>
          <circle cx={t.cx} cy={t.cy} r={t.r} fill={SKIN} />
          <ellipse
            cx={t.cx}
            cy={t.cy - t.r * 0.35}
            rx={t.r * 0.6}
            ry={t.r * 0.42}
            fill={style.color}
          />
          <path
            d={`M ${t.cx - t.r * 0.32} ${t.cy - t.r * 0.3} C ${t.cx - t.r * 0.32} ${t.cy - t.r * 0.62} ${t.cx - t.r * 0.1} ${t.cy - t.r * 0.72} ${t.cx} ${t.cy - t.r * 0.74}`}
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.7"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>
      ))}
    </g>
  );
};

// One of the three nail illustrations for the ongles cards.
export const NailIcon: React.FC<{
  readonly kind: "almond" | "red" | "manipedi";
  readonly size: number;
}> = ({ kind, size }) => {
  const almond: NailStyle = { color: PINK, extra: 14 };
  const red: NailStyle = { color: RED, extra: 8 };
  const rose: NailStyle = { color: ROSE, extra: 6 };

  return (
    <div
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
      <svg
        viewBox="0 0 200 240"
        width={size}
        height={size}
        style={{ display: "block", overflow: "visible" }}
      >
        {kind === "almond" ? <Hand style={almond} ring /> : null}
        {kind === "red" ? (
          <g>
            <g transform="translate(-8 0) scale(0.92)">
              <Hand style={red} ring={false} />
            </g>
            <g transform="translate(160 130)">
              <Bottle color={RED} />
            </g>
          </g>
        ) : null}
        {kind === "manipedi" ? (
          <g>
            <g transform="translate(-34 36) scale(0.8)">
              <Hand style={rose} ring={false} />
            </g>
            <g transform="translate(78 10) scale(0.84)">
              <Foot style={rose} />
            </g>
          </g>
        ) : null}
      </svg>
      <div style={{ position: "absolute", left: size * 0.8, top: size * 0.04 }}>
        <Star size={size * 0.14} color={ROSE} />
      </div>
      <div style={{ position: "absolute", left: size * 0.02, top: size * 0.3 }}>
        <Star size={size * 0.09} color={ROSE_SOFT} />
      </div>
    </div>
  );
};
