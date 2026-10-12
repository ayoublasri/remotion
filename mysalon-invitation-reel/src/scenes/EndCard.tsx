import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Logo, StarMark } from "../components/Brand";
import { MoroccanFlag } from "../components/Flag";
import { SendIcon } from "../components/Icons";
import { Flash } from "../components/Overlays";
import { Sfx } from "../components/Sfx";
import { SANS } from "../fonts";
import { SAFE } from "../layout";
import type { EndScene } from "../schema";
import { BEIGE, BEIGE_DEEP, INK, MUTED, TEAL, WHITE } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const rise = (frame: number, at: number) => ({
  opacity: interpolate(frame, [at, at + 6], [0, 1], clamp),
  translate: interpolate(frame, [at, at + 14], ["0px 30px", "0px 0px"], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  }),
});

const parse = (line: string) =>
  line
    .split("*")
    .map((part, i) => ({ text: part, highlight: i % 2 === 1 }))
    .filter((p) => p.text.length > 0);

// A month later: the result of the story in big ink lines, then the brand,
// made in Morocco, the perks and the one thing to do: DM « INVITATION ».
export const EndCard: React.FC<{
  readonly scene: EndScene;
  readonly fadeIn: number;
}> = ({ scene, fadeIn }) => {
  const frame = useCurrentFrame();
  const b = scene.brandAt;
  const AT = {
    kicker: b,
    logo: b + 4,
    madeIn: b + 14,
    perks: b + 20,
    lead: b + 32,
    cta: b + 42,
    site: b + 56,
  };
  const pulse = interpolate(
    (frame - AT.cta) % 40,
    [0, 4, 24],
    [1.04, 1.02, 1],
    clamp,
  );

  return (
    <AbsoluteFill
      name="End card"
      style={{
        background: `radial-gradient(70% 45% at 50% 40%, ${WHITE} 0%, ${BEIGE} 55%, ${BEIGE_DEEP} 100%)`,
        overflow: "hidden",
        opacity: interpolate(frame, [0, fadeIn], [0, 1], clamp),
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -360,
          top: -300,
          opacity: 0.05,
          rotate: `${frame * 0.1}deg`,
        }}
      >
        <StarMark size={1100} color={TEAL} />
      </div>
      <Sfx name="sparkle" at={AT.logo} volume={0.7} />
      <Sfx name="pop" at={AT.cta} volume={0.8} />
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          right: 1080 - SAFE.right,
          top: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {scene.result.map((line, i) => (
          <Interactive.Div
            key={line}
            name={`Result line ${i + 1}`}
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 60,
              lineHeight: 1.25,
              color: INK,
              whiteSpace: "nowrap",
              ...rise(frame, fadeIn + 4 + i * 12),
            }}
          >
            {parse(line).map((part, j) => (
              <span
                key={`${part.text}-${j}`}
                style={{ color: part.highlight ? TEAL : INK }}
              >
                {part.text}
              </span>
            ))}
          </Interactive.Div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          right: 1080 - SAFE.right,
          top: 660,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="End kicker"
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: "0.3em",
            marginRight: "-0.3em",
            color: TEAL,
            ...rise(frame, AT.kicker),
          }}
        >
          {scene.kicker}
        </Interactive.Div>
        <div
          style={{
            marginTop: 20,
            scale: interpolate(frame, [AT.logo, AT.logo + 16], [0.6, 1], {
              ...clamp,
              easing: Easing.out(Easing.back(1.4)),
            }),
            opacity: interpolate(frame, [AT.logo, AT.logo + 5], [0, 1], clamp),
          }}
        >
          <Logo size={92} color={INK} accent={TEAL} starColor={TEAL} />
        </div>
        <Interactive.Div
          name="End made in"
          style={{
            marginTop: 36,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 18,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 42,
            color: INK,
            ...rise(frame, AT.madeIn),
          }}
        >
          {scene.madeIn}
          <MoroccanFlag height={42} />
        </Interactive.Div>
        <Interactive.Div
          name="End perks"
          style={{
            marginTop: 10,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 30,
            color: MUTED,
            ...rise(frame, AT.perks),
          }}
        >
          {scene.perks}
        </Interactive.Div>
        <Interactive.Div
          name="End lead"
          style={{
            marginTop: 56,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 32,
            color: INK,
            ...rise(frame, AT.lead),
          }}
        >
          {scene.lead}
        </Interactive.Div>
        <div
          style={{
            marginTop: 18,
            scale: String(
              interpolate(frame, [AT.cta, AT.cta + 14], [0, 1], {
                ...clamp,
                easing: Easing.out(Easing.back(1.6)),
              }) * (frame > AT.cta + 14 ? pulse : 1),
            ),
          }}
        >
          <Interactive.Div
            name="End CTA"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 18,
              padding: "0 46px",
              height: 112,
              borderRadius: 56,
              backgroundColor: TEAL,
              color: WHITE,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 44,
              whiteSpace: "nowrap",
              boxShadow: "0 24px 50px rgba(15,92,87,0.35)",
            }}
          >
            <SendIcon size={42} color={WHITE} />
            {scene.cta}
          </Interactive.Div>
        </div>
        <Interactive.Div
          name="End site"
          style={{
            marginTop: 24,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: "0.06em",
            color: TEAL,
            ...rise(frame, AT.site),
          }}
        >
          {scene.site}
        </Interactive.Div>
      </div>
      <Flash at={fadeIn} peak={0.35} />
    </AbsoluteFill>
  );
};
