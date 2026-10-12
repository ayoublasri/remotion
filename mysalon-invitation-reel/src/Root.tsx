import { Composition } from "remotion";
import { InvitationReel, timeline } from "./InvitationReel";
import { invitationReelSchema, type InvitationReelProps } from "./schema";

// French typography: no-break spaces before ? and :, and inside « ».
const NBSP = " ";

// The story, scene by scene. A shot's keys map frames of the scene to
// seconds of the ad video (held where two keys share a second); captions and
// chips are on the scene's own frames. Every caption gets two to four seconds.
const defaultProps: InvitationReelProps = {
  video: "video/source-60.mp4",
  scenes: [
    {
      kind: "shot",
      id: "Lundi soir",
      keys: [
        { frame: 0, second: 0 },
        { frame: 140, second: 2 },
        { frame: 160, second: 2 },
      ],
      flash: false,
      counter: null,
      chips: [{ text: "LUNDI · 23:14", at: 0 }],
      captions: [
        {
          at: 6,
          until: 78,
          lines: ["*Sara*, nail artist à Témara."],
          size: 50,
        },
        {
          at: 80,
          until: null,
          lines: ["*47 DM* ce soir.", "Elle n'a pas encore dîné."],
          size: 48,
        },
      ],
      sounds: [
        { name: "ding", at: 0, volume: 0.9 },
        { name: "ding", at: 11, volume: 0.8 },
        { name: "ding", at: 33, volume: 0.7 },
      ],
    },
    {
      kind: "messages",
      id: "Les messages",
      duration: 200,
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
        { name: "Imane", text: `Kayn blasa sebt${NBSP}?`, at: 28 },
        { name: "Salma", text: `Vous êtes ouverts dimanche${NBSP}?`, at: 48 },
        { name: "Hajar", text: `Je peux venir à 18h30${NBSP}?`, at: 68 },
      ],
      captions: [
        {
          at: 84,
          until: 150,
          lines: ["Sara répond à tout,", "entre deux clientes."],
          size: 48,
        },
        { at: 152, until: null, lines: ["*Tous les soirs.*"], size: 52 },
      ],
      sounds: [],
    },
    {
      kind: "shot",
      id: "Mardi",
      keys: [
        { frame: 0, second: 2.2 },
        { frame: 44, second: 2.55 },
        { frame: 84, second: 2.55 },
      ],
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
      keys: [
        { frame: 0, second: 2.85 },
        { frame: 45, second: 3.25 },
        { frame: 72, second: 3.25 },
      ],
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
      keys: [
        { frame: 0, second: 3.5 },
        { frame: 50, second: 4 },
        { frame: 70, second: 4 },
        { frame: 120, second: 4.5 },
        { frame: 140, second: 4.5 },
        { frame: 215, second: 5.4 },
        { frame: 240, second: 5.4 },
      ],
      flash: true,
      counter: null,
      chips: [{ text: "JEUDI · 14:02", at: 0 }],
      captions: [
        {
          at: 4,
          until: 66,
          lines: ["*Nada* ouvre le lien de Sara."],
          size: 48,
        },
        {
          at: 70,
          until: 118,
          lines: ["Manucure russe,", "samedi *11:00*."],
          size: 50,
        },
        {
          at: 120,
          until: null,
          lines: ["*Confirmé.*", "Sara est en pleine pose."],
          size: 50,
        },
      ],
      sounds: [{ name: "success", at: 120, volume: 0.9 }],
    },
    {
      kind: "notification",
      id: "Sara reçoit",
      duration: 105,
      still: "video/still-confirm.jpg",
      at: 6,
      app: "MYSALON",
      title: "Nouvelle réservation",
      body: "Nada · Manucure russe · Samedi 11:00",
      chips: [{ text: "JEUDI · 14:03", at: 0 }],
      captions: [
        {
          at: 28,
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
      keys: [
        { frame: 0, second: 5.5 },
        { frame: 140, second: 7.3 },
        { frame: 160, second: 7.3 },
      ],
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
      kind: "chat",
      id: "Vendredi",
      duration: 150,
      still: "video/still-phone.jpg",
      at: 6,
      contact: "Sara Nails",
      status: "en ligne",
      dateLabel: "VENDREDI",
      messages: [
        {
          from: "them",
          text: `Bonjour Nada, petit rappel de Sara Nails${NBSP}: votre manucure russe est demain, samedi à 11:00. À demain${NBSP}!`,
          time: "20:00",
          at: 20,
        },
        {
          from: "me",
          text: `Parfait, à demain${NBSP}!`,
          time: "20:02",
          at: 84,
        },
      ],
      note: "Rappel envoyé automatiquement par MySalon",
      noteAt: 58,
      chips: [{ text: "VENDREDI · 20:00", at: 0 }],
      captions: [
        {
          at: 32,
          until: null,
          lines: ["Rappel *WhatsApp* envoyé à Nada.", "Automatiquement."],
          size: 44,
        },
      ],
      sounds: [],
    },
    {
      kind: "arrival",
      id: "Samedi",
      duration: 110,
      still: "video/still-phone.jpg",
      at: 4,
      app: "MYSALON",
      time: "Samedi · 11:02",
      client: "Nada",
      detail: "Manucure russe · 11:00",
      status: "Arrivée",
      checkAt: 26,
      points: { label: "Points fidélité", from: 3, max: 5 },
      stampAt: 56,
      chips: [{ text: "SAMEDI · 11:02", at: 0 }],
      captions: [
        {
          at: 40,
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
      brandAt: 60,
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
  // Synthesised Afrobeats track, see scripts/make-music.mjs.
  music: "music/afro-theme.mp3",
  musicVolume: 0.7,
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
