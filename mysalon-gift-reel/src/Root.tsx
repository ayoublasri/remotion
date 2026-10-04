import { Composition, Folder } from "remotion";
import { GIFT_REEL_DURATION, GiftReel, SCENES } from "./GiftReel";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { HowScene } from "./scenes/HowScene";
import { RevealScene } from "./scenes/RevealScene";
import { WhereScene } from "./scenes/WhereScene";
import { giftReelSchema, type GiftReelProps } from "./schema";

const defaultProps: GiftReelProps = {
  site: "mysalon.ma",
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
    stop: "ARRÊTE",
    lead: "D'OFFRIR…",
    items: ["des fleurs", "du parfum", "des chocolats"],
    turn: "Cette fois,",
    tease: "offrez mieux.",
  },
  reveal: {
    line1: "Offrir une expérience beauté",
    line2: "N'A JAMAIS ÉTÉ",
    line3: "AUSSI SIMPLE.",
    withLabel: "avec",
    names: ["Maman", "Ma chérie", "Ma best", "Ma femme"],
    caption: "Pour qui vous voulez.",
  },
  where: {
    line1: "À Témara,",
    line2: "dans l'un de nos salons partenaires.",
    salons: [
      { name: "NEW STAR BEAUTY", logo: "newstar-logo.jpg" },
      { name: "OYA MUSE", logo: "oya-logo.jpg" },
    ],
    featuredLabel: "✦ À LA UNE",
    shots: [
      {
        image: "nails-pearl.jpg",
        focusX: 55,
        focusY: 30,
        framed: false,
        label: "ONGLES",
        detail: "Manucure & vernis permanent",
      },
      {
        image: "lash-lift-generated.jpg",
        focusX: 50,
        focusY: 50,
        framed: true,
        label: "CILS",
        detail: "Lash lift",
      },
      {
        image: "brow-lift-generated.jpg",
        focusX: 50,
        focusY: 40,
        framed: true,
        label: "SOURCILS",
        detail: "Brow lift",
      },
    ],
  },
  how: {
    steps: [
      {
        title: "Choisissez le soin",
        subtitle: "Écrivez « CADEAU » en DM et payez en ligne.",
      },
      {
        title: "Elle reçoit sa carte cadeau",
        subtitle: "Digitale, directement sur son téléphone.",
      },
      {
        title: "Elle réserve quand elle veut",
        subtitle: "Chez OYA MUSE, sur mysalon.ma.",
      },
    ],
    senderTag: "VOUS",
    recipientTag: "ELLE",
    dmKeyword: "CADEAU",
    dmReply: "Avec plaisir ! Quel soin souhaitez-vous offrir ?",
    options: [
      "Ongles · Manucure & vernis",
      "Cils · Lash lift",
      "Sourcils · Brow lift",
    ],
    pickIndex: 1,
    payLabel: "Payer",
    paidLabel: "Payé",
    dmSent: "Carte cadeau envoyée !",
    lockTime: "10:24",
    lockDate: "samedi 10 octobre",
    notifTitle: "Vous avez reçu un cadeau !",
    notifBody: "Une expérience beauté chez OYA MUSE vous attend.",
    code: "CADEAU-K7M2",
    recipient: "Sara",
    validLabel: "Cadeau validé : soin offert",
    dates: ["Ven 16", "Sam 17", "Lun 19"],
    slots: ["10:00", "11:30", "14:00", "15:30", "17:00", "18:30"],
    slotIndex: 2,
    confirmTitle: "Rendez-vous confirmé",
    confirmDetail: "Sam 17 · 14:00 · OYA MUSE",
    wallpaper: "nails-pearl.jpg",
  },
  cta: {
    recipient: "quelqu'un de spécial",
    line1: "OFFREZ UNE",
    line2: "EXPÉRIENCE BEAUTÉ",
    lead: "Pour offrir, c'est par message :",
    button: "Écrivez « CADEAU » en DM",
    featuredLabel: "À LA UNE",
    shareAsk: "Vous en rêvez ?",
    shareLine: "Envoyez ce reel à qui doit vous l'offrir.",
  },
  musicFile: "music/gift-theme.mp3",
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
          id="Hook"
          component={HookScene}
          durationInFrames={SCENES.hook.duration}
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
          id="Where"
          component={WhereScene}
          durationInFrames={SCENES.where.duration}
          {...scene}
          defaultProps={{
            where: defaultProps.where,
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
            site: defaultProps.site,
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
