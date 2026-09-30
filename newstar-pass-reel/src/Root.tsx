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
  image: "hair-treatment.jpg",
  line1: "Un lissage à 649 DH ?",
  line2: "Oui. Ghir f sbah.",
};

const collab = {
  intro: "EN COLLABORATION AVEC",
  name: "NEW STAR",
  nameLine2: "BEAUTY",
  city: "WIFAK · TÉMARA",
  outro: "nous vous offrons le…",
};

const title = {
  salon: "NEW STAR BEAUTY · TÉMARA",
  line1: "PASS",
  line2: "NJMA",
  tagline: "Brillez comme une étoile",
  pills: ["Lissage", "Ongles", "Mar → Ven"],
};

const lissage = {
  label: "LISSAGE",
  window: "MAR → VEN · 9h30 → 12h30",
  footer: "Dernier rendez-vous à 12h30",
  backdrop: "hair-treatment.jpg",
  offers: [
    {
      image: null,
      hair: "short" as const,
      nail: null,
      focusX: 50,
      focusY: 50,
      zoom: 1,
      title: "Cheveux courts",
      subtitle: "−19 %",
      oldPrice: 800,
      newPrice: 649,
      callout: "−151 DH",
    },
    {
      image: null,
      hair: "medium" as const,
      nail: null,
      focusX: 50,
      focusY: 50,
      zoom: 1,
      title: "Cheveux mi-longs",
      subtitle: "−15 %",
      oldPrice: 1000,
      newPrice: 849,
      callout: "−151 DH",
    },
    {
      image: null,
      hair: "long" as const,
      nail: null,
      focusX: 50,
      focusY: 50,
      zoom: 1,
      title: "Cheveux longs",
      subtitle: "−13 %",
      oldPrice: 1200,
      newPrice: 1049,
      callout: "−151 DH",
    },
  ],
};

const ongles = {
  label: "ONGLES",
  window: "MAR → VEN · 11h30 → 16h30",
  footer: "Créneaux de 11h30 à 16h30",
  backdrop: null,
  offers: [
    {
      image: null,
      hair: null,
      nail: "almond" as const,
      focusX: 50,
      focusY: 50,
      zoom: 1,
      title: "Faux ongles + vernis permanent",
      subtitle: "−20 %",
      oldPrice: 100,
      newPrice: 80,
      callout: "−20 DH",
    },
    {
      image: null,
      hair: null,
      nail: "red" as const,
      focusX: 50,
      focusY: 50,
      zoom: 1,
      title: "Vernis permanent",
      subtitle: "−25 %",
      oldPrice: 80,
      newPrice: 60,
      callout: "−20 DH",
    },
    {
      image: null,
      hair: null,
      nail: "manipedi" as const,
      focusX: 50,
      focusY: 50,
      zoom: 1,
      title: "Manucure + pédicure",
      subtitle: "−22 %",
      oldPrice: 180,
      newPrice: 140,
      callout: "−40 DH",
    },
  ],
};

const validity = {
  intro: "Ces prix sont valables",
  only: "UNIQUEMENT",
  days: "MARDI → VENDREDI",
  activeDays: [1, 2, 3, 4],
  rows: [
    { label: "LISSAGE", hours: "9h30 → 12h30", fromHour: 9.5, toHour: 12.5 },
    { label: "ONGLES", hours: "11h30 → 16h30", fromHour: 11.5, toHour: 16.5 },
  ],
  note: "Dernier rendez-vous lissage : 12h30",
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
  code: "NJMA-STAR-24",
  dmMessage: "Le Pass Njma svp !",
  payLabel: "Payer",
  paidLabel: "Payé",
  slotLabel: "Mar. 9h30",
};

const code = {
  intro: "Votre code reste valable",
  days: 45,
  unit: "JOURS",
  outro: "pour choisir votre créneau.",
  reminder: "MAR → VEN · 9h30 – 12h30 · 11h30 – 16h30",
};

const cta = {
  line1: "RÉSERVEZ",
  line2: "VOTRE PLACE",
  line3: "MAINTENANT !",
  urgency: "Du mardi au vendredi",
  lead: "Pour réserver, c'est par message :",
  button: "Écrivez-nous en DM",
  conditions:
    "Lissage 9h30 – 12h30 · Ongles 11h30 – 16h30\nCode valable 45 jours",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PassReel"
        component={PassReel}
        durationInFrames={1624}
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
          lissage,
          ongles,
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
          durationInFrames={168}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ title, logo, site }}
        />
        <Composition
          id="Lissage"
          component={OffersScene}
          durationInFrames={280}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ section: lissage, logo }}
        />
        <Composition
          id="Ongles"
          component={OffersScene}
          durationInFrames={280}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ section: ongles, logo }}
        />
        <Composition
          id="Validity"
          component={ValidityScene}
          durationInFrames={168}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ validity }}
        />
        <Composition
          id="How"
          component={HowScene}
          durationInFrames={224}
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
