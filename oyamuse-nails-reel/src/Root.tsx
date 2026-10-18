import { Composition } from "remotion";
import { FILM_FRAMES, NailsReel } from "./NailsReel";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="NailsReel"
    component={NailsReel}
    durationInFrames={FILM_FRAMES}
    fps={30}
    width={1080}
    height={1920}
  />
);
