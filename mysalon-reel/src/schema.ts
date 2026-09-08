import { z } from "zod";

export const featureIconSchema = z.enum([
  "link",
  "clock",
  "bell",
  "calendar",
  "heart",
  "mail",
]);

export const featureSchema = z.object({
  icon: featureIconSchema,
  title: z.string(),
  description: z.string(),
});

export const mySalonReelSchema = z.object({
  handle: z.string(),
  hook: z.object({
    line1: z.string(),
    line2: z.string(),
    line3: z.string(),
  }),
  cost: z.object({
    line1: z.string(),
    line2: z.string(),
    footnote: z.string(),
  }),
  brand: z.object({
    tagline: z.string(),
    badge: z.string(),
    headline: z.string(),
    subheadline: z.string(),
  }),
  features: z.array(featureSchema).length(5),
  offer: z.object({
    title1: z.string(),
    title2: z.string(),
    stampLine1: z.string(),
    stampLine2: z.string(),
    details1: z.string(),
    details2: z.string(),
    cta: z.string(),
    founder: z.string(),
    footer: z.string(),
  }),
});

export type FeatureIcon = z.infer<typeof featureIconSchema>;
export type Feature = z.infer<typeof featureSchema>;
export type MySalonReelProps = z.infer<typeof mySalonReelSchema>;
