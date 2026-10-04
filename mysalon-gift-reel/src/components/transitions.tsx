import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { SATIN } from "../theme";
import { starPolygon } from "./Pattern";

const toPolygon = (points: [number, number][]) =>
  `polygon(${points.map(([x, y]) => `${x}px ${y}px`).join(", ")})`;

// ---------- Star wipe: the next scene opens through a growing, turning
// eight-pointed star (the MySalon.ma mark) with a glowing edge. ----------
type StarWipeProps = { edgeColor: string; glow: string };

const StarWipe: React.FC<
  TransitionPresentationComponentProps<StarWipeProps>
> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const { width, height } = useVideoConfig();
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const cx = width / 2;
  const cy = height / 2;
  const cover = Math.hypot(cx, cy) / 0.765 + 60;
  const radius = cover * presentationProgress;
  const points = starPolygon(
    cx,
    cy,
    radius,
    (presentationProgress * Math.PI) / 4,
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: toPolygon(points) }}>
        {children}
      </AbsoluteFill>
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        <polygon
          points={points.map(([x, y]) => `${x},${y}`).join(" ")}
          fill="none"
          stroke={passedProps.edgeColor}
          strokeWidth={10}
          strokeLinejoin="round"
          opacity={1 - presentationProgress * 0.5}
          style={{ filter: `drop-shadow(0 0 18px ${passedProps.glow})` }}
        />
      </svg>
    </AbsoluteFill>
  );
};

export const starWipe = (
  props: StarWipeProps,
): TransitionPresentation<StarWipeProps> => ({
  component: StarWipe,
  props,
});

// ---------- Ribbon wipe: a champagne satin ribbon sweeps diagonally across
// the screen and the next scene appears behind it. ----------
type RibbonWipeProps = { band: number };

const clipBelowDiagonal = (w: number, h: number, s: number) => {
  const corners: [number, number][] = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ];
  const inside = ([x, y]: [number, number]) => x + y <= s;
  const points: [number, number][] = [];
  for (let i = 0; i < 4; i++) {
    const a = corners[i];
    const b = corners[(i + 1) % 4];
    if (inside(a)) points.push(a);
    if (inside(a) !== inside(b)) {
      const t = (s - (a[0] + a[1])) / (b[0] + b[1] - (a[0] + a[1]));
      points.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]);
    }
  }
  if (points.length < 3) return "polygon(0px 0px, 0px 0px, 0px 0px)";
  return toPolygon(points);
};

const RibbonWipe: React.FC<
  TransitionPresentationComponentProps<RibbonWipeProps>
> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const { width, height } = useVideoConfig();
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const { band } = passedProps;
  const s = -band + (width + height + 2 * band) * presentationProgress;
  const length = Math.hypot(width, height) * 1.6;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{ clipPath: clipBelowDiagonal(width, height, s - band / 2) }}
      >
        {children}
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: s / 2 - length / 2,
          top: s / 2 - band / 2,
          width: length,
          height: band,
          rotate: "-45deg",
          background: `linear-gradient(180deg, ${SATIN.dark} 0%, ${SATIN.mid} 20%, ${SATIN.light} 46%, #fff3d6 54%, ${SATIN.mid} 80%, ${SATIN.dark} 100%)`,
          boxShadow: "0 0 50px rgba(8,34,28,0.35)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: band * 0.16,
            height: 2,
            backgroundColor: "rgba(255,250,235,0.6)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: band * 0.16,
            height: 2,
            backgroundColor: "rgba(255,250,235,0.6)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const ribbonWipe = (
  props: RibbonWipeProps,
): TransitionPresentation<RibbonWipeProps> => ({
  component: RibbonWipe,
  props,
});

// ---------- Blur zoom: the old scene pushes forward into a soft blur while
// the new one settles into focus. ----------
type BlurZoomProps = Record<string, never>;

const BlurZoom: React.FC<
  TransitionPresentationComponentProps<BlurZoomProps>
> = ({ children, presentationDirection, presentationProgress }) => {
  const p = presentationProgress;
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill
        style={{ scale: String(1 + 0.14 * p), filter: `blur(${20 * p}px)` }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(1, p * 1.4),
        scale: String(1.08 - 0.08 * p),
        filter: `blur(${20 * (1 - p)}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const blurZoom = (): TransitionPresentation<BlurZoomProps> => ({
  component: BlurZoom,
  props: {},
});

// ---------- Iris: the next scene opens through a growing circle with a
// glowing ring. ----------
type IrisProps = { edgeColor: string; glow: string };

const Iris: React.FC<TransitionPresentationComponentProps<IrisProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const { width, height } = useVideoConfig();
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const radius =
    (Math.hypot(width / 2, height / 2) + 40) * presentationProgress;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: `circle(${radius}px at ${width / 2}px ${height / 2}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="none"
          stroke={passedProps.edgeColor}
          strokeWidth={8}
          opacity={1 - presentationProgress * 0.4}
          style={{ filter: `drop-shadow(0 0 16px ${passedProps.glow})` }}
        />
      </svg>
    </AbsoluteFill>
  );
};

export const irisGlow = (
  props: IrisProps,
): TransitionPresentation<IrisProps> => ({
  component: Iris,
  props,
});
