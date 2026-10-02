import { z } from "zod";

export const rowSchema = z.object({
  image: z
    .string()
    .nullable()
    .describe("Round thumbnail inside public/images, or null"),
  hair: z
    .enum(["short", "medium", "long"])
    .nullable()
    .describe("Hair-length icon when there is no image"),
  name: z.string(),
  oldPrice: z.number(),
  newPrice: z.number(),
});

export const windowSchema = z.object({
  title: z.string().describe("Small label above the days, or empty"),
  days: z.string(),
  hours: z.string(),
  fromHour: z.number().min(0).max(24),
  toHour: z.number().min(0).max(24),
  rows: z.array(rowSchema).min(1).max(3),
});

export const paletteSchema = z.object({
  bg: z.string(),
  bgDeep: z.string(),
  deep: z.string(),
  accent: z.string(),
  soft: z.string(),
});

export const salonSchema = z.object({
  label: z.string(),
  name: z.string(),
  nameLine2: z.string(),
  place: z.string(),
  logo: z.string(),
  backdrop: z
    .string()
    .describe("Photo inside public/images, blurred behind the scene"),
  palette: paletteSchema,
  windows: z.array(windowSchema).min(1).max(2),
  note: z.string(),
});

export const stepSchema = z.object({ title: z.string(), subtitle: z.string() });

export const happyHoursReelSchema = z.object({
  site: z.string(),
  hook: z.object({
    leftImage: z.string(),
    rightImage: z.string(),
    line1: z.string(),
    line2: z.string(),
    line3: z.string(),
    subtitle: z.string(),
  }),
  salons: z.array(salonSchema).length(2),
  how: z.object({
    question: z.string(),
    answer: z.string(),
    steps: z.array(stepSchema).length(3),
    code: z.string(),
    dmMessage: z.string(),
    payLabel: z.string(),
    paidLabel: z.string(),
    slotLabel: z.string(),
    footer: z.string(),
  }),
  cta: z.object({
    line1: z.string(),
    line2: z.string(),
    line3: z.string(),
    lead: z.string(),
    button: z.string(),
    conditions: z.string(),
  }),
  musicFile: z.string().nullable(),
});

export type WindowRow = z.infer<typeof rowSchema>;
export type HourWindow = z.infer<typeof windowSchema>;
export type Palette = z.infer<typeof paletteSchema>;
export type Salon = z.infer<typeof salonSchema>;
export type HappyHoursReelProps = z.infer<typeof happyHoursReelSchema>;
