import { Composition, Folder } from "remotion";
import { OyamuseReel } from "./OyamuseReel";
import { BrowsScene } from "./scenes/BrowsScene";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { LashesScene } from "./scenes/LashesScene";
import { LogoScene } from "./scenes/LogoScene";
import { MontageScene } from "./scenes/MontageScene";
import { NailsScene } from "./scenes/NailsScene";
import { oyamuseReelSchema } from "./schema";

const handle = "@oyamuse.ma";
const logo = "logo.jpg";

const hook = {
  line1: "Regardez vos ongles.",
  line2: "Puis regardez ça.",
};

const labels = {
  nails: "NAILS",
  brows: "BROWS",
  lashes: "LASHES",
};

const nails = [
  {
    image: "nails-pearl.jpg",
    focusX: 50,
    focusY: 38,
    sparkles: [
      { x: 64, y: 22 },
      { x: 48, y: 30 },
      { x: 76, y: 60 },
    ],
  },
  {
    image: "nails-ice-blue.jpg",
    focusX: 55,
    focusY: 50,
    sparkles: [
      { x: 60, y: 40 },
      { x: 78, y: 48 },
      { x: 80, y: 66 },
    ],
  },
  {
    image: "nails-pink-florals.jpg",
    focusX: 60,
    focusY: 42,
    sparkles: [
      { x: 60, y: 30 },
      { x: 72, y: 46 },
      { x: 66, y: 62 },
    ],
  },
  {
    image: "nails-mermaid.jpg",
    focusX: 50,
    focusY: 45,
    sparkles: [
      { x: 30, y: 44 },
      { x: 66, y: 50 },
      { x: 60, y: 34 },
    ],
  },
  {
    image: "nails-blue-bows.jpg",
    focusX: 50,
    focusY: 55,
    sparkles: [
      { x: 30, y: 48 },
      { x: 68, y: 52 },
      { x: 26, y: 66 },
    ],
  },
  {
    image: "nails-cherry-red.jpg",
    focusX: 40,
    focusY: 40,
    sparkles: [
      { x: 30, y: 30 },
      { x: 18, y: 46 },
      { x: 24, y: 62 },
    ],
  },
];

const brows = {
  image: "brows-before-after.jpg",
  beforeLabel: "AVANT",
  afterLabel: "APRÈS",
};

const lashes = {
  image: "lashes-collage.jpg",
  focusX: 50,
  focusY: 45,
  sparkles: [
    { x: 60, y: 52 },
    { x: 24, y: 34 },
    { x: 26, y: 78 },
  ],
};

const montage = [
  "nails-cherry-red.jpg",
  "lashes-collage.jpg",
  "nails-pearl.jpg",
  "nails-ice-blue.jpg",
  "lash-lift.jpg",
  "nails-pink-florals.jpg",
  "nails-mermaid.jpg",
  "nails-blue-bows.jpg",
];

const cta = {
  title1: "Réservez",
  title2: "votre moment",
  subtitle: "Ongles · Cils · Sourcils",
  button: "Lien en bio",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="OyamuseReel"
        component={OyamuseReel}
        durationInFrames={896}
        fps={30}
        width={1080}
        height={1920}
        schema={oyamuseReelSchema}
        defaultProps={{
          handle,
          logo,
          hook,
          labels,
          nails,
          brows,
          lashes,
          montage,
          cta,
          musicFile: "music/oyamuse-theme.mp3",
        }}
      />
      <Folder name="OyamuseReel-Scenes">
        <Composition
          id="Hook"
          component={HookScene}
          durationInFrames={112}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ hook, photo: nails[0] }}
        />
        <Composition
          id="Logo"
          component={LogoScene}
          durationInFrames={56}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ logo, handle }}
        />
        <Composition
          id="Nails"
          component={NailsScene}
          durationInFrames={336}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ nails, label: labels.nails, logo }}
        />
        <Composition
          id="Brows"
          component={BrowsScene}
          durationInFrames={112}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ brows, label: labels.brows, logo }}
        />
        <Composition
          id="Lashes"
          component={LashesScene}
          durationInFrames={56}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ photo: lashes, label: labels.lashes, logo }}
        />
        <Composition
          id="Montage"
          component={MontageScene}
          durationInFrames={112}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ images: montage, logo }}
        />
        <Composition
          id="CTA"
          component={CtaScene}
          durationInFrames={112}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ cta, handle, logo }}
        />
      </Folder>
    </>
  );
};
