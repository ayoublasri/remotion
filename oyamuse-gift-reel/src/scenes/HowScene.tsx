import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Phone, PHONE_WIDTH } from "../components/Phone";
import { StarPattern } from "../components/Pattern";
import { BookingScreen } from "../components/screens/BookingScreen";
import { DmScreen } from "../components/screens/DmScreen";
import { LockScreen } from "../components/screens/LockScreen";
import { Sfx } from "../components/Sfx";
import { DISPLAY, SANS, SERIF } from "../fonts";
import type { GiftReelProps } from "../schema";
import { BEAT } from "../timing";
import {
  CREAM,
  CREAM_DEEP,
  GOLD,
  GOLD_DEEP,
  GREEN,
  GREEN_DEEP,
  MUTED,
} from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Step starts (scene-local frames), five beats apart, then a longer last step.
const STEP_AT = [0, BEAT * 5, BEAT * 10];
const PHONE_LEFT = (1080 - PHONE_WIDTH) / 2;
const PHONE_TOP = 450;

// Timeline of the two phones.
const T = {
  request: 8,
  reply: 30,
  tap: 46,
  sent: 58,
  swap: STEP_AT[1],
  notif: STEP_AT[1] + 22,
  pulse: STEP_AT[1] + 40,
  book: STEP_AT[2],
  typeFrom: STEP_AT[2] + 18,
  typeTo: STEP_AT[2] + 32,
  slot: STEP_AT[2] + 44,
  confirm: STEP_AT[2] + 58,
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
        left: 50,
        right: 50,
        top: 196,
        textAlign: "center",
        opacity: interpolate(
          frame,
          [at, at + 8, out - 2, out + 4],
          [0, 1, 1, 0],
          clamp,
        ),
        translate: interpolate(
          frame,
          [at, at + 16, out - 2, out + 6],
          ["0px 36px", "0px 0px", "0px 0px", "0px -36px"],
          {
            ...clamp,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          },
        ),
      }}
    >
      <Interactive.Div
        name={`Step ${index + 1} title`}
        style={{
          fontFamily: SERIF,
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 66,
          lineHeight: 1.1,
          color: GREEN_DEEP,
        }}
      >
        {title}
      </Interactive.Div>
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

const Tag: React.FC<{ readonly text: string; readonly dark: boolean }> = ({
  text,
  dark,
}) => (
  <div
    style={{
      position: "absolute",
      left: PHONE_WIDTH / 2,
      top: -62,
      translate: "-50% 0px",
      padding: "10px 26px",
      borderRadius: 999,
      backgroundColor: dark ? GREEN_DEEP : GOLD,
      color: dark ? GOLD : GREEN_DEEP,
      fontFamily: DISPLAY,
      fontWeight: 700,
      fontSize: 24,
      letterSpacing: "0.18em",
      whiteSpace: "nowrap",
      boxShadow: "0 10px 24px rgba(15,44,34,0.2)",
    }}
  >
    {text}
  </div>
);

// Bars 10-13: how it works, on two phones. You write to MySalon.ma and pay,
// the person you chose gets a code, then books with it on mysalon.ma.
export const HowScene: React.FC<{
  readonly how: GiftReelProps["how"];
  readonly logo: string;
  readonly site: string;
}> = ({ how, logo, site }) => {
  const frame = useCurrentFrame();
  const swap = interpolate(frame, [T.swap, T.swap + 18], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const step = frame >= STEP_AT[2] ? 2 : frame >= STEP_AT[1] ? 1 : 0;

  return (
    <AbsoluteFill
      name="How scene"
      style={{
        background: `radial-gradient(85% 60% at 50% 45%, ${CREAM} 0%, ${CREAM} 40%, ${CREAM_DEEP} 100%)`,
        overflow: "hidden",
      }}
    >
      <StarPattern id="how-pattern" color={GOLD} opacity={0.07} size={120} />
      <Sfx name="pop" at={T.request} volume={0.4} />
      <Sfx name="pop" at={T.reply} volume={0.4} />
      <Sfx name="tick" at={T.tap} volume={0.55} />
      <Sfx name="success" at={T.sent} volume={0.35} />
      <Sfx name="whoosh" at={T.swap} volume={0.45} />
      <Sfx name="ding" at={T.notif} volume={0.55} />
      <Sfx name="sparkle" at={T.pulse} volume={0.3} />
      <Sfx name="whoosh" at={T.book} volume={0.4} />
      <Sfx name="tick" at={T.typeTo + 2} volume={0.5} />
      <Sfx name="tick" at={T.slot} volume={0.5} />
      <Sfx name="tick" at={T.confirm} volume={0.5} />
      <Sfx name="success" at={T.confirm + 4} volume={0.55} />
      <Interactive.Div
        name="How label"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 136,
          textAlign: "center",
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: "0.3em",
          marginRight: "-0.3em",
          color: GOLD_DEEP,
        }}
      >
        {how.label}
      </Interactive.Div>
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
          opacity: swap < 1 ? 1 : 0,
          rotate: `${-8 * swap}deg`,
        }}
      >
        <Tag text={how.senderTag} dark />
        <Phone
          frameColor="#1c1c1a"
          edgeColor="#3a3a36"
          statusColor="#1f1f1a"
          time="10:24"
        >
          <DmScreen
            request={how.dmRequest}
            reply={how.dmReply}
            giftLabel={how.giftLabel}
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
          <Tag text={how.recipientTag} dark={false} />
          <Phone
            frameColor="#d8c49a"
            edgeColor="#b59c66"
            statusColor={frame >= T.book + 8 ? "#1f1f1a" : "#ffffff"}
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
                logo={logo}
                site={site}
                code={how.code}
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
          top: PHONE_TOP + 1000 + 44,
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
              backgroundColor: i === step ? GREEN : "rgba(31,75,60,0.22)",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
