import { Composition, Folder } from "remotion";
import { GIFT_REEL_DURATION, GiftReel, SCENES } from "./GiftReel";
import { CtaScene } from "./scenes/CtaScene";
import { ForWhomScene } from "./scenes/ForWhomScene";
import { HookScene } from "./scenes/HookScene";
import { HowScene } from "./scenes/HowScene";
import { OfferScene } from "./scenes/OfferScene";
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
    title: "Un moment",
    via: "via",
  },
  hook: {
    items: ["Des fleurs ?", "Un parfum ?", "Des chocolats ?"],
    line1: "Cette fois,",
    line2: "offrez un moment",
  },
  reveal: {
    recipient: "Maman",
    line1: "Offrez un soin OYA MUSE",
    line2: "à quelqu'un de spécial.",
    bookOn: "Réservez-le sur",
  },
  forWhom: {
    label: "POUR…",
    names: ["Votre sœur", "Votre meilleure amie", "Votre chérie"],
    payoff1: "…ou juste",
    payoff2: "parce que.",
    backdrop: "nails-pink-florals.jpg",
  },
  offer: {
    title: "Choisissez le soin à offrir",
    services: [
      {
        image: "nails-pearl.jpg",
        focusX: 55,
        focusY: 10,
        label: "ONGLES",
        detail: "Manucure & vernis permanent",
      },
      {
        image: "lash-lift-generated.jpg",
        focusX: 50,
        focusY: 50,
        label: "CILS",
        detail: "Lash lift",
      },
      {
        image: "brow-lift-generated.jpg",
        focusX: 50,
        focusY: 40,
        label: "SOURCILS",
        detail: "Brow lift",
      },
    ],
    note: "Le cadeau qui fait vraiment plaisir.",
  },
  how: {
    label: "COMMENT ÇA MARCHE ?",
    steps: [
      {
        title: "Écrivez-nous en DM",
        subtitle: "Choisissez le soin et réglez en ligne.",
      },
      {
        title: "Votre proche reçoit son code",
        subtitle: "Directement sur son téléphone.",
      },
      {
        title: "Et réserve chez OYA MUSE",
        subtitle: "Avec son code, sur mysalon.ma.",
      },
    ],
    senderTag: "VOUS",
    recipientTag: "VOTRE SŒUR",
    dmRequest: "Bonjour ! Je voudrais offrir un soin OYA MUSE à ma sœur.",
    dmReply: "Avec plaisir ! Voici sa carte cadeau :",
    giftLabel: "Carte cadeau",
    giftDetail: "Soin OYA MUSE au choix",
    payLabel: "Payer",
    paidLabel: "Payé",
    dmSent: "Code envoyé à votre sœur",
    lockTime: "10:24",
    lockDate: "samedi 10 octobre",
    notifTitle: "Vous avez reçu un cadeau !",
    notifBody: "Un soin OYA MUSE vous attend. Votre code :",
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
    recipient: "quelqu'un de spécial",
    line1: "OFFREZ UN MOMENT",
    lead: "Réservez le cadeau via",
    button: "Écrivez-nous en DM",
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
          defaultProps={{
            hook: defaultProps.hook,
            partner: defaultProps.partner,
          }}
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
          id="ForWhom"
          component={ForWhomScene}
          durationInFrames={SCENES.forWhom.duration}
          {...scene}
          defaultProps={{ forWhom: defaultProps.forWhom }}
        />
        <Composition
          id="Offer"
          component={OfferScene}
          durationInFrames={SCENES.offer.duration}
          {...scene}
          defaultProps={{
            offer: defaultProps.offer,
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
