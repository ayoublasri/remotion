import { Composition, Folder } from "remotion";
import { OyamuseReel } from "./OyamuseReel";
import { BrandScene } from "./scenes/BrandScene";
import { BrowsScene } from "./scenes/BrowsScene";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { NailsScene } from "./scenes/NailsScene";
import { ServicesScene } from "./scenes/ServicesScene";
import { oyamuseReelSchema } from "./schema";

const handle = "@oyamuse.ma";

const hook = {
  line1: "Regardez vos ongles.",
  line2: "Maintenant.",
  line3: "Vous voyez ?",
  line4: "Il est temps.",
};

const brand = {
  name: "OYAMUSE",
  descriptor: "Nails · Lashes · Brows",
};

const nails = [
  {
    image: "nails-pearl.jpg",
    title: "Glazed pearl",
    descriptor: "Nude nacré · Amande",
    focusX: 50,
    focusY: 38,
    sparkles: [
      { x: 64, y: 22 },
      { x: 48, y: 30 },
      { x: 76, y: 60 },
    ],
  },
  {
    image: "nails-mermaid.jpg",
    title: "Sirène",
    descriptor: "Nail art 3D · Perles & coquillages",
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
    title: "Bleu royal",
    descriptor: "Carré · Nœuds argentés",
    focusX: 50,
    focusY: 55,
    sparkles: [
      { x: 30, y: 48 },
      { x: 68, y: 52 },
      { x: 26, y: 66 },
    ],
  },
];

const brows = {
  image: "brows-before-after.jpg",
  title: "Le regard, sublimé.",
  descriptor: "Rehaussement de cils · Brow lift",
  beforeLabel: "AVANT",
  afterLabel: "APRÈS",
  coverTitle: "APRÈS",
  coverSubtitle: "Résultat en une séance",
  lashImage: "lash-lift.jpg",
  lashTitle: "Cils relevés, regard ouvert.",
  lashDescriptor: "Lash lift · Brow lift",
};

const services = {
  title: "Tout, au même endroit.",
  items: ["Manucure & gel", "Nail art", "Rehaussement de cils", "Brow lift"],
  footnote: "Sur rendez-vous",
};

const cta = {
  title1: "Réservez",
  title2: "votre moment.",
  button: "Réservation en DM",
  footer: "Nails · Lashes · Brows",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="OyamuseReel"
        component={OyamuseReel}
        durationInFrames={864}
        fps={30}
        width={1080}
        height={1920}
        schema={oyamuseReelSchema}
        defaultProps={{
          handle,
          hook,
          brand,
          nails,
          brows,
          services,
          cta,
          musicFile: "music/oyamuse-theme.mp3",
        }}
      />
      <Folder name="OyamuseReel-Scenes">
        <Composition
          id="Hook"
          component={HookScene}
          durationInFrames={144}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ hook, image: nails[0].image }}
        />
        <Composition
          id="Brand"
          component={BrandScene}
          durationInFrames={72}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ brand, handle }}
        />
        <Composition
          id="Nails"
          component={NailsScene}
          durationInFrames={216}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ nails }}
        />
        <Composition
          id="Brows"
          component={BrowsScene}
          durationInFrames={216}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ brows }}
        />
        <Composition
          id="Services"
          component={ServicesScene}
          durationInFrames={72}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ services }}
        />
        <Composition
          id="CTA"
          component={CtaScene}
          durationInFrames={144}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            cta,
            handle,
            images: [
              nails[0].image,
              brows.lashImage,
              nails[1].image,
              brows.image,
              nails[2].image,
            ],
          }}
        />
      </Folder>
    </>
  );
};
