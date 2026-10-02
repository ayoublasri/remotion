import { Composition, Folder } from "remotion";
import { HappyHoursReel } from "./HappyHoursReel";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { HowScene } from "./scenes/HowScene";
import { SalonScene } from "./scenes/SalonScene";
import { happyHoursReelSchema } from "./schema";

const site = "mysalon.ma";

const hook = {
  leftImage: "nails-pearl.jpg",
  rightImage: "hair-sleek.jpg",
  line1: "HAPPY",
  line2: "HOURS",
  line3: "beauté",
  subtitle: "À Témara, certaines heures coûtent moins cher.",
};

const oya = {
  label: "SALON 01 · TÉMARA",
  name: "OYA MUSE",
  nameLine2: "",
  place: "Nails · Lashes · Brows",
  logo: "oya-logo.jpg",
  backdrop: "nails-pearl.jpg",
  palette: {
    bg: "#f6efe2",
    bgDeep: "rgba(246,239,226,0.84)",
    deep: "#1f4b3c",
    accent: "#c4a24f",
    soft: "#eadfcc",
  },
  windows: [
    {
      title: "",
      days: "MER → VEN",
      hours: "17h → 20h",
      fromHour: 17,
      toHour: 20,
      rows: [
        {
          image: "nails-pearl.jpg",
          hair: null,
          name: "Manucure russe + vernis permanent",
          oldPrice: 120,
          newPrice: 99,
        },
        {
          image: "brow-lift-generated.jpg",
          hair: null,
          name: "Brow lift",
          oldPrice: 200,
          newPrice: 169,
        },
        {
          image: "lash-lift-generated.jpg",
          hair: null,
          name: "Lash lift",
          oldPrice: 250,
          newPrice: 209,
        },
      ],
    },
  ],
  note: "1 place par soin · Nouvelles clientes",
};

const newStar = {
  label: "SALON 02 · WIFAK, TÉMARA",
  name: "NEW STAR",
  nameLine2: "BEAUTY",
  place: "Lissage · Ongles",
  logo: "newstar-logo.jpg",
  backdrop: "hair-sleek.jpg",
  palette: {
    bg: "#ecd5ce",
    bgDeep: "rgba(236,213,206,0.86)",
    deep: "#3d1426",
    accent: "#a8455f",
    soft: "#dfbfb6",
  },
  windows: [
    {
      title: "LISSAGE",
      days: "MAR → VEN",
      hours: "9h30 → 12h30",
      fromHour: 9.5,
      toHour: 12.5,
      rows: [
        {
          image: null,
          hair: "short" as const,
          name: "Cheveux courts",
          oldPrice: 800,
          newPrice: 649,
        },
        {
          image: null,
          hair: "medium" as const,
          name: "Cheveux mi-longs",
          oldPrice: 1000,
          newPrice: 849,
        },
        {
          image: null,
          hair: "long" as const,
          name: "Cheveux longs",
          oldPrice: 1200,
          newPrice: 1049,
        },
      ],
    },
    {
      title: "ONGLES",
      days: "MAR → VEN",
      hours: "11h30 → 16h30",
      fromHour: 11.5,
      toHour: 16.5,
      rows: [
        {
          image: "nails-red-gel.jpg",
          hair: null,
          name: "Vernis permanent",
          oldPrice: 80,
          newPrice: 60,
        },
        {
          image: "nails-pink-almond.jpg",
          hair: null,
          name: "Faux ongles + vernis permanent",
          oldPrice: 100,
          newPrice: 80,
        },
        {
          image: "mani-pedi.jpg",
          hair: null,
          name: "Manucure + pédicure",
          oldPrice: 180,
          newPrice: 140,
        },
      ],
    },
  ],
  note: "Dernier rendez-vous lissage : 12h30",
};

const how = {
  question: "COMMENT RÉSERVER ?",
  answer: "En 3 étapes.",
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
  code: "HAPPY-TMR-24",
  dmMessage: "Happy hour ongles svp !",
  payLabel: "Payer",
  paidLabel: "Payé",
  slotLabel: "Jeu. 17h30",
  footer: "Code valable 45 jours",
};

const cta = {
  line1: "RÉSERVEZ",
  line2: "VOTRE",
  line3: "HAPPY HOUR",
  lead: "Pour réserver, c'est par message :",
  button: "Écrivez-nous en DM",
  conditions:
    "OYA MUSE · Mer → Ven · 17h – 20h\nNew Star Beauty · Mar → Ven · 9h30 – 12h30 · 11h30 – 16h30\nPlaces limitées · Code valable 45 jours",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HappyHoursReel"
        component={HappyHoursReel}
        durationInFrames={896}
        fps={30}
        width={1080}
        height={1920}
        schema={happyHoursReelSchema}
        defaultProps={{
          site,
          hook,
          salons: [oya, newStar],
          how,
          cta,
          musicFile: "music/happy-hours-theme.mp3",
        }}
      />
      <Folder name="HappyHoursReel-Scenes">
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
          id="OyaMuse"
          component={SalonScene}
          durationInFrames={224}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ salon: oya }}
        />
        <Composition
          id="NewStarBeauty"
          component={SalonScene}
          durationInFrames={224}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ salon: newStar }}
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
          id="CTA"
          component={CtaScene}
          durationInFrames={168}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ cta, salons: [oya, newStar] }}
        />
      </Folder>
    </>
  );
};
