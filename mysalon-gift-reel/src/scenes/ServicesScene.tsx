import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { LogoBadge } from "../components/Logo";
import { Flash } from "../components/Overlays";
import { Sfx } from "../components/Sfx";
import { DISPLAY, SANS, SERIF } from "../fonts";
import { SAFE, SAFE_WIDTH } from "../layout";
import type { GiftReelProps, Partner, Service } from "../schema";
import { BAR } from "../timing";
import { EMERALD_INK, GOLD, GOLD_LIGHT, IVORY } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Four seconds per treatment; with two photos, each gets two seconds.
export const SERVICE = BAR * 2;

// The framed photo fills the safe width and stops above the icon band.
const FRAME_WIDTH = SAFE_WIDTH;
const FRAME_HEIGHT = 490;
const FRAME_TOP = 560;

// One photo, held: full-bleed with a slow push-in, or, for small photos, a
// framed card over a blurred fill of the same photo.
const Photo: React.FC<{
  readonly service: Service;
  readonly index: number;
  readonly at: number;
  readonly length: number;
}> = ({ service, index, at, length }) => {
  const frame = useCurrentFrame();
  const local = frame - at;
  const photo = service.photos[index];
  const src = staticFile(`images/${photo.image}`);
  const position = `${photo.focusX}% ${photo.focusY}%`;
  const push = interpolate(local, [0, length], [1, 1.07], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });

  if (!service.framed) {
    return (
      <Img
        src={src}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          scale: String(push),
        }}
      />
    );
  }

  const enter = interpolate(local, [0, 16], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <>
      <Img
        src={src}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          filter: "blur(40px)",
          scale: "1.4",
        }}
      />
      <AbsoluteFill style={{ backgroundColor: "rgba(8,34,28,0.5)" }} />
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: FRAME_TOP,
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT,
          borderRadius: 32,
          overflow: "hidden",
          boxShadow:
            "0 50px 110px rgba(0,0,0,0.5), 0 0 0 5px rgba(246,232,198,0.92)",
          opacity: interpolate(local, [0, 5], [0, 1], clamp),
          transform: `perspective(1800px) rotateY(${(1 - enter) * 14}deg) scale(${0.92 + 0.08 * enter})`,
        }}
      >
        <Img
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: position,
            scale: String(push),
          }}
        />
      </div>
    </>
  );
};

// The salon's signature, small, at the top: the photo is the hero.
const Header: React.FC<{
  readonly partner: Partner;
  readonly subtitle: string;
}> = ({ partner, subtitle }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: SAFE.top,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          scale: String(
            interpolate(frame, [0, 14], [0.5, 1], {
              ...clamp,
              easing: Easing.out(Easing.back(1.5)),
            }),
          ),
        }}
      >
        <LogoBadge image={partner.logo} size={96} ring ringColor={GOLD} />
      </div>
      <Interactive.Div
        name="Services salon"
        style={{
          marginTop: 16,
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: 42,
          lineHeight: 1,
          letterSpacing: "0.14em",
          marginRight: "-0.14em",
          color: GOLD_LIGHT,
          textShadow: "0 6px 30px rgba(0,0,0,0.5)",
          opacity: interpolate(frame, [4, 10], [0, 1], clamp),
        }}
      >
        {partner.name}
      </Interactive.Div>
      <Interactive.Div
        name="Services subtitle"
        style={{
          marginTop: 10,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: "0.3em",
          marginRight: "-0.3em",
          color: IVORY,
          textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          opacity: interpolate(frame, [8, 14], [0, 0.9], clamp),
        }}
      >
        {subtitle}
      </Interactive.Div>
    </div>
  );
};

// The treatment, like a menu line: category, name, detail and price, set
// left and kept clear of the Instagram buttons and caption.
const Caption: React.FC<{
  readonly service: Service;
  readonly index: number;
  readonly at: number;
}> = ({ service, index, at }) => {
  const frame = useCurrentFrame();
  const rise = (delay: number) => ({
    opacity: interpolate(frame, [at + delay, at + delay + 6], [0, 1], clamp),
    translate: interpolate(
      frame,
      [at + delay, at + delay + 14],
      ["0px 30px", "0px 0px"],
      { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) },
    ),
  });
  const shadow = "0 6px 30px rgba(0,0,0,0.55)";

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        right: 1080 - SAFE.iconsRight,
        bottom: 1920 - SAFE.bottom,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
          ...rise(0),
        }}
      >
        <div style={{ width: 56, height: 2, backgroundColor: GOLD }} />
        <Interactive.Div
          name={`Service ${index + 1} kicker`}
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: "0.32em",
            color: GOLD_LIGHT,
            textShadow: shadow,
          }}
        >
          {`${String(index + 1).padStart(2, "0")} · ${service.kicker}`}
        </Interactive.Div>
      </div>
      <Interactive.Div
        name={`Service ${index + 1} name`}
        style={{
          marginTop: 16,
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: 72,
          lineHeight: 1,
          letterSpacing: "0.05em",
          color: IVORY,
          whiteSpace: "nowrap",
          textShadow: shadow,
          ...rise(3),
        }}
      >
        {service.name}
      </Interactive.Div>
      <Interactive.Div
        name={`Service ${index + 1} detail`}
        style={{
          marginTop: 12,
          fontFamily: SERIF,
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 44,
          color: GOLD_LIGHT,
          textShadow: shadow,
          ...rise(8),
        }}
      >
        {service.detail}
      </Interactive.Div>
      {service.price ? (
        <Interactive.Div
          name={`Service ${index + 1} price`}
          style={{
            marginTop: 20,
            padding: "9px 24px",
            borderRadius: 999,
            boxShadow: "inset 0 0 0 2px rgba(201,169,110,0.8)",
            backgroundColor: "rgba(8,34,28,0.35)",
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: "0.08em",
            color: GOLD_LIGHT,
            ...rise(14),
          }}
        >
          {service.price}
        </Interactive.Div>
      ) : null}
    </div>
  );
};

// Scene 3: the treatments to offer, four seconds each, the photo big and
// clear under the salon's name: ONGLES, CILS, SOURCILS.
export const ServicesScene: React.FC<{
  readonly services: GiftReelProps["services"];
  readonly partner: Partner;
}> = ({ services, partner }) => {
  const frame = useCurrentFrame();
  const index = Math.min(
    services.items.length - 1,
    Math.floor(frame / SERVICE),
  );
  const service = services.items[index];
  const at = index * SERVICE;
  const photoLength = SERVICE / service.photos.length;
  const photoIndex = Math.min(
    service.photos.length - 1,
    Math.floor((frame - at) / photoLength),
  );
  const starts = services.items.map((_, i) => i * SERVICE);
  const cuts = services.items.flatMap((s, i) =>
    s.photos.map((_, j) => i * SERVICE + (j * SERVICE) / s.photos.length),
  );

  return (
    <AbsoluteFill
      name="Services scene"
      style={{ backgroundColor: EMERALD_INK, overflow: "hidden" }}
    >
      <Photo
        service={service}
        index={photoIndex}
        at={at + photoIndex * photoLength}
        length={photoLength}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(8,34,28,0.72) 0%, rgba(8,34,28,0.3) 20%, rgba(8,34,28,0) 34%, rgba(8,34,28,0) 54%, rgba(8,34,28,0.66) 74%, rgba(8,34,28,0.9) 100%)",
        }}
      />
      <Header partner={partner} subtitle={services.subtitle} />
      <Caption service={service} index={index} at={at} />
      {cuts.map((t) =>
        starts.includes(t) ? (
          <Sfx key={t} name="whoosh" at={t} volume={0.3} />
        ) : (
          <Sfx key={t} name="pop" at={t} volume={0.3} />
        ),
      )}
      {cuts.map((t) => (
        <Flash key={t} at={t} peak={starts.includes(t) ? 0.4 : 0.25} />
      ))}
    </AbsoluteFill>
  );
};
