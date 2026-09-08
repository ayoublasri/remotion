import { Composition, Folder } from "remotion";
import { NailReel } from "./NailReel";
import { HookScene } from "./scenes/HookScene";
import { OutroScene } from "./scenes/OutroScene";
import { SetScene } from "./scenes/SetScene";
import { nailReelSchema } from "./schema";

const cherrySquare = {
  image: "set-1-cherry-square.jpg",
  title: "Cherry Red",
  subtitle: "Square · Glossy gel",
  tags: ["classic", "goes with everything"],
  accent: "#ff2a55",
  focusX: 18,
  sparkles: [
    { x: 24, y: 22 },
    { x: 12, y: 36 },
    { x: 30, y: 56 },
  ],
};

const pinkFlorals = {
  image: "set-2-pink-florals.jpg",
  title: "Pink Ombré",
  subtitle: "Almond · 3D florals · Pearls",
  tags: ["soft girl era", "bridal-ready"],
  accent: "#f7a8bd",
  focusX: 70,
  sparkles: [
    { x: 66, y: 26 },
    { x: 80, y: 42 },
    { x: 72, y: 66 },
  ],
};

const classicRound = {
  image: "set-3-classic-round.jpg",
  title: "Classic Red",
  subtitle: "Short round · Everyday",
  tags: ["timeless", "low maintenance"],
  accent: "#e5173f",
  focusX: 24,
  sparkles: [
    { x: 22, y: 24 },
    { x: 10, y: 46 },
    { x: 24, y: 72 },
  ],
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NailReel"
        component={NailReel}
        durationInFrames={402}
        fps={30}
        width={1080}
        height={1920}
        schema={nailReelSchema}
        defaultProps={{
          handle: "@oyamuse.ma",
          hook: {
            top: "SAVE THIS",
            middle: "for your next",
            bottom: "NAIL APPT 💅",
          },
          sets: [cherrySquare, pinkFlorals, classicRound],
          outro: {
            title: "which one?",
            cta: "comment 1, 2 or 3 👇",
            footer: "follow for weekly nail inspo",
          },
          musicFile: null,
        }}
      />
      <Folder name="NailReel-Scenes">
        <Composition
          id="Hook"
          component={HookScene}
          durationInFrames={66}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            hook: {
              top: "SAVE THIS",
              middle: "for your next",
              bottom: "NAIL APPT 💅",
            },
            set: cherrySquare,
          }}
        />
        <Composition
          id="Set"
          component={SetScene}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            set: pinkFlorals,
            index: 1,
            handle: "@oyamuse.ma",
          }}
        />
        <Composition
          id="Outro"
          component={OutroScene}
          durationInFrames={90}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            sets: [cherrySquare, pinkFlorals, classicRound],
            outro: {
              title: "which one?",
              cta: "comment 1, 2 or 3 👇",
              footer: "follow for weekly nail inspo",
            },
            handle: "@oyamuse.ma",
          }}
        />
      </Folder>
    </>
  );
};
