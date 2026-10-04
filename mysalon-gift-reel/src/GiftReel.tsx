import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useVideoConfig,
} from "remotion";
import {
  blurZoom,
  irisGlow,
  ribbonWipe,
  starWipe,
} from "./components/transitions";
import "./fonts";
import { CtaScene } from "./scenes/CtaScene";
import { ForWhomScene } from "./scenes/ForWhomScene";
import { HookScene } from "./scenes/HookScene";
import { HowScene } from "./scenes/HowScene";
import { OfferScene } from "./scenes/OfferScene";
import { RevealScene } from "./scenes/RevealScene";
import type { GiftReelProps } from "./schema";
import { ROSE, ROSE_SOFT, TEAL_INK } from "./theme";

const easing = Easing.bezier(0.65, 0, 0.35, 1);
const pinkGlow = "rgba(244,124,151,0.95)";

// Scene lengths include the overlap with the next scene (the transition), so
// that every scene starts on a downbeat of the 120 BPM soundtrack (60 frames
// per bar):
//   bars 1-2   Hook       0 - 120   music box and heartbeat
//   bars 3-5   Reveal   120 - 300   the drop
//   bars 6-7   For whom 300 - 420   harp
//   bars 8-9   Offer    420 - 540   melody
//   bars 10-13 How      540 - 780   lighter groove, build in bar 13
//   bars 14-16 CTA      780 - 990   second drop, last chord rings out
export const SCENES = {
  hook: { duration: 140, overlap: 20 },
  reveal: { duration: 195, overlap: 15 },
  forWhom: { duration: 138, overlap: 18 },
  offer: { duration: 135, overlap: 15 },
  how: { duration: 258, overlap: 18 },
  cta: { duration: 210, overlap: 0 },
};

export const GIFT_REEL_DURATION = Object.values(SCENES).reduce(
  (sum, s) => sum + s.duration - s.overlap,
  0,
);

export const GiftReel: React.FC<GiftReelProps> = ({
  site,
  partner,
  card,
  hook,
  reveal,
  forWhom,
  offer,
  how,
  cta,
  musicFile,
}) => {
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: TEAL_INK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence
          durationInFrames={SCENES.hook.duration}
          name="Hook"
        >
          <HookScene hook={hook} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={starWipe({ edgeColor: ROSE_SOFT, glow: pinkGlow })}
          timing={linearTiming({
            durationInFrames: SCENES.hook.overlap,
            easing,
          })}
        />
        <TransitionSeries.Sequence
          durationInFrames={SCENES.reveal.duration}
          name="Reveal"
        >
          <RevealScene reveal={reveal} card={card} partnerLogo={partner.logo} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={blurZoom()}
          timing={linearTiming({
            durationInFrames: SCENES.reveal.overlap,
            easing,
          })}
        />
        <TransitionSeries.Sequence
          durationInFrames={SCENES.forWhom.duration}
          name="For whom"
        >
          <ForWhomScene forWhom={forWhom} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={ribbonWipe({ band: 120 })}
          timing={linearTiming({
            durationInFrames: SCENES.forWhom.overlap,
            easing,
          })}
        />
        <TransitionSeries.Sequence
          durationInFrames={SCENES.offer.duration}
          name="Offer"
        >
          <OfferScene offer={offer} partnerLogo={partner.logo} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({
            durationInFrames: SCENES.offer.overlap,
            easing,
          })}
        />
        <TransitionSeries.Sequence
          durationInFrames={SCENES.how.duration}
          name="How it works"
        >
          <HowScene how={how} partner={partner} site={site} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={irisGlow({ edgeColor: ROSE, glow: pinkGlow })}
          timing={linearTiming({
            durationInFrames: SCENES.how.overlap,
            easing,
          })}
        />
        <TransitionSeries.Sequence
          durationInFrames={SCENES.cta.duration}
          name="CTA"
        >
          <CtaScene cta={cta} card={card} partnerLogo={partner.logo} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      {musicFile ? (
        <Audio
          name="Music"
          src={staticFile(musicFile)}
          volume={(frame) =>
            interpolate(
              frame,
              [0, 6, durationInFrames - 20, durationInFrames - 1],
              [0, 1, 1, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            )
          }
        />
      ) : null}
    </AbsoluteFill>
  );
};
