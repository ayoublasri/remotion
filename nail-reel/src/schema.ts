import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const nailSetSchema = z.object({
  image: z.string().describe("File name inside public/images"),
  title: z.string(),
  subtitle: z.string(),
  tags: z.array(z.string()),
  accent: zColor(),
  focusX: z
    .number()
    .min(0)
    .max(100)
    .describe("Horizontal focus point of the photo in % (0 = left edge)"),
  sparkles: z.array(
    z.object({
      x: z.number().min(0).max(100),
      y: z.number().min(0).max(100),
    }),
  ),
});

export const nailReelSchema = z.object({
  handle: z.string(),
  hook: z.object({
    top: z.string(),
    middle: z.string(),
    bottom: z.string(),
  }),
  sets: z.array(nailSetSchema).length(3),
  outro: z.object({
    title: z.string(),
    cta: z.string(),
    footer: z.string(),
  }),
  musicFile: z
    .string()
    .nullable()
    .describe("Optional audio file inside public/, e.g. music.mp3"),
});

export type NailSet = z.infer<typeof nailSetSchema>;
export type NailReelProps = z.infer<typeof nailReelSchema>;
