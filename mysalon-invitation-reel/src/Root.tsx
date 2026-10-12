import { Composition } from "remotion";
import { InvitationReel, timeline } from "./InvitationReel";
import { invitationReelSchema, type InvitationReelProps } from "./schema";

// French typography: no-break spaces before ? and :, and inside « ».
const NBSP = " ";

// The story, scene by scene. Shots are seconds of the ad video, slowed down
// by `rate`; captions and chips are on the scene's own frames.
const defaultProps: InvitationReelProps = {
  video: "video/source-60.mp4",
  scenes: [
    {
      kind: "shot",
      id: "Lundi soir",
      from: 0,
      to: 2.1,
      rate: 0.525,
      flash: false,
      counter: null,
      chips: [{ text: "LUNDI · 23:14", at: 0 }],
      captions: [
        {
          at: 6,
          until: 62,
          lines: ["*Sara*, nail artist à Témara."],
          size: 50,
        },
        {
          at: 64,
          until: null,
          lines: ["*47 DM* ce soir.", "Elle n'a pas encore dîné."],
          size: 48,
        },
      ],
      sounds: [
        { name: "ding", at: 0, volume: 0.9 },
        { name: "ding", at: 9, volume: 0.8 },
        { name: "ding", at: 25, volume: 0.7 },
      ],
    },
    {
      kind: "messages",
      id: "Les messages",
      duration: 150,
      still: "video/still-dms.jpg",
      badgeFrom: 47,
      badgeLabel: "messages",
      chips: [{ text: "LUNDI · 23:16", at: 0 }],
      messages: [
        {
          name: "Nada",
          text: `C'est combien la manucure russe${NBSP}?`,
          at: 8,
        },
        { name: "Imane", text: `Kayn blasa sebt${NBSP}?`, at: 24 },
        { name: "Salma", text: `Vous êtes ouverts dimanche${NBSP}?`, at: 40 },
        { name: "Hajar", text: `Je peux venir à 18h30${NBSP}?`, at: 56 },
      ],
      captions: [
        {
          at: 66,
          until: 106,
          lines: ["Sara répond à tout,", "entre deux clientes."],
          size: 48,
        },
        { at: 108, until: null, lines: ["*Tous les soirs.*"], size: 52 },
      ],
      sounds: [],
    },
    {
      kind: "shot",
      id: "Mardi",
      from: 2.1,
      to: 2.7,
      rate: 0.4,
      flash: true,
      counter: null,
      chips: [{ text: "MARDI", at: 0 }],
      captions: [
        {
          at: 2,
          until: null,
          lines: [`Sara installe *MySalon*${NBSP}:`, "un lien dans sa bio."],
          size: 48,
        },
      ],
      sounds: [],
    },
    {
      kind: "shot",
      id: "Le QR",
      from: 2.8,
      to: 3.35,
      rate: 0.4,
      flash: true,
      counter: null,
      chips: [{ text: "MARDI", at: 0 }],
      captions: [
        { at: 2, until: null, lines: ["Un *QR* sur le comptoir."], size: 50 },
      ],
      sounds: [],
    },
    {
      kind: "shot",
      id: "Jeudi",
      from: 3.45,
      to: 5.45,
      rate: 0.5,
      flash: true,
      counter: null,
      chips: [{ text: "JEUDI · 14:02", at: 0 }],
      captions: [
        {
          at: 4,
          until: 30,
          lines: ["*Nada* ouvre le lien de Sara."],
          size: 48,
        },
        {
          at: 32,
          until: 62,
          lines: ["Manucure russe,", "samedi *11:00*."],
          size: 50,
        },
        {
          at: 64,
          until: null,
          lines: ["*Confirmé.*", "Sara est en pleine pose."],
          size: 50,
        },
      ],
      sounds: [{ name: "success", at: 64, volume: 0.9 }],
    },
    {
      kind: "notification",
      id: "Sara reçoit",
      duration: 66,
      still: "video/still-confirm.jpg",
      at: 6,
      app: "MYSALON",
      title: "Nouvelle réservation",
      body: "Nada · Manucure russe · Samedi 11:00",
      chips: [{ text: "JEUDI · 14:03", at: 0 }],
      captions: [
        {
          at: 26,
          until: null,
          lines: ["Sara n'a rien eu à faire.", "*0 DM* échangé."],
          size: 48,
        },
      ],
      sounds: [],
    },
    {
      kind: "shot",
      id: "La semaine",
      from: 5.45,
      to: 7.45,
      rate: 0.5,
      flash: true,
      counter: { label: "réservations", to: 12, at: 14 },
      chips: [{ text: "CETTE SEMAINE", at: 0 }],
      captions: [
        {
          at: 4,
          until: null,
          lines: ["Pendant qu'elle travaille,", "son agenda *se remplit*."],
          size: 46,
        },
      ],
      sounds: [],
    },
    {
      kind: "shot",
      id: "Vendredi",
      from: 7.45,
      to: 8.35,
      rate: 0.35,
      flash: true,
      counter: null,
      chips: [
        { text: "VENDREDI · 20:00", at: 0 },
        { text: "SAMEDI · 11:00", at: 40 },
      ],
      captions: [
        {
          at: 4,
          until: 38,
          lines: ["Rappel *WhatsApp* envoyé à Nada.", "Automatiquement."],
          size: 44,
        },
        {
          at: 42,
          until: null,
          lines: ["Nada arrive.", "*+1 point* fidélité."],
          size: 48,
        },
      ],
      sounds: [],
    },
    {
      kind: "end",
      id: "Un mois plus tard",
      duration: 160,
      chips: [{ text: "UN MOIS PLUS TARD", at: 8 }],
      result: [`Sara${NBSP}: *0 DM* le soir.`, "Agenda *plein*."],
      brandAt: 48,
      kicker: "POUR LES SALONS DE BEAUTÉ",
      madeIn: "Fait au Maroc",
      perks: "0 commission · 0 paiement en ligne",
      lead: `Pour ouvrir ton salon sur MySalon${NBSP}:`,
      cta: `DM «${NBSP}INVITATION${NBSP}»`,
      site: "mysalon.ma",
      captions: [],
      sounds: [],
    },
  ],
  sfx: true,
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="InvitationReel"
      component={InvitationReel}
      durationInFrames={timeline(defaultProps).total}
      fps={30}
      width={1080}
      height={1920}
      schema={invitationReelSchema}
      defaultProps={defaultProps}
      calculateMetadata={({ props }) => ({
        durationInFrames: timeline(props).total,
      })}
    />
  );
};
