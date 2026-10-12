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
  keys: z
    .array(
      z.object({
        frame: z.number().describe("Frame of the scene"),
        second: z.number().describe("Second of the ad shown at that frame"),
      }),
    )
    .min(2)
    .describe(
      "Keyframes, frames increasing: the ad plays between them at whatever speed joins them, and holds when two keys share a second. The last frame is the scene's length.",
    ),
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

// Nada's WhatsApp on a frozen frame of the ad: the reminder, her reply.
export const chatSceneSchema = z.object({
  kind: z.literal("chat"),
  ...sceneBase,
  duration: z.number().describe("Frames"),
  still: z
    .string()
    .describe("Frame of the ad inside public/, from npm run prep"),
  at: z.number().describe("Frame of the scene when the chat slides in"),
  contact: z.string(),
  status: z.string(),
  dateLabel: z.string(),
  messages: z
    .array(
      z.object({
        from: z.enum(["them", "me"]),
        text: z.string(),
        time: z.string(),
        at: z.number().describe("Frame of the scene when it arrives"),
      }),
    )
    .min(1)
    .max(4),
  note: z.string().describe("System line under the messages"),
  noteAt: z.number(),
});

// The client checked in on the salon's MySalon, the loyalty card stamped.
export const arrivalSceneSchema = z.object({
  kind: z.literal("arrival"),
  ...sceneBase,
  duration: z.number().describe("Frames"),
  still: z
    .string()
    .describe("Frame of the ad inside public/, from npm run prep"),
  at: z.number().describe("Frame of the scene when the card slides in"),
  app: z.string(),
  time: z.string(),
  client: z.string(),
  detail: z.string(),
  status: z.string(),
  checkAt: z.number(),
  points: z.object({
    label: z.string(),
    from: z.number().describe("Stamps before the visit"),
    max: z.number(),
  }),
  stampAt: z.number(),
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
  chatSceneSchema,
  arrivalSceneSchema,
  endSceneSchema,
]);

export const invitationReelSchema = z.object({
  video: z.string().describe("Clip inside public/, made by npm run prep"),
  scenes: z.array(sceneSchema).min(1),
  sfx: z.boolean().describe("Play the sound effects"),
  music: z
    .string()
    .nullable()
    .describe("Soundtrack inside public/, or null for none"),
  musicVolume: z.number().min(0).max(1),
});

export type Caption = z.infer<typeof captionSchema>;
export type Chip = z.infer<typeof chipSchema>;
export type ShotScene = z.infer<typeof shotSceneSchema>;
export type MessagesScene = z.infer<typeof messagesSceneSchema>;
export type NotificationScene = z.infer<typeof notificationSceneSchema>;
export type ChatScene = z.infer<typeof chatSceneSchema>;
export type ArrivalScene = z.infer<typeof arrivalSceneSchema>;
export type EndScene = z.infer<typeof endSceneSchema>;
export type Scene = z.infer<typeof sceneSchema>;
export type InvitationReelProps = z.infer<typeof invitationReelSchema>;
