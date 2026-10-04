// Moroccan eight-pointed star (khatam) tiling, as in the OYA MUSE logo.
export const StarPattern: React.FC<{
  readonly id: string;
  readonly color: string;
  readonly opacity: number;
  readonly size: number;
}> = ({ id, color, opacity, size }) => {
  const c = size / 2;
  const r = size * 0.28;
  const d = r * Math.SQRT2;

  return (
    <svg
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}
    >
      <defs>
        <pattern
          id={id}
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          <rect
            x={c - r}
            y={c - r}
            width={2 * r}
            height={2 * r}
            fill="none"
            stroke={color}
            strokeWidth={1.4}
          />
          <polygon
            points={`${c},${c - d} ${c + d},${c} ${c},${c + d} ${c - d},${c}`}
            fill="none"
            stroke={color}
            strokeWidth={1.4}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
};

// The same star as a single outline polygon (16 vertices), centred on (cx, cy).
export const starPolygon = (
  cx: number,
  cy: number,
  radius: number,
  rotation: number,
): [number, number][] => {
  const inner = (radius * Math.cos(Math.PI / 4)) / Math.cos(Math.PI / 8);
  const points: [number, number][] = [];
  for (let i = 0; i < 16; i++) {
    const angle = rotation + (i * Math.PI) / 8 - Math.PI / 2;
    const r = i % 2 === 0 ? radius : inner;
    points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  return points;
};

// Solid eight-pointed star.
export const KhatamStar: React.FC<{
  readonly size: number;
  readonly color: string;
}> = ({ size, color }) => {
  const points = starPolygon(50, 50, 48, 0)
    .map(([x, y]) => `${x},${y}`)
    .join(" ");
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ display: "block", flexShrink: 0 }}
    >
      <polygon points={points} fill={color} />
    </svg>
  );
};
