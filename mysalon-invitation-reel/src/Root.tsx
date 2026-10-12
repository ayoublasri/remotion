import { Composition } from "remotion";
import { InvitationReel, timeline } from "./InvitationReel";
import { invitationReelSchema, type InvitationReelProps } from "./schema";

// French typography: no-break spaces before ? and :, and inside « ».
const NBSP = " ";

// The ad video's shots (seconds of the source), each slowed down so that it
// can be read, with its captions on the shot's own frames.
const defaultProps: InvitationReelProps = {
  video: "video/source-60.mp4",
  shots: [
    {
      id: "DMs",
      from: 0,
      to: 2.1,
      rate: 0.6,
      flash: false,
      captions: [
        {
          at: 6,
          until: null,
          lines: ["Tes clientes réservent", `encore *par DM*${NBSP}?`],
          size: 54,
        },
      ],
      sounds: [
        { name: "ding", at: 0, volume: 0.9 },
        { name: "ding", at: 9, volume: 0.81 },
        { name: "ding", at: 25, volume: 0.72 },
      ],
    },
    {
      id: "Link in bio",
      from: 2.1,
      to: 2.7,
      rate: 0.6,
      flash: true,
      captions: [
        { at: 2, until: null, lines: ["Un *lien* dans ta bio."], size: 50 },
      ],
      sounds: [],
    },
    {
      id: "QR stand",
      from: 2.8,
      to: 3.35,
      rate: 0.6,
      flash: true,
      captions: [
        { at: 2, until: null, lines: ["Un *QR* sur ton comptoir."], size: 50 },
      ],
      sounds: [],
    },
    {
      id: "Booking",
      from: 3.45,
      to: 5.45,
      rate: 0.7,
      flash: true,
      captions: [
        { at: 2, until: 44, lines: ["Elle *réserve seule*."], size: 50 },
        {
          at: 46,
          until: null,
          lines: ["Samedi 11:00", "*Confirmé*, sans toi."],
          size: 50,
        },
      ],
      sounds: [{ name: "success", at: 46, volume: 0.9 }],
    },
    {
      id: "Agenda",
      from: 5.45,
      to: 7.45,
      rate: 0.65,
      flash: true,
      captions: [
        {
          at: 2,
          until: null,
          lines: ["Ton agenda", "se remplit *tout seul*."],
          size: 50,
        },
      ],
      sounds: [
        { name: "tick", at: 20, volume: 0.54 },
        { name: "tick", at: 44, volume: 0.54 },
        { name: "tick", at: 68, volume: 0.54 },
      ],
    },
    {
      id: "Reminders",
      from: 7.45,
      to: 8.35,
      rate: 0.5,
      flash: true,
      captions: [
        {
          at: 2,
          until: 48,
          lines: ["Rappels *WhatsApp*.", "Fidélité *automatique*."],
          size: 48,
        },
      ],
      sounds: [],
    },
  ],
  wordmarkFrom: null,
  end: {
    duration: 120,
    kicker: "POUR LES SALONS DE BEAUTÉ",
    madeIn: "Fait au Maroc",
    perks: "0 commission · 0 paiement en ligne",
    lead: `Pour ouvrir ton salon sur MySalon${NBSP}:`,
    cta: `DM «${NBSP}INVITATION${NBSP}»`,
    site: "mysalon.ma",
  },
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
