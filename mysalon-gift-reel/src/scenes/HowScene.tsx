import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { StarPattern } from "../components/Pattern";
import { Phone, PHONE_WIDTH } from "../components/Phone";
import { BookingScreen } from "../components/screens/BookingScreen";
import { DmScreen } from "../components/screens/DmScreen";
import { LockScreen } from "../components/screens/LockScreen";
import { Sfx } from "../components/Sfx";
import { DISPLAY, SANS, SERIF } from "../fonts";
import type { GiftReelProps, Partner } from "../schema";
import { BAR } from "../timing";
import { EMERALD, EMERALD_DEEP, GOLD, LIGHT_BG, MUTED } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// One bar per step: two seconds each.
const STEP_AT = [0, BAR, BAR * 2];
const PHONE_LEFT = (1080 - PHONE_WIDTH) / 2;
const PHONE_TOP = 470;

const T = {
  request: 4,
  reply: 20,
  tap: 34,
  sent: 44,
  swap: STEP_AT[1],
  notif: STEP_AT[1] + 10,
  pulse: STEP_AT[1] + 26,
  book: STEP_AT[2],
  typeFrom: STEP_AT[2] + 10,
  typeTo: STEP_AT[2] + 20,
  slot: STEP_AT[2] + 28,
  confirm: STEP_AT[2] + 38,
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
        left: 40,
        right: 40,
        top: 210,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        opacity: interpolate(
          frame,
          [at, at + 5, out - 2, out + 3],
          [0, 1, 1, 0],
          clamp,
        ),
        translate: interpolate(
          frame,
          [at, at + 12, out - 2, out + 5],
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
            width: 74,
            height: 74,
            borderRadius: 37,
            flexShrink: 0,
            backgroundColor: EMERALD_DEEP,
            color: GOLD,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 40,
            paddingTop: 4,
            boxSizing: "border-box",
            boxShadow:
              "0 10px 24px rgba(8,34,28,0.25), inset 0 0 0 2px rgba(201,169,110,0.7)",
            scale: interpolate(frame, [at, at + 10], [0.4, 1], {
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
            fontSize: 64,
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
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 34,
          lineHeight: 1.25,
          color: MUTED,
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
      top: -58,
      translate: "-50% 0px",
      padding: "8px 26px",
      borderRadius: 999,
      backgroundColor: bg,
      color: fg,
      fontFamily: DISPLAY,
      fontWeight: 700,
      fontSize: 24,
      letterSpacing: "0.18em",
      whiteSpace: "nowrap",
      boxShadow: "0 10px 24px rgba(8,34,28,0.2)",
    }}
  >
    {text}
  </div>
);

// Bars 7-9: how it works in three two-second steps, on two phones. You send
// the keyword by DM and pay, she gets her code, she books when she likes.
export const HowScene: React.FC<{
  readonly how: GiftReelProps["how"];
  readonly partner: Partner;
  readonly site: string;
}> = ({ how, partner, site }) => {
  const frame = useCurrentFrame();
  const swap = interpolate(frame, [T.swap, T.swap + 12], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const step = frame >= STEP_AT[2] ? 2 : frame >= STEP_AT[1] ? 1 : 0;

  return (
    <AbsoluteFill
      name="How scene"
      style={{ background: LIGHT_BG, overflow: "hidden" }}
    >
      <StarPattern id="how-pattern" color={GOLD} opacity={0.08} size={120} />
      <Sfx name="pop" at={T.request} volume={0.45} />
      <Sfx name="pop" at={T.reply} volume={0.35} />
      <Sfx name="tick" at={T.tap} volume={0.55} />
      <Sfx name="success" at={T.sent} volume={0.3} />
      <Sfx name="whoosh" at={T.swap} volume={0.4} />
      <Sfx name="ding" at={T.notif} volume={0.55} />
      <Sfx name="whoosh" at={T.book} volume={0.35} />
      <Sfx name="tick" at={T.typeTo + 2} volume={0.45} />
      <Sfx name="tick" at={T.slot} volume={0.45} />
      <Sfx name="success" at={T.confirm + 4} volume={0.5} />
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
          scale: String(
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
            request={how.dmKeyword}
            reply={how.dmReply}
            giftLabel={how.giftLabel}
            giftDetail={how.giftDetail}
            payLabel={how.payLabel}
            paidLabel={how.paidLabel}
            sent={how.dmSent}
            requestAt={T.request}
            replyAt={T.reply}
            tapAt={T.tap}
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
          }}
        >
          <Tag text={how.recipientTag} bg={GOLD} fg={EMERALD_DEEP} />
          <Phone
            frameColor="#d8c49a"
            edgeColor="#b59c66"
            statusColor={frame >= T.book + 8 ? "#1d211f" : "#ffffff"}
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
            />
            {frame >= T.book ? (
              <BookingScreen
                partnerLogo={partner.logo}
                partnerName={partner.name}
                partnerInfo={`${partner.city} · ${partner.services}`}
                site={site}
                code={how.code}
                validLabel={how.validLabel}
                dates={how.dates}
                slots={how.slots}
                slotIndex={how.slotIndex}
                confirmTitle={how.confirmTitle}
                confirmDetail={how.confirmDetail}
                enterAt={T.book}
                typeFrom={T.typeFrom}
                typeTo={T.typeTo}
                slotAt={T.slot}
                confirmAt={T.confirm}
              />
            ) : null}
          </Phone>
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: PHONE_TOP + 1000 + 40,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: 16,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: i === step ? 54 : 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: i === step ? EMERALD : "rgba(26,74,64,0.2)",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
