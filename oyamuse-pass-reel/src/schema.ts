import { z } from "zod";

export const offerSchema = z.object({
  image: z.string().describe("File name inside public/images"),
  focusX: z.number().min(0).max(100),
  focusY: z.number().min(0).max(100),
  zoom: z.number().min(1).max(4).describe("Extra zoom on the thumbnail"),
  title: z.string(),
  subtitle: z.string(),
  oldPrice: z.number(),
  newPrice: z.number(),
  scarcity: z.string(),
});

export const stepSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
});

export const passReelSchema = z.object({
  site: z.string().describe("The platform to contact, shown in the footers"),
  logo: z.string().describe("Salon logo file inside public/images"),
  hook: z.object({
    image: z.string(),
    line1: z.string(),
    line2: z.string(),
  }),
  collab: z.object({
    intro: z.string(),
    name: z.string(),
    city: z.string(),
    outro: z.string(),
  }),
  title: z.object({
    salon: z.string(),
    line1: z.string(),
    line2: z.string(),
    tagline: z.string(),
    pills: z.array(z.string()).length(3),
  }),
  offers: z.array(offerSchema).length(3),
  validity: z.object({
    intro: z.string(),
    only: z.string(),
    days: z.string(),
    activeDays: z
      .array(z.number().min(0).max(6))
      .describe("Indexes into L M M J V S D"),
    hours: z.string(),
    fromHour: z.number().min(0).max(23),
    toHour: z.number().min(0).max(23),
    note: z.string(),
  }),
  how: z.object({
    question: z.string(),
    answer: z.string(),
    steps: z.array(stepSchema).length(3),
    code: z.string().describe("Example code typed on the ticket"),
    dmMessage: z.string().describe("Client message in the DM illustration"),
    payLabel: z.string(),
    paidLabel: z.string(),
    slotLabel: z.string(),
  }),
  code: z.object({
    intro: z.string(),
    days: z.number(),
    unit: z.string(),
    outro: z.string(),
    reminder: z.string(),
  }),
  cta: z.object({
    line1: z.string(),
    line2: z.string(),
    line3: z.string(),
    urgency: z.string(),
    lead: z.string(),
    button: z.string(),
    conditions: z.string(),
  }),
  musicFile: z
    .string()
    .nullable()
    .describe("Audio file inside public/, or null for silent"),
});

export type Offer = z.infer<typeof offerSchema>;
export type Step = z.infer<typeof stepSchema>;
export type PassReelProps = z.infer<typeof passReelSchema>;
