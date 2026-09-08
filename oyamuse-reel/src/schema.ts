import { z } from "zod";

export const photoSchema = z.object({
  image: z.string().describe("File name inside public/images"),
  focusX: z.number().min(0).max(100),
  focusY: z.number().min(0).max(100),
  sparkles: z.array(z.object({ x: z.number(), y: z.number() })),
});

export const oyamuseReelSchema = z.object({
  handle: z.string(),
  logo: z.string().describe("Logo file inside public/images"),
  hook: z.object({
    line1: z.string(),
    line2: z.string(),
  }),
  labels: z.object({
    nails: z.string(),
    brows: z.string(),
    lashes: z.string(),
  }),
  nails: z.array(photoSchema).length(6),
  brows: z.object({
    image: z.string(),
    beforeLabel: z.string(),
    afterLabel: z.string(),
  }),
  lashes: photoSchema,
  montage: z.array(z.string()).length(8).describe("Image files, one beat each"),
  cta: z.object({
    title1: z.string(),
    title2: z.string(),
    subtitle: z.string(),
    button: z.string(),
  }),
  musicFile: z
    .string()
    .nullable()
    .describe("Audio file inside public/, or null for silent"),
});

export type Photo = z.infer<typeof photoSchema>;
export type OyamuseReelProps = z.infer<typeof oyamuseReelSchema>;
