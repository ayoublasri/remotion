import { z } from "zod";

export const captionSchema = z.object({
  at: z.number().describe("Frame of the shot when it appears"),
  until: z
    .number()
    .nullable()
    .describe("Frame of the shot when it leaves, or null for the shot's end"),
  lines: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe("One pill per line; *word* highlights it"),
  size: z.number().describe("Font size"),
});

export const soundSchema = z.object({
  name: z.enum([
    "whoosh",
    "stamp",
    "pop",
    "tick",
    "ding",
    "success",
    "sparkle",
    "strike",
  ]),
  at: z.number().describe("Frame of the shot"),
  volume: z.number().min(0).max(1),
});

export const shotSchema = z.object({
  id: z.string(),
  from: z.number().describe("Second of the source where the shot starts"),
  to: z.number().describe("Second of the source where the shot ends"),
  rate: z.number().min(0.25).max(2).describe("Playback speed"),
  flash: z.boolean().describe("White flash and whoosh on the cut"),
  captions: z.array(captionSchema),
  sounds: z.array(soundSchema),
});

export const invitationReelSchema = z.object({
  video: z.string().describe("Clip inside public/, made by npm run prep"),
  shots: z.array(shotSchema).min(1),
  wordmarkFrom: z
    .number()
    .nullable()
    .describe(
      "Index of the first shot that shows the MySalon.ma wordmark, or null",
    ),
  end: z.object({
    duration: z.number().describe("Frames"),
    kicker: z.string(),
    madeIn: z.string(),
    perks: z.string(),
    lead: z.string(),
    cta: z.string(),
    site: z.string(),
  }),
  sfx: z.boolean().describe("Play the sound effects"),
});

export type Caption = z.infer<typeof captionSchema>;
export type Shot = z.infer<typeof shotSchema>;
export type InvitationReelProps = z.infer<typeof invitationReelSchema>;
