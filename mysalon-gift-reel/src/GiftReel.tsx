import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill, Easing, interpolate, staticFile } from "remotion";
import { SoundContext } from "./components/Sfx";
import { blurZoom, irisGlow, starWipe } from "./components/transitions";
import "./fonts";
import { CtaScene } from "./scenes/CtaScene";
import { HowScene } from "./scenes/HowScene";
import { QuestionScene } from "./scenes/QuestionScene";
import { RevealScene } from "./scenes/RevealScene";
import { ServicesScene } from "./scenes/ServicesScene";
import type { GiftReelProps } from "./schema";
import { EMERALD_INK, GOLD } from "./theme";

const easing = Easing.bezier(0.65, 0, 0.35, 1);
const goldGlow = "rgba(233,213,166,0.95)";

// A 36-second, loopable cut on a two-second grid (60 frames). Scene lengths
// include the overlap with the next scene (the transition):
//   0 - 4 s    Question   "Vous ne savez pas quoi lui offrir ?"
//   4 - 10 s   Reveal     "Offrez une expérience beauté à votre maman…", the card
//   10 - 22 s  Services   the treatments, four seconds each, photos big
//   22 - 30 s  How        two four-second steps on two phones
//   30 - 36 s  CTA        "Écrivez CADEAU en DM", chez OYA MUSE
// With the optional soundtrack (120 BPM), every scene starts on a bar line.
export const SCENES = {
  question: { duration: 132, overlap: 12 },
  reveal: { duration: 190, overlap: 10 },
  services: { duration: 372, overlap: 12 },
  how: { duration: 252, overlap: 12 },
  cta: { duration: 180, overlap: 0 },
};

export const GIFT_REEL_DURATION = Object.values(SCENES).reduce(
  (sum, s) => sum + s.duration - s.overlap,
  0,
);

export const GiftReel: React.FC<GiftReelProps> = ({
  partner,
  card,
  hook,
  reveal,
  services,
  how,
  cta,
  sfx,
  musicFile,
}) => {
  return (
    <SoundContext.Provider value={sfx}>
      <AbsoluteFill style={{ backgroundColor: EMERALD_INK }}>
        <TransitionSeries>
          <TransitionSeries.Sequence
            durationInFrames={SCENES.question.duration}
            name="Question"
          >
            <QuestionScene hook={hook} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={starWipe({ edgeColor: GOLD, glow: goldGlow })}
            timing={linearTiming({
              durationInFrames: SCENES.question.overlap,
              easing,
            })}
          />
          <TransitionSeries.Sequence
            durationInFrames={SCENES.reveal.duration}
            name="Reveal"
          >
            <RevealScene reveal={reveal} card={card} partner={partner} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={blurZoom()}
            timing={linearTiming({
              durationInFrames: SCENES.reveal.overlap,
              easing,
            })}
          />
          <TransitionSeries.Sequence
            durationInFrames={SCENES.services.duration}
            name="Services"
          >
            <ServicesScene services={services} partner={partner} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={slide({ direction: "from-right" })}
            timing={linearTiming({
              durationInFrames: SCENES.services.overlap,
              easing,
            })}
          />
          <TransitionSeries.Sequence
            durationInFrames={SCENES.how.duration}
            name="How it works"
          >
            <HowScene how={how} card={card} partner={partner} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={irisGlow({ edgeColor: GOLD, glow: goldGlow })}
            timing={linearTiming({
              durationInFrames: SCENES.how.overlap,
              easing,
            })}
          />
          <TransitionSeries.Sequence
            durationInFrames={SCENES.cta.duration}
            name="CTA"
          >
            <CtaScene cta={cta} card={card} partner={partner} />
          </TransitionSeries.Sequence>
        </TransitionSeries>
        {musicFile ? (
          <Audio
            name="Music"
            src={staticFile(musicFile)}
            volume={(frame) =>
              interpolate(frame, [0, 1], [0, 0.76], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            }
          />
        ) : null}
      </AbsoluteFill>
    </SoundContext.Provider>
  );
};
