import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill, Easing, interpolate, staticFile } from "remotion";
import { blurZoom, irisGlow, starWipe } from "./components/transitions";
import "./fonts";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { HowScene } from "./scenes/HowScene";
import { RevealScene } from "./scenes/RevealScene";
import { ServicesScene } from "./scenes/ServicesScene";
import type { GiftReelProps } from "./schema";
import { EMERALD_INK, GOLD } from "./theme";

const easing = Easing.bezier(0.65, 0, 0.35, 1);
const goldGlow = "rgba(233,213,166,0.95)";

// A 36-second, loopable cut. Scene lengths include the overlap with the next
// scene (the transition), so that every scene starts on a downbeat of the
// 120 BPM soundtrack (60 frames per bar):
//   bars 1-2   Hook       0 - 120   "ARRÊTE D'OFFRIR...", build, silence
//   bars 3-5   Reveal   120 - 300   drop: offer OYA MUSE, the card, the names
//   bars 6-11  Services 300 - 660   the treatments, two bars each, photos big
//   bars 12-15 How      660 - 900   two four-second steps, build at the end
//   bars 16-18 CTA      900 - 1080  second drop, the invite, record stop
export const SCENES = {
  hook: { duration: 132, overlap: 12 },
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
  musicFile,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: EMERALD_INK }}>
      <TransitionSeries>
        <TransitionSeries.Sequence
          durationInFrames={SCENES.hook.duration}
          name="Hook"
        >
          <HookScene hook={hook} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={starWipe({ edgeColor: GOLD, glow: goldGlow })}
          timing={linearTiming({
            durationInFrames: SCENES.hook.overlap,
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
  );
};
