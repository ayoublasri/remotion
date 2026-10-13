import { Audio } from "@remotion/media";
import { z } from "zod";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import "./fonts";
import { Day } from "./film/Day";
import { Hand } from "./film/Hand";
import { Night } from "./film/Night";
import { Screen } from "./film/Screen";
import { Shutter } from "./film/Shutter";
import { B, FPS, H, W, shutterSamples, viewTransform } from "./film/stage";

// "47": one take, 28.8 s. A number counts 47 DMs on a Tuesday night, asks the
// viewer theirs, and a tap turns it into a link, a booking, a full week and
// one last DM to send. Everything is a pure function of the frame; the world
// sits under a keyed camera and a 180-degree shutter.
export const quaranteSeptSchema = z.object({
  music: z.string().nullable(),
  sfx: z.string().nullable(),
  musicVolume: z.number().min(0).max(1),
  sfxVolume: z.number().min(0).max(1),
});
export type QuaranteSeptProps = z.infer<typeof quaranteSeptSchema>;

export const FILM_FRAMES = Math.round(B.length * FPS);

const World: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#061a18" }}>
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
        <Night t={t} />
        <Day t={t} />
        <Hand t={t} />
      </div>
    </AbsoluteFill>
  );
};

export const QuaranteSept: React.FC<QuaranteSeptProps> = ({
  music,
  sfx,
  musicVolume,
  sfxVolume,
}) => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{ background: "#061a18" }}>
      <Shutter samples={shutterSamples(t)}>
        <World />
      </Shutter>
      <Screen />
      {music ? (
        <Audio
          src={staticFile(music)}
          volume={(f) =>
            interpolate(f, [0, 20], [0, musicVolume], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      ) : null}
      {sfx ? <Audio src={staticFile(sfx)} volume={sfxVolume} /> : null}
    </AbsoluteFill>
  );
};
