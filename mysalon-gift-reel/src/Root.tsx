import { Composition, Folder } from "remotion";
import { GIFT_REEL_DURATION, GiftReel, SCENES } from "./GiftReel";
import { CtaScene } from "./scenes/CtaScene";
import { HowScene } from "./scenes/HowScene";
import { QuestionScene } from "./scenes/QuestionScene";
import { RevealScene } from "./scenes/RevealScene";
import { ServicesScene } from "./scenes/ServicesScene";
import { giftReelSchema, type GiftReelProps } from "./schema";

// French typography: no-break spaces before ? and :, and inside « ».
const NBSP = " ";

const defaultProps: GiftReelProps = {
  partner: {
    name: "OYA MUSE",
    city: "Témara",
    logo: "oya-logo.jpg",
    services: "Ongles · Cils · Sourcils",
  },
  card: {
    label: "CARTE CADEAU DIGITALE",
    title: "Une expérience beauté",
    at: "chez",
  },
  hook: {
    line1: "Vous ne savez pas",
    line2: `quoi lui offrir${NBSP}?`,
    tease: "Nous avons une idée…",
  },
  reveal: {
    line1: "Offrez une expérience beauté",
    lead: "à votre",
    recipients: [
      { word: "maman", card: "Maman" },
      { word: "amie", card: "Mon amie" },
      { word: "sœur", card: "Ma sœur" },
      { word: "femme", card: "Ma femme" },
      { word: "chérie", card: "Ma chérie" },
    ],
    atLabel: "chez",
  },
  services: {
    subtitle: "TÉMARA · LES SOINS À OFFRIR",
    items: [
      {
        kicker: "ONGLES",
        name: "MANUCURE RUSSE",
        detail: "+ vernis permanent",
        price: "120 DH",
        framed: false,
        photos: [
          { image: "nails-pearl.jpg", focusX: 55, focusY: 30 },
          { image: "nails-pink-florals.jpg", focusX: 50, focusY: 35 },
        ],
      },
      {
        kicker: "CILS",
        name: "LASH LIFT",
        detail: "Cils rehaussés, effet naturel",
        price: "250 DH",
        framed: true,
        photos: [{ image: "lash-lift-generated.jpg", focusX: 50, focusY: 50 }],
      },
      {
        kicker: "SOURCILS",
        name: "BROW LIFT",
        detail: "Sourcils restructurés",
        price: "200 DH",
        framed: true,
        photos: [{ image: "brow-lift-generated.jpg", focusX: 50, focusY: 40 }],
      },
    ],
  },
  how: {
    steps: [
      {
        title: `Écrivez «${NBSP}CADEAU${NBSP}» en DM`,
        subtitle: "Choisissez le soin et payez en ligne. C'est tout.",
      },
      {
        title: "Elle reçoit sa carte cadeau",
        subtitle: "Digitale, sur son téléphone.\nElle réserve quand elle veut.",
      },
    ],
    senderTag: "VOUS",
    recipientTag: "ELLE",
    dmKeyword: "CADEAU",
    dmReply: `Avec plaisir${NBSP}! Quel soin souhaitez-vous offrir${NBSP}?`,
    options: [
      "Ongles · Manucure russe",
      "Cils · Lash lift",
      "Sourcils · Brow lift",
    ],
    pickIndex: 1,
    payLabel: "Payer",
    paidLabel: "Payé",
    dmSent: `Carte cadeau envoyée${NBSP}!`,
    lockTime: "10:24",
    lockDate: "samedi 10 octobre",
    notifTitle: `Vous avez reçu un cadeau${NBSP}!`,
    notifBody: "Une expérience beauté chez OYA MUSE vous attend.",
    code: "CADEAU-K7M2",
    recipient: "Sara",
    wallpaper: "nails-pearl.jpg",
  },
  cta: {
    recipient: "quelqu'un de spécial",
    line1: "OFFREZ UNE",
    line2: "EXPÉRIENCE BEAUTÉ",
    atLabel: "chez",
    lead: `Pour offrir, c'est par message${NBSP}:`,
    button: `Écrivez «${NBSP}CADEAU${NBSP}» en DM`,
    shareAsk: `Vous en rêvez${NBSP}?`,
    shareLine: "Envoyez ce reel à qui doit vous l'offrir.",
  },
  // Silent by default: add the audio in the Instagram editor. `npm run
  // render:sound` renders the cut with its own soundtrack and effects.
  sfx: false,
  musicFile: null,
};

const scene = { fps: 30, width: 1080, height: 1920 };

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GiftReel"
        component={GiftReel}
        durationInFrames={GIFT_REEL_DURATION}
        fps={30}
        width={1080}
        height={1920}
        schema={giftReelSchema}
        defaultProps={defaultProps}
      />
      <Folder name="GiftReel-Scenes">
        <Composition
          id="Question"
          component={QuestionScene}
          durationInFrames={SCENES.question.duration}
          {...scene}
          defaultProps={{ hook: defaultProps.hook }}
        />
        <Composition
          id="Reveal"
          component={RevealScene}
          durationInFrames={SCENES.reveal.duration}
          {...scene}
          defaultProps={{
            reveal: defaultProps.reveal,
            card: defaultProps.card,
            partner: defaultProps.partner,
          }}
        />
        <Composition
          id="Services"
          component={ServicesScene}
          durationInFrames={SCENES.services.duration}
          {...scene}
          defaultProps={{
            services: defaultProps.services,
            partner: defaultProps.partner,
          }}
        />
        <Composition
          id="How"
          component={HowScene}
          durationInFrames={SCENES.how.duration}
          {...scene}
          defaultProps={{
            how: defaultProps.how,
            card: defaultProps.card,
            partner: defaultProps.partner,
          }}
        />
        <Composition
          id="CTA"
          component={CtaScene}
          durationInFrames={SCENES.cta.duration}
          {...scene}
          defaultProps={{
            cta: defaultProps.cta,
            card: defaultProps.card,
            partner: defaultProps.partner,
          }}
        />
      </Folder>
    </>
  );
};
