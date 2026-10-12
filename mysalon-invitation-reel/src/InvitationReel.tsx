import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Logo } from "./components/Brand";
import { CaptionBlock } from "./components/Captions";
import { Flash } from "./components/Overlays";
import { Sfx, SoundContext } from "./components/Sfx";
import "./fonts";
import { SAFE } from "./layout";
import type { InvitationReelProps, Shot } from "./schema";
import { EndCard } from "./scenes/EndCard";
import { INK, MINT, WHITE } from "./theme";

export const FPS = 30;
// The end card fades in over the last frames of the last shot.
const FADE = 8;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const shotLength = (shot: Shot) =>
  Math.round(((shot.to - shot.from) / shot.rate) * FPS);

// Where every shot and the end card start, in frames of the reel.
export const timeline = (props: InvitationReelProps) => {
  const lengths = props.shots.map(shotLength);
  const starts: number[] = [];
  let t = 0;
  for (const length of lengths) {
    starts.push(t);
    t += length;
  }
  const endStart = t - FADE;
  return { lengths, starts, endStart, total: endStart + props.end.duration };
};

const Wordmark: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: SAFE.top + 6,
      display: "flex",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        padding: "10px 24px",
        borderRadius: 999,
        backgroundColor: "rgba(10,40,38,0.45)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Logo size={30} color={WHITE} accent={MINT} starColor={MINT} />
    </div>
  </div>
);

// One shot of the ad video, slowed down, with its captions and sounds.
const ShotView: React.FC<{
  readonly shot: Shot;
  readonly length: number;
  readonly video: string;
  readonly wordmark: boolean;
}> = ({ shot, length, video, wordmark }) => {
  const frame = useCurrentFrame();
  const punch = interpolate(frame, [0, 14], [1.06, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill name={`Shot ${shot.id}`} style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(punch) }}>
        <OffthreadVideo
          src={staticFile(video)}
          trimBefore={Math.round(shot.from * FPS)}
          playbackRate={shot.rate}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      {wordmark ? <Wordmark /> : null}
      {shot.captions.map((caption, i) => (
        <CaptionBlock
          key={caption.lines.join("|")}
          caption={caption}
          shotLength={length}
          name={`${shot.id} caption ${i + 1}`}
        />
      ))}
      {shot.captions.map((caption) => (
        <Sfx
          key={`pop-${caption.at}`}
          name="pop"
          at={caption.at}
          volume={0.55}
        />
      ))}
      {shot.sounds.map((sound) => (
        <Sfx
          key={`${sound.name}-${sound.at}`}
          name={sound.name}
          at={sound.at}
          volume={sound.volume}
        />
      ))}
      {shot.flash ? (
        <>
          <Flash at={0} peak={0.3} />
          <Sfx name="whoosh" at={0} volume={0.55} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// 17 seconds: the ad video's shots, each slowed down and captioned for salon
// owners, then the end card. See Root.tsx for the shots.
export const InvitationReel: React.FC<InvitationReelProps> = (props) => {
  const { lengths, starts, endStart } = timeline(props);

  return (
    <SoundContext.Provider value={props.sfx}>
      <AbsoluteFill style={{ backgroundColor: INK }}>
        {props.shots.map((shot, i) => (
          <Sequence
            key={shot.id}
            from={starts[i]}
            durationInFrames={lengths[i]}
            name={shot.id}
          >
            <ShotView
              shot={shot}
              length={lengths[i]}
              video={props.video}
              wordmark={props.wordmarkFrom !== null && i >= props.wordmarkFrom}
            />
          </Sequence>
        ))}
        <Sequence
          from={endStart}
          durationInFrames={props.end.duration}
          name="End card"
        >
          <EndCard end={props.end} fadeIn={FADE} />
        </Sequence>
      </AbsoluteFill>
    </SoundContext.Provider>
  );
};
