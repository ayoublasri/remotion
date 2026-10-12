import { Audio } from "@remotion/media";
import { createContext, useContext } from "react";
import { Sequence, staticFile } from "remotion";

export type SfxName =
  | "whoosh"
  | "stamp"
  | "pop"
  | "tick"
  | "ding"
  | "success"
  | "sparkle"
  | "strike";

// Whether the sound effects play; the reel provides it from its `sfx` prop.
export const SoundContext = createContext(true);

// A one-shot sound effect from public/sfx, starting at `at` (scene-local frame).
export const Sfx: React.FC<{
  readonly name: SfxName;
  readonly at: number;
  readonly volume: number;
}> = ({ name, at, volume }) => {
  const enabled = useContext(SoundContext);
  if (!enabled) {
    return null;
  }

  return (
    <Sequence from={at} layout="none" name={`sfx ${name}`}>
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
    </Sequence>
  );
};
