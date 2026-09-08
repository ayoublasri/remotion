import { z } from "zod";

export const nailSetSchema = z.object({
  image: z.string().describe("File name inside public/images"),
  title: z.string(),
  descriptor: z.string(),
  focusX: z.number().min(0).max(100),
  focusY: z.number().min(0).max(100),
  sparkles: z.array(z.object({ x: z.number(), y: z.number() })),
});

export const oyamuseReelSchema = z.object({
  handle: z.string(),
  hook: z.object({
    line1: z.string(),
    line2: z.string(),
    line3: z.string(),
    line4: z.string(),
  }),
  brand: z.object({
    name: z.string(),
    descriptor: z.string(),
  }),
  nails: z.array(nailSetSchema).length(3),
  brows: z.object({
    image: z.string(),
    title: z.string(),
    descriptor: z.string(),
    beforeLabel: z.string(),
    afterLabel: z.string(),
    coverTitle: z.string(),
    coverSubtitle: z.string(),
    lashImage: z.string(),
    lashTitle: z.string(),
    lashDescriptor: z.string(),
  }),
  services: z.object({
    title: z.string(),
    items: z.array(z.string()).length(4),
    footnote: z.string(),
  }),
  cta: z.object({
    title1: z.string(),
    title2: z.string(),
    button: z.string(),
    footer: z.string(),
  }),
  musicFile: z
    .string()
    .nullable()
    .describe("Audio file inside public/, or null for silent"),
});

export type NailSet = z.infer<typeof nailSetSchema>;
export type OyamuseReelProps = z.infer<typeof oyamuseReelSchema>;
