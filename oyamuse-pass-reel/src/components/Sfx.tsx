import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";

// A one-shot sound effect from public/sfx, starting at `at` (scene-local frame).
export const Sfx: React.FC<{
  readonly name: "whoosh" | "stamp" | "pop" | "tick" | "ding" | "success";
  readonly at: number;
  readonly volume: number;
}> = ({ name, at, volume }) => (
  <Sequence from={at} layout="none" name={`sfx ${name}`}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);
