import { z } from "zod";

export const serviceSchema = z.object({
  image: z.string().describe("Photo inside public/images"),
  focusX: z.number().min(0).max(100),
  focusY: z.number().min(0).max(100),
  label: z.string(),
  detail: z.string(),
});

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

export const giftReelSchema = z.object({
  site: z.string().describe("The platform people book the gift through"),
  partner: partnerSchema,
  card: giftCardSchema,
  hook: z.object({
    items: z.array(z.string()).length(3),
    line1: z.string(),
    line2: z.string(),
  }),
  reveal: z.object({
    recipient: z.string().describe("Handwritten on the gift card"),
    line1: z.string(),
    line2: z.string(),
    bookOn: z.string().describe("Printed before the MySalon.ma wordmark"),
  }),
  forWhom: z.object({
    label: z.string(),
    names: z.array(z.string()).length(3),
    payoff1: z.string(),
    payoff2: z.string(),
    backdrop: z.string(),
  }),
  offer: z.object({
    title: z.string(),
    services: z.array(serviceSchema).length(3),
    note: z.string(),
  }),
  how: z.object({
    label: z.string(),
    steps: z
      .array(z.object({ title: z.string(), subtitle: z.string() }))
      .length(3),
    senderTag: z.string(),
    recipientTag: z.string(),
    dmRequest: z.string(),
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
    line1: z.string(),
    lead: z.string().describe("Printed before the MySalon.ma wordmark"),
    button: z.string(),
  }),
  musicFile: z
    .string()
    .nullable()
    .describe("Audio file inside public/, or null for silent"),
});

export type Service = z.infer<typeof serviceSchema>;
export type Partner = z.infer<typeof partnerSchema>;
export type GiftCardContent = z.infer<typeof giftCardSchema>;
export type GiftReelProps = z.infer<typeof giftReelSchema>;
