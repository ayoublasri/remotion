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
import type { InvitationReelProps } from "../schema";
import { BEIGE, BEIGE_DEEP, INK, MUTED, TEAL, WHITE } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const AT = {
  logo: 4,
  kicker: 10,
  madeIn: 18,
  perks: 26,
  lead: 40,
  cta: 50,
  site: 64,
};

const rise = (frame: number, at: number) => ({
  opacity: interpolate(frame, [at, at + 6], [0, 1], clamp),
  translate: interpolate(frame, [at, at + 14], ["0px 30px", "0px 0px"], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  }),
});

// The end card, rebuilt crisp: MySalon.ma, made in Morocco, the perks and the
// one thing to do: DM « INVITATION ».
export const EndCard: React.FC<{
  readonly end: InvitationReelProps["end"];
  readonly fadeIn: number;
}> = ({ end, fadeIn }) => {
  const frame = useCurrentFrame();
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
        background: `radial-gradient(70% 45% at 50% 42%, ${WHITE} 0%, ${BEIGE} 55%, ${BEIGE_DEEP} 100%)`,
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
          top: 560,
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
          {end.kicker}
        </Interactive.Div>
        <div
          style={{
            marginTop: 22,
            scale: interpolate(frame, [AT.logo, AT.logo + 16], [0.6, 1], {
              ...clamp,
              easing: Easing.out(Easing.back(1.4)),
            }),
            opacity: interpolate(frame, [AT.logo, AT.logo + 5], [0, 1], clamp),
          }}
        >
          <Logo size={96} color={INK} accent={TEAL} starColor={TEAL} />
        </div>
        <Interactive.Div
          name="End made in"
          style={{
            marginTop: 44,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 18,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 44,
            color: INK,
            ...rise(frame, AT.madeIn),
          }}
        >
          {end.madeIn}
          <MoroccanFlag height={44} />
        </Interactive.Div>
        <Interactive.Div
          name="End perks"
          style={{
            marginTop: 12,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 32,
            color: MUTED,
            ...rise(frame, AT.perks),
          }}
        >
          {end.perks}
        </Interactive.Div>
        <Interactive.Div
          name="End lead"
          style={{
            marginTop: 70,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 32,
            color: INK,
            ...rise(frame, AT.lead),
          }}
        >
          {end.lead}
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
            {end.cta}
          </Interactive.Div>
        </div>
        <Interactive.Div
          name="End site"
          style={{
            marginTop: 26,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: "0.06em",
            color: TEAL,
            ...rise(frame, AT.site),
          }}
        >
          {end.site}
        </Interactive.Div>
      </div>
      <Flash at={fadeIn} peak={0.35} />
    </AbsoluteFill>
  );
};
