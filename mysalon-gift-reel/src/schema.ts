import { z } from "zod";

export const partnerSchema = z.object({
  name: z.string().describe("The salon being offered"),
  city: z.string(),
  logo: z.string().describe("Salon logo inside public/images"),
  services: z.string(),
});

export const giftCardSchema = z.object({
  label: z.string(),
  title: z.string(),
  via: z.string().describe("Printed before the MySalon.ma wordmark"),
});

export const shotSchema = z.object({
  image: z.string().describe("Photo inside public/images"),
  focusX: z.number().min(0).max(100),
  focusY: z.number().min(0).max(100),
  framed: z
    .boolean()
    .describe("Show as a framed card over a blurred fill (for small photos)"),
  label: z.string(),
  detail: z.string(),
});

export const giftReelSchema = z.object({
  site: z.string().describe("The platform people book the gift through"),
  partner: partnerSchema,
  card: giftCardSchema,
  hook: z.object({
    stop: z.string(),
    lead: z.string(),
    items: z.array(z.string()).length(3),
    turn: z.string(),
    tease: z.string(),
  }),
  reveal: z.object({
    line1: z.string(),
    line2: z.string(),
    names: z
      .array(z.string())
      .min(1)
      .max(6)
      .describe("Written on the card one after the other"),
    caption: z.string(),
  }),
  montage: z.object({
    shots: z.array(shotSchema).length(3),
    finaleImage: z.string(),
    finaleLead: z.string(),
  }),
  how: z.object({
    steps: z
      .array(z.object({ title: z.string(), subtitle: z.string() }))
      .length(3),
    senderTag: z.string(),
    recipientTag: z.string(),
    dmKeyword: z.string(),
    dmReply: z.string(),
    giftLabel: z.string(),
    giftDetail: z.string(),
    payLabel: z.string(),
    paidLabel: z.string(),
    dmSent: z.string(),
    lockTime: z.string(),
    lockDate: z.string(),
    notifTitle: z.string(),
    notifBody: z.string(),
    code: z.string(),
    validLabel: z.string(),
    dates: z.array(z.string()).length(3),
    slots: z.array(z.string()).length(6),
    slotIndex: z.number().min(0).max(5),
    confirmTitle: z.string(),
    confirmDetail: z.string(),
    wallpaper: z.string(),
  }),
  cta: z.object({
    recipient: z.string(),
    dreamAsk: z.string(),
    dreamLine: z.string(),
    giftAsk: z.string(),
    button: z.string(),
  }),
  musicFile: z
    .string()
    .nullable()
    .describe("Audio file inside public/, or null for silent"),
});

export type Partner = z.infer<typeof partnerSchema>;
export type GiftCardContent = z.infer<typeof giftCardSchema>;
export type Shot = z.infer<typeof shotSchema>;
export type GiftReelProps = z.infer<typeof giftReelSchema>;
