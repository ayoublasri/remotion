import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { CaptionBlock } from "./components/Captions";
import { Counter } from "./components/Counter";
import { Flash } from "./components/Overlays";
import { Sfx, SoundContext } from "./components/Sfx";
import { StoryChips } from "./components/StoryChip";
import "./fonts";
import type { InvitationReelProps, Scene, ShotScene } from "./schema";
import { EndCard } from "./scenes/EndCard";
import { MessagesSceneView } from "./scenes/MessagesScene";
import { NotificationSceneView } from "./scenes/NotificationScene";
import { INK } from "./theme";

export const FPS = 30;
// The end card fades in over the last frames of the scene before it.
const FADE = 8;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const sceneLength = (scene: Scene) =>
  scene.kind === "shot"
    ? scene.keys[scene.keys.length - 1].frame
    : scene.duration;

// Where every scene starts, in frames of the reel.
export const timeline = (props: InvitationReelProps) => {
  const lengths = props.scenes.map(sceneLength);
  const starts: number[] = [];
  let t = 0;
  props.scenes.forEach((scene, i) => {
    if (scene.kind === "end") {
      t -= FADE;
    }
    starts.push(t);
    t += lengths[i];
  });
  return { lengths, starts, total: t };
};

// A shot of the ad video between its keyframes (slowed down, held on a
// frame where the story needs time), with a punch-in on the cut.
const ShotView: React.FC<{
  readonly scene: ShotScene;
  readonly length: number;
  readonly video: string;
}> = ({ scene, length, video }) => {
  const frame = useCurrentFrame();
  const punch = interpolate(frame, [0, 14], [1.06, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(punch) }}>
        {scene.keys.slice(0, -1).map((key, i) => {
          const next = scene.keys[i + 1];
          const frames = next.frame - key.frame;
          // A hold (same second) keeps the frame; the rate must stay positive.
          const rate = Math.max(
            0.001,
            ((next.second - key.second) * FPS) / frames,
          );
          return (
            <Sequence
              key={key.frame}
              from={key.frame}
              durationInFrames={frames}
              layout="none"
            >
              <OffthreadVideo
                src={staticFile(video)}
                trimBefore={Math.round(key.second * FPS)}
                playbackRate={rate}
                muted
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Sequence>
          );
        })}
      </AbsoluteFill>
      {scene.counter ? (
        <Counter
          label={scene.counter.label}
          to={scene.counter.to}
          at={scene.counter.at}
          end={length}
        />
      ) : null}
      {scene.flash ? (
        <>
          <Flash at={0} peak={0.3} />
          <Sfx name="whoosh" at={0} volume={0.55} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// Captions, day chips and sounds shared by every kind of scene.
const SceneOverlay: React.FC<{
  readonly scene: Scene;
  readonly length: number;
}> = ({ scene, length }) => (
  <>
    <StoryChips chips={scene.chips} />
    {scene.captions.map((caption, i) => (
      <CaptionBlock
        key={caption.lines.join("|")}
        caption={caption}
        shotLength={length}
        name={`${scene.id} caption ${i + 1}`}
      />
    ))}
    {scene.captions.map((caption) => (
      <Sfx key={`pop-${caption.at}`} name="pop" at={caption.at} volume={0.55} />
    ))}
    {scene.sounds.map((sound) => (
      <Sfx
        key={`${sound.name}-${sound.at}`}
        name={sound.name}
        at={sound.at}
        volume={sound.volume}
      />
    ))}
  </>
);

const SceneView: React.FC<{
  readonly scene: Scene;
  readonly length: number;
  readonly video: string;
}> = ({ scene, length, video }) => {
  switch (scene.kind) {
    case "shot":
      return <ShotView scene={scene} length={length} video={video} />;
    case "messages":
      return <MessagesSceneView scene={scene} />;
    case "notification":
      return <NotificationSceneView scene={scene} />;
    case "end":
      return <EndCard scene={scene} fadeIn={FADE} />;
  }
};

// Thirty seconds, told as a story: Sara, nail artist in Témara, her Monday
// night of DMs, MySalon installed on Tuesday, Nada booking by herself on
// Thursday, the agenda filling, the reminder going out alone, and a month
// later. The scenes are props, see Root.tsx.
export const InvitationReel: React.FC<InvitationReelProps> = (props) => {
  const { lengths, starts } = timeline(props);

  return (
    <SoundContext.Provider value={props.sfx}>
      <AbsoluteFill style={{ backgroundColor: INK }}>
        {props.scenes.map((scene, i) => (
          <Sequence
            key={scene.id}
            from={starts[i]}
            durationInFrames={lengths[i]}
            name={scene.id}
          >
            <SceneView scene={scene} length={lengths[i]} video={props.video} />
            <SceneOverlay scene={scene} length={lengths[i]} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </SoundContext.Provider>
  );
};
