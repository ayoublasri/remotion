import { SATIN } from "../theme";

export const CheckIcon: React.FC<{
  readonly size: number;
  readonly color: string;
}> = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", flexShrink: 0 }}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const GiftIcon: React.FC<{
  readonly size: number;
  readonly color: string;
}> = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", flexShrink: 0 }}
  >
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
  </svg>
);

export const SendIcon: React.FC<{
  readonly size: number;
  readonly color: string;
}> = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", flexShrink: 0 }}
  >
    <path d="M22 2 11 13" />
    <path d="m22 2-7 20-4-9-9-4 20-7z" />
  </svg>
);

export const Heart: React.FC<{
  readonly size: number;
  readonly color: string;
}> = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{ display: "block", flexShrink: 0 }}
  >
    <path
      d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.8 4.5 6.6 4.5c2.1 0 3.6 1.2 4.4 2.6.8-1.4 2.3-2.6 4.4-2.6 3.8 0 5.7 3.9 4.2 7.3C19.5 16.4 12 21 12 21z"
      fill={color}
    />
  </svg>
);

// Satin bow in raspberry.
export const Bow: React.FC<{ readonly width: number; readonly id: string }> = ({
  width,
  id,
}) => (
  <svg
    viewBox="0 0 200 124"
    width={width}
    height={width * 0.62}
    style={{ display: "block", overflow: "visible" }}
  >
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={SATIN.light} />
        <stop offset="0.5" stopColor={SATIN.mid} />
        <stop offset="1" stopColor={SATIN.dark} />
      </linearGradient>
    </defs>
    <path
      d="M94 66 L66 120 L82 114 L90 124 L100 72 Z"
      fill={`url(#${id})`}
      stroke={SATIN.dark}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M106 66 L134 120 L118 114 L110 124 L100 72 Z"
      fill={`url(#${id})`}
      stroke={SATIN.dark}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M100 62 C70 18 14 16 20 52 C26 86 74 80 100 62 Z"
      fill={`url(#${id})`}
      stroke={SATIN.dark}
      strokeWidth="2"
    />
    <path
      d="M100 62 C130 18 186 16 180 52 C174 86 126 80 100 62 Z"
      fill={`url(#${id})`}
      stroke={SATIN.dark}
      strokeWidth="2"
    />
    <path
      d="M100 62 C82 40 50 34 42 50"
      fill="none"
      stroke="rgba(255,240,244,0.65)"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M100 62 C118 40 150 34 158 50"
      fill="none"
      stroke="rgba(255,240,244,0.65)"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <ellipse
      cx="100"
      cy="64"
      rx="17"
      ry="15"
      fill={`url(#${id})`}
      stroke={SATIN.dark}
      strokeWidth="2"
    />
  </svg>
);
