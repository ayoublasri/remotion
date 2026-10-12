// The Moroccan flag: a green pentagram on red, drawn so it stays crisp.
export const MoroccanFlag: React.FC<{ readonly height: number }> = ({
  height,
}) => {
  const width = height * 1.5;
  const r = height * 0.33;
  const cx = width / 2;
  const cy = height / 2;
  const points = [0, 1, 2, 3, 4]
    .map((i) => {
      const a = (-90 + i * 144) * (Math.PI / 180);
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: "block", flexShrink: 0, borderRadius: height * 0.12 }}
    >
      <rect width={width} height={height} fill="#c1272d" />
      <polygon
        points={points}
        fill="none"
        stroke="#006233"
        strokeWidth={height * 0.07}
        strokeLinejoin="miter"
      />
    </svg>
  );
};
