import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { pushCut } from "@remotion/transitions/push-cut";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useVideoConfig,
} from "remotion";
import "./fonts";
import { HookScene } from "./scenes/HookScene";
import { OutroScene } from "./scenes/OutroScene";
import { SetScene } from "./scenes/SetScene";
import type { NailReelProps } from "./schema";

// Timeline (30 fps):
//   Hook 66 + Set 90 + Set 90 + Set 90 + Outro 90 = 426 frames
//   minus 4 push cuts x 6 frames = 402 frames (~13.4 s)
// Keep `durationInFrames` in Root.tsx in sync when changing these values.
export const NailReel: React.FC<NailReelProps> = ({
  handle,
  hook,
  sets,
  outro,
  musicFile,
}) => {
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0709" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={66} name="Hook">
          <HookScene hook={hook} set={sets[0]} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={pushCut({ flashOpacity: 0.3, flashColor: "#fff3f5" })}
          timing={linearTiming({ durationInFrames: 6 })}
        />
        <TransitionSeries.Sequence durationInFrames={90} name="Set 01">
          <SetScene set={sets[0]} index={0} handle={handle} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={pushCut({ flashOpacity: 0.3, flashColor: "#fff3f5" })}
          timing={linearTiming({ durationInFrames: 6 })}
        />
        <TransitionSeries.Sequence durationInFrames={90} name="Set 02">
          <SetScene set={sets[1]} index={1} handle={handle} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={pushCut({ flashOpacity: 0.3, flashColor: "#fff3f5" })}
          timing={linearTiming({ durationInFrames: 6 })}
        />
        <TransitionSeries.Sequence durationInFrames={90} name="Set 03">
          <SetScene set={sets[2]} index={2} handle={handle} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={pushCut({ flashOpacity: 0.3, flashColor: "#fff3f5" })}
          timing={linearTiming({ durationInFrames: 6 })}
        />
        <TransitionSeries.Sequence durationInFrames={90} name="Outro">
          <OutroScene sets={sets} outro={outro} handle={handle} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      {musicFile ? (
        <Audio
          name="Music"
          src={staticFile(musicFile)}
          volume={(frame) =>
            interpolate(
              frame,
              [0, 12, durationInFrames - 36, durationInFrames - 1],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          }
        />
      ) : null}
    </AbsoluteFill>
  );
};
