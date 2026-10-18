import { AbsoluteFill, useCurrentFrame } from "remotion";
import "./fonts";
import { Hand } from "./film/Hand";
import { Prints } from "./film/Prints";
import { Screen } from "./film/Screen";
import { Shutter } from "./film/Shutter";
import { B, FPS, H, W, shutterSamples, viewTransform } from "./film/stage";
import { IVORY } from "./theme";

// OYA MUSE, nails by Safae: six photos as prints on a table, brought in one
// by one by a fingertip, the "before" flipped over to its "after", the table
// pulled back to show the work, the prints gathered into the mark and one
// call to action. Silent; every frame a pure function of time.
export const FILM_FRAMES = Math.round(B.length * FPS);

const World: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: IVORY }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: W,
          height: H,
          transformOrigin: "0 0",
          transform: viewTransform(t),
        }}
      >
        <Prints t={t} />
        <Hand t={t} />
      </div>
    </AbsoluteFill>
  );
};

export const NailsReel: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{ background: IVORY }}>
      <Shutter samples={shutterSamples(t)}>
        <World />
      </Shutter>
      <Screen />
    </AbsoluteFill>
  );
};
