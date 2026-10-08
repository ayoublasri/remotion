import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { GiftCard } from "../components/GiftCard";
import { StarPattern } from "../components/Pattern";
import { Phone, PHONE_WIDTH } from "../components/Phone";
import { DmScreen } from "../components/screens/DmScreen";
import { LockScreen } from "../components/screens/LockScreen";
import { Sfx } from "../components/Sfx";
import { DISPLAY, SANS, SERIF } from "../fonts";
import { SAFE } from "../layout";
import type { GiftCardContent, GiftReelProps, Partner } from "../schema";
import { BAR } from "../timing";
import { EMERALD_DEEP, GOLD, LIGHT_BG, MUTED } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Four seconds per step, nothing rushed.
const STEP_AT = [0, BAR * 2];
// The phone is drawn at 500 x 1000 and shown smaller, inside the safe area.
const PHONE_SCALE = 0.88;
const PHONE_LEFT = (1080 - PHONE_WIDTH) / 2;
const PHONE_TOP = 540;

const T = {
  keyword: 6,
  reply: 26,
  pick: 58,
  pay: 86,
  sent: 102,
  swap: STEP_AT[1],
  notif: STEP_AT[1] + 10,
  pulse: STEP_AT[1] + 28,
  card: STEP_AT[1] + 56,
};

const Caption: React.FC<{
  readonly index: number;
  readonly title: string;
  readonly subtitle: string;
}> = ({ index, title, subtitle }) => {
  const frame = useCurrentFrame();
  const at = STEP_AT[index];
  const out = STEP_AT[index + 1] ?? 100000;

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        right: 1080 - SAFE.right,
        top: SAFE.top + 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        opacity: interpolate(
          frame,
          [at, at + 6, out - 2, out + 3],
          [0, 1, 1, 0],
          clamp,
        ),
        translate: interpolate(
          frame,
          [at, at + 14, out - 2, out + 5],
          ["0px 40px", "0px 0px", "0px 0px", "0px -40px"],
          {
            ...clamp,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          },
        ),
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: 34,
            flexShrink: 0,
            backgroundColor: EMERALD_DEEP,
            color: GOLD,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 36,
            paddingTop: 4,
            boxSizing: "border-box",
            boxShadow:
              "0 10px 24px rgba(8,34,28,0.25), inset 0 0 0 2px rgba(201,169,110,0.7)",
            scale: interpolate(frame, [at, at + 12], [0.4, 1], {
              ...clamp,
              easing: Easing.out(Easing.back(2)),
            }),
          }}
        >
          {index + 1}
        </div>
        <Interactive.Div
          name={`Step ${index + 1} title`}
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 56,
            lineHeight: 1.08,
            color: EMERALD_DEEP,
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Interactive.Div>
      </div>
      <Interactive.Div
        name={`Step ${index + 1} subtitle`}
        style={{
          marginTop: 12,
          maxWidth: 760,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 32,
          lineHeight: 1.25,
          color: MUTED,
          whiteSpace: "pre-line",
        }}
      >
        {subtitle}
      </Interactive.Div>
    </div>
  );
};

const Tag: React.FC<{
  readonly text: string;
  readonly bg: string;
  readonly fg: string;
}> = ({ text, bg, fg }) => (
  <div
    style={{
      position: "absolute",
      left: PHONE_WIDTH / 2,
      top: -62,
      translate: "-50% 0px",
      padding: "8px 26px",
      borderRadius: 999,
      backgroundColor: bg,
      color: fg,
      fontFamily: DISPLAY,
      fontWeight: 700,
      fontSize: 26,
      letterSpacing: "0.18em",
      whiteSpace: "nowrap",
      boxShadow: "0 10px 24px rgba(8,34,28,0.2)",
    }}
  >
    {text}
  </div>
);

// Scene 4: how it works, in two four-second steps on two phones. You write
// the keyword, pick the treatment and pay in the chat; she receives her
// digital gift card and books when she likes.
export const HowScene: React.FC<{
  readonly how: GiftReelProps["how"];
  readonly card: GiftCardContent;
  readonly partner: Partner;
}> = ({ how, card, partner }) => {
  const frame = useCurrentFrame();
  const swap = interpolate(frame, [T.swap, T.swap + 14], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

  return (
    <AbsoluteFill
      name="How scene"
      style={{ background: LIGHT_BG, overflow: "hidden" }}
    >
      <StarPattern id="how-pattern" color={GOLD} opacity={0.08} size={120} />
      <Sfx name="pop" at={T.keyword} volume={0.45} />
      <Sfx name="pop" at={T.reply} volume={0.35} />
      <Sfx name="tick" at={T.pick} volume={0.5} />
      <Sfx name="tick" at={T.pay} volume={0.55} />
      <Sfx name="success" at={T.sent} volume={0.3} />
      <Sfx name="whoosh" at={T.swap} volume={0.4} />
      <Sfx name="ding" at={T.notif} volume={0.55} />
      <Sfx name="sparkle" at={T.card} volume={0.35} />
      {how.steps.map((s, i) => (
        <Caption
          key={s.title}
          index={i}
          title={s.title}
          subtitle={s.subtitle}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: PHONE_LEFT,
          top: PHONE_TOP,
          translate: `${-1150 * swap}px 0px`,
          rotate: `${-8 * swap}deg`,
          opacity: swap < 1 ? 1 : 0,
          transformOrigin: "50% 0%",
          scale: String(
            PHONE_SCALE *
              interpolate(frame, [0, 10], [0.92, 1], {
                ...clamp,
                easing: Easing.out(Easing.cubic),
              }),
          ),
        }}
      >
        <Tag text={how.senderTag} bg={EMERALD_DEEP} fg={GOLD} />
        <Phone
          frameColor="#1c1c1a"
          edgeColor="#3a3a36"
          statusColor="#1d211f"
          time={how.lockTime}
        >
          <DmScreen
            keyword={how.dmKeyword}
            reply={how.dmReply}
            salonLine={`${partner.name} · ${partner.city}`}
            salonLogo={partner.logo}
            options={how.options}
            pickIndex={how.pickIndex}
            payLabel={how.payLabel}
            paidLabel={how.paidLabel}
            sent={how.dmSent}
            keywordAt={T.keyword}
            replyAt={T.reply}
            pickAt={T.pick}
            payAt={T.pay}
            sentAt={T.sent}
          />
        </Phone>
      </div>
      {frame >= T.swap ? (
        <div
          style={{
            position: "absolute",
            left: PHONE_LEFT,
            top: PHONE_TOP,
            translate: `${900 * (1 - swap)}px 0px`,
            rotate: `${8 * (1 - swap)}deg`,
            transformOrigin: "50% 0%",
            scale: String(PHONE_SCALE),
          }}
        >
          <Tag text={how.recipientTag} bg={GOLD} fg={EMERALD_DEEP} />
          <Phone
            frameColor="#d8c49a"
            edgeColor="#b59c66"
            statusColor="#ffffff"
            time={how.lockTime}
          >
            <LockScreen
              wallpaper={how.wallpaper}
              time={how.lockTime}
              date={how.lockDate}
              title={how.notifTitle}
              body={how.notifBody}
              code={how.code}
              notifAt={T.notif}
              pulseAt={T.pulse}
              cardAt={T.card}
            >
              <div style={{ scale: "0.64", transformOrigin: "0% 0%" }}>
                <GiftCard
                  id="phone-card"
                  content={card}
                  partner={partner}
                  recipients={[how.recipient]}
                  writeAt={T.card + 14}
                  writeEvery={1000}
                  shineAt={T.card + 30}
                  recipientSize={64}
                />
              </div>
            </LockScreen>
          </Phone>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
