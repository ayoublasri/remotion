import { Composition, Folder } from "remotion";
import { GIFT_REEL_DURATION, GiftReel, SCENES } from "./GiftReel";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { HowScene } from "./scenes/HowScene";
import { MontageScene } from "./scenes/MontageScene";
import { RevealScene } from "./scenes/RevealScene";
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
    label: "CARTE CADEAU",
    title: "Une expérience",
    via: "via",
  },
  hook: {
    stop: "ARRÊTE",
    lead: "D'OFFRIR…",
    items: ["des fleurs", "du parfum", "des chocolats"],
    turn: "Offre plutôt",
    tease: "une vraie…",
  },
  reveal: {
    line1: "une vraie",
    line2: "EXPÉRIENCE",
    names: ["Maman", "Ma chérie", "Ma best", "Ma sœur", "Ma femme"],
    caption: "Pour qui tu veux.",
  },
  montage: {
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
    finaleImage: "nails-pink-florals.jpg",
    finaleLead: "chez",
  },
  how: {
    steps: [
      {
        title: "Écris « CADEAU » en DM",
        subtitle: "Tu choisis le soin, tu paies en ligne.",
      },
      {
        title: "Elle reçoit son code",
        subtitle: "Directement sur son téléphone.",
      },
      {
        title: "Elle réserve quand elle veut",
        subtitle: "Chez OYA MUSE, sur mysalon.ma.",
      },
    ],
    senderTag: "TOI",
    recipientTag: "ELLE",
    dmKeyword: "CADEAU",
    dmReply: "Avec plaisir ! Voici sa carte cadeau :",
    giftLabel: "Carte cadeau",
    giftDetail: "Soin OYA MUSE au choix",
    payLabel: "Payer",
    paidLabel: "Payé",
    dmSent: "Code envoyé !",
    lockTime: "10:24",
    lockDate: "samedi 10 octobre",
    notifTitle: "Tu as reçu un cadeau !",
    notifBody: "Une expérience OYA MUSE t'attend. Ton code :",
    code: "CADEAU-K7M2",
    validLabel: "Cadeau validé : soin offert",
    dates: ["Ven 16", "Sam 17", "Lun 19"],
    slots: ["10:00", "11:30", "14:00", "15:30", "17:00", "18:30"],
    slotIndex: 2,
    confirmTitle: "Rendez-vous confirmé",
    confirmDetail: "Sam 17 · 14:00 · OYA MUSE",
    wallpaper: "nails-pearl.jpg",
  },
  cta: {
    recipient: "toi",
    dreamAsk: "TU EN RÊVES ?",
    dreamLine: "Envoie ce reel à qui doit te l'offrir.",
    giftAsk: "TU VEUX L'OFFRIR ?",
    button: "Écris « CADEAU » en DM",
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
          id="Montage"
          component={MontageScene}
          durationInFrames={SCENES.montage.duration}
          {...scene}
          defaultProps={{
            montage: defaultProps.montage,
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
