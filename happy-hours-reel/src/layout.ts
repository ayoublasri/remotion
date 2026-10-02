import { useVideoConfig } from "remotion";

// The same scenes render in 9:16 (reel, 1920 tall) and 4:5 (feed post,
// 1350 tall). `pick(full, compact)` returns the value for the current canvas.
export const useLayout = () => {
  const { height } = useVideoConfig();
  const compact = height < 1600;
  const pick = <T>(full: T, small: T): T => (compact ? small : full);
  return { compact, pick };
};
