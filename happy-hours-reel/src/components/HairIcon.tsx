// Front-view silhouette with hair at three lengths, for the lissage rows.
export const HairIcon: React.FC<{
  readonly length: "short" | "medium" | "long";
  readonly size: number;
  readonly hair: string;
  readonly skin: string;
}> = ({ length, size, hair, skin }) => {
  const bottom = length === "short" ? 168 : length === "medium" ? 214 : 256;

  return (
    <svg
      viewBox="0 0 200 270"
      width={size}
      height={size * 1.35}
      style={{ display: "block", flexShrink: 0 }}
    >
      <path
        d={`M 40 120 C 40 30, 160 30, 160 120 L 160 ${bottom} C 160 ${bottom + 16}, 40 ${bottom + 16}, 40 ${bottom} Z`}
        fill={hair}
      />
      <ellipse cx="100" cy="118" rx="44" ry="54" fill={skin} />
      <path
        d="M 78 110 q 8 -6 16 0"
        fill="none"
        stroke={hair}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 106 110 q 8 -6 16 0"
        fill="none"
        stroke={hair}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 92 146 q 8 6 16 0"
        fill="none"
        stroke={hair}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};
