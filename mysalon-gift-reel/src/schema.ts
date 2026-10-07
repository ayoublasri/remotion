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
  at: z.string().describe("Printed before the salon name, e.g. 'chez'"),
});

export const photoSchema = z.object({
  image: z.string().describe("Photo inside public/images"),
  focusX: z.number().min(0).max(100),
  focusY: z.number().min(0).max(100),
});

export const serviceSchema = z.object({
  kicker: z.string().describe("The category, e.g. ONGLES"),
  name: z.string().describe("The treatment, e.g. MANUCURE RUSSE"),
  detail: z.string(),
  price: z.string().describe("e.g. '120 DH'; empty hides the tag"),
  framed: z
    .boolean()
    .describe("Show as a framed card over a blurred fill (for small photos)"),
  photos: z
    .array(photoSchema)
    .min(1)
    .max(2)
    .describe("One photo held for two bars, or two photos for a bar each"),
});

export const giftReelSchema = z.object({
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
    line2: z.string().describe("The salon, in capitals"),
    line3: z.string().describe("Small letter-spaced line under the salon"),
    withLabel: z.string().describe("Printed before the MySalon.ma wordmark"),
    names: z
      .array(z.string())
      .min(1)
      .max(6)
      .describe("Written on the card one after the other"),
    caption: z.string(),
  }),
  services: z.object({
    subtitle: z.string().describe("Under the salon name, in capitals"),
    items: z.array(serviceSchema).length(3),
  }),
  how: z.object({
    steps: z
      .array(z.object({ title: z.string(), subtitle: z.string() }))
      .length(2),
    senderTag: z.string(),
    recipientTag: z.string(),
    dmKeyword: z.string(),
    dmReply: z.string(),
    options: z.array(z.string()).length(3),
    pickIndex: z.number().min(0).max(2),
    payLabel: z.string(),
    paidLabel: z.string(),
    dmSent: z.string(),
    lockTime: z.string(),
    lockDate: z.string(),
    notifTitle: z.string(),
    notifBody: z.string(),
    code: z.string(),
    recipient: z.string().describe("Name written on the card she receives"),
    wallpaper: z.string(),
  }),
  cta: z.object({
    recipient: z.string(),
    line1: z.string(),
    line2: z.string(),
    atLabel: z.string().describe("Printed before the salon, e.g. 'chez'"),
    lead: z.string(),
    button: z.string(),
    shareAsk: z.string(),
    shareLine: z.string(),
  }),
  musicFile: z
    .string()
    .nullable()
    .describe("Audio file inside public/, or null for silent"),
});

export type Partner = z.infer<typeof partnerSchema>;
export type GiftCardContent = z.infer<typeof giftCardSchema>;
export type Photo = z.infer<typeof photoSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type GiftReelProps = z.infer<typeof giftReelSchema>;
