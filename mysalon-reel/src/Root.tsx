import { Composition, Folder } from "remotion";
import { MySalonReel } from "./MySalonReel";
import { CostScene } from "./scenes/CostScene";
import { HookScene } from "./scenes/HookScene";
import { OfferScene } from "./scenes/OfferScene";
import { ProductScene } from "./scenes/ProductScene";
import { mySalonReelSchema } from "./schema";

const hook = {
  line1: "Yeddik f la coloration,",
  line2: "le téléphone kaysoni...",
  line3: "w le client mcha l salon akhor.",
};

const cost = {
  line1: "Koula appel manqué,",
  line2: "client khserto.",
  footnote: "Koula DM nsiti = créneau khawi.",
};

const brand = {
  tagline: "Réservation dyal salon dyalk, f jibek.",
  badge: "Fait au Maroc",
  headline: "Votre salon, réservé 24h/24.",
  subheadline: "Un lien, un QR code — et votre agenda se remplit tout seul.",
};

const features = [
  {
    icon: "link" as const,
    title: "Un lien + un QR code",
    description: "Bio Instagram, WhatsApp, vitrine du salon.",
  },
  {
    icon: "clock" as const,
    title: "Réservation 24h/24",
    description: "7ta ila kan le salon msdoud, bla appels, bla DM.",
  },
  {
    icon: "bell" as const,
    title: "Rappel automatique",
    description: "La veille, par email : moins de no-shows.",
  },
  {
    icon: "calendar" as const,
    title: "Agenda en direct",
    description: "Par poste, par employé, pauses incluses.",
  },
  {
    icon: "heart" as const,
    title: "Clients fidélisés",
    description: "Historique, dépenses, offre WhatsApp en 1 clic.",
  },
];

const offer = {
  title1: "3 MOIS",
  title2: "GRATUITS",
  stampLine1: "Offre de lancement",
  stampLine2: "Ghir 20 salons",
  details1: "Bla engagement · Bla carte bancaire",
  details2: "Ghir l 20 premiers salons",
  cta: "Écrivez-nous en DM",
  founder: "M3ak Ayoub, fondateur — réponse f nhar.",
  footer: "mysalon.ma · Fait au Maroc",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MySalonReel"
        component={MySalonReel}
        durationInFrames={1077}
        fps={30}
        width={1080}
        height={1920}
        schema={mySalonReelSchema}
        defaultProps={{
          handle: "@mysalo_ma",
          hook,
          cost,
          brand,
          features,
          offer,
        }}
      />
      <Folder name="MySalonReel-Scenes">
        <Composition
          id="Hook"
          component={HookScene}
          durationInFrames={165}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ hook }}
        />
        <Composition
          id="Cost"
          component={CostScene}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ cost }}
        />
        <Composition
          id="Product"
          component={ProductScene}
          durationInFrames={630}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ handle: "@mysalo_ma", brand, features }}
        />
        <Composition
          id="Offer"
          component={OfferScene}
          durationInFrames={180}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ offer, handle: "@mysalo_ma" }}
        />
      </Folder>
    </>
  );
};
