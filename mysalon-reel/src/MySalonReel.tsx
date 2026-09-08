import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { pushCut } from "@remotion/transitions/push-cut";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill, Easing } from "remotion";
import "./fonts";
import { CostScene } from "./scenes/CostScene";
import { HookScene } from "./scenes/HookScene";
import { OfferScene } from "./scenes/OfferScene";
import { ProductScene } from "./scenes/ProductScene";
import type { MySalonReelProps } from "./schema";

// Timeline (30 fps):
//   Hook 114 + Cost 72 + Product 296 + Offer 136 = 618 frames
//   minus push cut 6 and slide 12 = 600 frames (20 s)
// Keep `durationInFrames` in Root.tsx in sync when changing these values.
export const MySalonReel: React.FC<MySalonReelProps> = ({
  handle,
  hook,
  cost,
  brand,
  features,
  offer,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f3d3a" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={114} name="Hook">
          <HookScene hook={hook} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={pushCut({ flashOpacity: 0.25, flashColor: "#fff3f5" })}
          timing={linearTiming({ durationInFrames: 6 })}
        />
        <TransitionSeries.Sequence durationInFrames={72} name="Cost">
          <CostScene cost={cost} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence durationInFrames={296} name="Product">
          <ProductScene handle={handle} brand={brand} features={features} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({
            durationInFrames: 12,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}
        />
        <TransitionSeries.Sequence durationInFrames={136} name="Offer">
          <OfferScene offer={offer} handle={handle} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
