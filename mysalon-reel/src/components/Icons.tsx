import type { FeatureIcon } from "../schema";

type IconProps = {
  readonly size: number;
  readonly color: string;
  readonly strokeWidth?: number;
};

const Svg: React.FC<IconProps & { readonly children: React.ReactNode }> = ({
  size,
  color,
  strokeWidth = 2,
  children,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", flexShrink: 0 }}
  >
    {children}
  </svg>
);

export const MissedCallIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path d="M17 7 7 17" />
    <path d="M7 9v8h8" />
  </Svg>
);

export const LinkIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </Svg>
);

export const ClockIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </Svg>
);

export const BellIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

export const CalendarIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </Svg>
);

export const MailIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 6-10 7L2 6" />
  </Svg>
);

export const HeartIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </Svg>
);

export const CheckIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path d="M20 6 9 17l-5-5" />
  </Svg>
);

export const PinIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </Svg>
);

export const PhoneIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

export const LockIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </Svg>
);

export const QrIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h3v3h-3zM20 14h1M14 20h1M18 18h3v3h-3" />
  </Svg>
);

export const MessageIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </Svg>
);

export const SendIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path d="M22 2 11 13" />
    <path d="m22 2-7 20-4-9-9-4 20-7z" />
  </Svg>
);

export const SearchIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.35-4.35" />
  </Svg>
);

export const FeatureIconGlyph: React.FC<
  IconProps & { readonly name: FeatureIcon }
> = ({ name, ...props }) => {
  switch (name) {
    case "link":
      return <LinkIcon {...props} />;
    case "clock":
      return <ClockIcon {...props} />;
    case "bell":
      return <BellIcon {...props} />;
    case "calendar":
      return <CalendarIcon {...props} />;
    case "heart":
      return <HeartIcon {...props} />;
    case "mail":
      return <MailIcon {...props} />;
    default:
      return <LinkIcon {...props} />;
  }
};
