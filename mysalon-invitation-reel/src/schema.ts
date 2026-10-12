import { z } from "zod";

export const captionSchema = z.object({
  at: z.number().describe("Frame of the scene when it appears"),
  until: z
    .number()
    .nullable()
    .describe("Frame of the scene when it leaves, or null for the scene's end"),
  lines: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe("One pill per line; *word* highlights it"),
  size: z.number().describe("Font size"),
});

export const chipSchema = z.object({
  text: z.string().describe("Day and time of the story, e.g. LUNDI · 23:14"),
  at: z.number().describe("Frame of the scene when it appears"),
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
  at: z.number().describe("Frame of the scene"),
  volume: z.number().min(0).max(1),
});

const sceneBase = {
  id: z.string(),
  chips: z.array(chipSchema).max(3),
  captions: z.array(captionSchema),
  sounds: z.array(soundSchema),
};

// A shot of the ad video, slowed down.
export const shotSceneSchema = z.object({
  kind: z.literal("shot"),
  ...sceneBase,
  from: z.number().describe("Second of the source where the shot starts"),
  to: z.number().describe("Second of the source where the shot ends"),
  rate: z.number().min(0.2).max(2).describe("Playback speed"),
  flash: z.boolean().describe("White flash and whoosh on the cut"),
  counter: z
    .object({
      label: z.string().describe("After the number, e.g. réservations"),
      to: z.number(),
      at: z.number().describe("Frame of the scene when it starts counting"),
    })
    .nullable(),
});

// Messages piling up on a frozen frame of the ad.
export const messagesSceneSchema = z.object({
  kind: z.literal("messages"),
  ...sceneBase,
  duration: z.number().describe("Frames"),
  still: z
    .string()
    .describe("Frame of the ad inside public/, from npm run prep"),
  badgeFrom: z.number().describe("Unread count before the messages arrive"),
  badgeLabel: z.string(),
  messages: z
    .array(
      z.object({
        name: z.string(),
        text: z.string(),
        at: z.number().describe("Frame of the scene when it arrives"),
      }),
    )
    .min(1)
    .max(5),
});

// A booking notification on a frozen frame of the ad.
export const notificationSceneSchema = z.object({
  kind: z.literal("notification"),
  ...sceneBase,
  duration: z.number().describe("Frames"),
  still: z
    .string()
    .describe("Frame of the ad inside public/, from npm run prep"),
  at: z.number().describe("Frame of the scene when the notification drops"),
  app: z.string(),
  title: z.string(),
  body: z.string(),
});

// The end card: the result of the story, then the brand and the call to action.
export const endSceneSchema = z.object({
  kind: z.literal("end"),
  ...sceneBase,
  duration: z.number().describe("Frames"),
  result: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe("Big lines in ink; *word* highlights it"),
  brandAt: z.number().describe("Frame of the scene when the brand block rises"),
  kicker: z.string(),
  madeIn: z.string(),
  perks: z.string(),
  lead: z.string(),
  cta: z.string(),
  site: z.string(),
});

export const sceneSchema = z.discriminatedUnion("kind", [
  shotSceneSchema,
  messagesSceneSchema,
  notificationSceneSchema,
  endSceneSchema,
]);

export const invitationReelSchema = z.object({
  video: z.string().describe("Clip inside public/, made by npm run prep"),
  scenes: z.array(sceneSchema).min(1),
  sfx: z.boolean().describe("Play the sound effects"),
});

export type Caption = z.infer<typeof captionSchema>;
export type Chip = z.infer<typeof chipSchema>;
export type ShotScene = z.infer<typeof shotSceneSchema>;
export type MessagesScene = z.infer<typeof messagesSceneSchema>;
export type NotificationScene = z.infer<typeof notificationSceneSchema>;
export type EndScene = z.infer<typeof endSceneSchema>;
export type Scene = z.infer<typeof sceneSchema>;
export type InvitationReelProps = z.infer<typeof invitationReelSchema>;
