import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill, Easing, interpolate, staticFile } from "remotion";
import { blurZoom, irisGlow, starWipe } from "./components/transitions";
import "./fonts";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { HowScene } from "./scenes/HowScene";
import { MontageScene } from "./scenes/MontageScene";
import { RevealScene } from "./scenes/RevealScene";
import type { GiftReelProps } from "./schema";
import { EMERALD_INK, GOLD } from "./theme";

const easing = Easing.bezier(0.65, 0, 0.35, 1);
const goldGlow = "rgba(233,213,166,0.95)";

// A 24-second, loopable cut. Scene lengths include the overlap with the next
// scene (the transition), so that every scene starts on a downbeat of the
// 120 BPM soundtrack (60 frames per bar):
//   bars 1-2   Hook      0 - 120   "ARRÊTE D'OFFRIR...", build, silence
//   bars 3-4   Reveal  120 - 240   drop: the experience, the card, the names
//   bars 5-6   Montage 240 - 360   nails, lashes, brows, "Chez OYA MUSE"
//   bars 7-9   How     360 - 540   three steps, build into the last drop
//   bars 10-12 CTA     540 - 720   second drop, two-sided invite, record stop
export const SCENES = {
  hook: { duration: 132, overlap: 12 },
  reveal: { duration: 130, overlap: 10 },
  montage: { duration: 130, overlap: 10 },
  how: { duration: 192, overlap: 12 },
  cta: { duration: 180, overlap: 0 },
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
  montage,
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
          durationInFrames={SCENES.montage.duration}
          name="Montage"
        >
          <MontageScene montage={montage} partner={partner} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({
            durationInFrames: SCENES.montage.overlap,
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
