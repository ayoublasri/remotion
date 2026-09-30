import { Composition, Folder } from "remotion";
import { PassReel } from "./PassReel";
import { CodeScene } from "./scenes/CodeScene";
import { CollabScene } from "./scenes/CollabScene";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { HowScene } from "./scenes/HowScene";
import { OffersScene } from "./scenes/OffersScene";
import { TitleScene } from "./scenes/TitleScene";
import { ValidityScene } from "./scenes/ValidityScene";
import { passReelSchema } from "./schema";

const site = "mysalon.ma";
const logo = "logo.jpg";

const hook = {
  image: "nails-pearl.jpg",
  line1: "99 DH la manucure russe ?",
  line2: "Oui. Ghir l'3chya.",
};

const collab = {
  intro: "EN COLLABORATION AVEC",
  name: "OYA MUSE",
  city: "TÉMARA",
  outro: "nous vous offrons le…",
};

const title = {
  salon: "OYA MUSE · TÉMARA",
  line1: "PASS",
  line2: "L'3CHYA",
  tagline: "Votre soirée bien-être",
  pills: ["Ongles", "Cils", "Sourcils"],
};

const offers = [
  {
    image: "nails-pearl.jpg",
    focusX: 55,
    focusY: 30,
    zoom: 1.3,
    title: "Manucure russe",
    subtitle: "+ vernis permanent",
    oldPrice: 120,
    newPrice: 99,
    scarcity: "1 place restante",
  },
  {
    image: "brow-lift-generated.jpg",
    focusX: 50,
    focusY: 50,
    zoom: 1,
    title: "Brow lift",
    subtitle: "Sourcils restructurés",
    oldPrice: 200,
    newPrice: 169,
    scarcity: "1 place restante",
  },
  {
    image: "lash-lift-generated.jpg",
    focusX: 50,
    focusY: 50,
    zoom: 1,
    title: "Lash lift",
    subtitle: "Cils rehaussés",
    oldPrice: 250,
    newPrice: 209,
    scarcity: "1 place restante",
  },
];

const validity = {
  intro: "Ces prix sont valables",
  only: "UNIQUEMENT",
  days: "MERCREDI → VENDREDI",
  activeDays: [2, 3, 4],
  hours: "17h → 20h",
  fromHour: 17,
  toHour: 20,
  note: "Réservé aux nouvelles clientes",
};

const how = {
  question: "COMMENT EN PROFITER ?",
  answer: "C'est simple.",
  steps: [
    {
      title: "Écrivez-nous en DM",
      subtitle: "Choisissez votre soin et réglez votre pass.",
    },
    {
      title: "Recevez votre code",
      subtitle: "On vous l'envoie juste après le paiement.",
    },
    {
      title: "Réservez en ligne",
      subtitle: "Entrez votre code et choisissez votre créneau.",
    },
  ],
  code: "OYA-3CHYA-72",
  dmMessage: "Le Pass L'3chya svp !",
  payLabel: "Payer",
  paidLabel: "Payé",
  slotLabel: "Jeu. 17h30",
};

const code = {
  intro: "Votre code reste valable",
  days: 45,
  unit: "JOURS",
  outro: "pour choisir votre soirée.",
  reminder: "MER → VEN · 17h – 20h",
};

const cta = {
  line1: "RÉSERVEZ",
  line2: "VOTRE PLACE",
  line3: "MAINTENANT !",
  urgency: "1 place restante par soin",
  lead: "Pour réserver, c'est par message :",
  button: "Écrivez-nous en DM",
  conditions:
    "Mer → Ven · 17h – 20h · Nouvelles clientes · Code valable 45 jours",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PassReel"
        component={PassReel}
        durationInFrames={1120}
        fps={30}
        width={1080}
        height={1920}
        schema={passReelSchema}
        defaultProps={{
          site,
          logo,
          hook,
          collab,
          title,
          offers,
          validity,
          how,
          code,
          cta,
          musicFile: "music/pass-theme.mp3",
        }}
      />
      <Folder name="PassReel-Scenes">
        <Composition
          id="Hook"
          component={HookScene}
          durationInFrames={112}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ hook }}
        />
        <Composition
          id="Collab"
          component={CollabScene}
          durationInFrames={112}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ collab, logo }}
        />
        <Composition
          id="Title"
          component={TitleScene}
          durationInFrames={112}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ title, logo, site }}
        />
        <Composition
          id="Offers"
          component={OffersScene}
          durationInFrames={224}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            offers,
            label: "PASS L'3CHYA",
            logo,
            footer: code.reminder,
          }}
        />
        <Composition
          id="Validity"
          component={ValidityScene}
          durationInFrames={112}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ validity }}
        />
        <Composition
          id="How"
          component={HowScene}
          durationInFrames={168}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ how, site }}
        />
        <Composition
          id="Code"
          component={CodeScene}
          durationInFrames={112}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ code }}
        />
        <Composition
          id="CTA"
          component={CtaScene}
          durationInFrames={168}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ cta, logo, site }}
        />
      </Folder>
    </>
  );
};
