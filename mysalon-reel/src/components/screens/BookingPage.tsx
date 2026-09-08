import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SANS, SERIF } from "../../fonts";
import { StarMark } from "../Brand";
import {
  BellIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  QrIcon,
} from "../Icons";
import { TapRing } from "../TapRing";

const ServiceRow: React.FC<{
  readonly name: string;
  readonly minutes: number;
  readonly price: number;
  readonly tag: string;
  readonly tapAt: number | null;
}> = ({ name, minutes, price, tag, tapAt }) => {
  const frame = useCurrentFrame();
  const filled = tapAt !== null && frame >= tapAt + 4;

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: "16px 18px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(15,61,58,0.06)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 24,
            color: "#1a1a1a",
          }}
        >
          {name}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            fontFamily: SANS,
            fontSize: 19,
            color: "#6b6b6b",
          }}
        >
          <span>{minutes} min ·</span>
          <span style={{ fontWeight: 700, color: "#1a1a1a" }}>{price} DH</span>
          <span
            style={{
              backgroundColor: "#fde4ea",
              color: "#b81238",
              fontWeight: 600,
              fontSize: 15,
              padding: "3px 8px",
              borderRadius: 8,
            }}
          >
            {tag}
          </span>
        </div>
      </div>
      <div
        style={{
          position: "relative",
          padding: "10px 20px",
          borderRadius: 999,
          border: "2px solid #0f5c57",
          backgroundColor: filled ? "#0f5c57" : "transparent",
          color: filled ? "#ffffff" : "#0f5c57",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 20,
        }}
      >
        Réserver
        {tapAt === null ? null : <TapRing at={tapAt} />}
      </div>
    </div>
  );
};

const SectionLabel: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: "0.12em",
      color: "#6b6b6b",
      marginTop: 6,
    }}
  >
    {children}
  </div>
);

const Chip: React.FC<{
  readonly label: string;
  readonly selected: boolean;
  readonly tapAt: number | null;
}> = ({ label, selected, tapAt }) => (
  <div
    style={{
      position: "relative",
      padding: "12px 18px",
      borderRadius: 12,
      border: selected ? "2px solid #0f5c57" : "2px solid #e4dcd8",
      backgroundColor: selected ? "#0f5c57" : "#ffffff",
      color: selected ? "#ffffff" : "#1a1a1a",
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 20,
      whiteSpace: "nowrap",
    }}
  >
    {label}
    {tapAt === null ? null : <TapRing at={tapAt} />}
  </div>
);

const ConfirmationLine: React.FC<{
  readonly icon: "mail" | "calendar" | "bell";
  readonly text: string;
  readonly at: number;
}> = ({ icon, text, at }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        fontFamily: SANS,
        fontWeight: 500,
        fontSize: 20,
        color: "#1a1a1a",
        opacity: interpolate(frame, [at, at + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(frame, [at, at + 12], ["0px 16px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "#e6f2f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon === "mail" ? (
          <MailIcon size={22} color="#0f5c57" />
        ) : icon === "calendar" ? (
          <CalendarIcon size={22} color="#0f5c57" />
        ) : (
          <BellIcon size={22} color="#0f5c57" />
        )}
      </div>
      {text}
    </div>
  );
};

// The public booking page of a salon, then the booking flow:
// scroll -> tap "Réserver" -> pick a slot -> confirm -> success.
// All frame numbers are relative to the sequence this screen is mounted in.
export const BookingPage: React.FC<{
  readonly urlPulseAt: number;
  readonly scrollAt: number;
  readonly tapAt: number;
  readonly slotAt: number;
  readonly confirmAt: number;
  readonly reminderAt: number;
}> = ({ urlPulseAt, scrollAt, tapAt, slotAt, confirmAt, reminderAt }) => {
  const frame = useCurrentFrame();
  const sheetIn = tapAt + 6;
  const confirmed = frame >= confirmAt + 6;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          padding: "64px 18px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          translate: interpolate(
            frame,
            [scrollAt, scrollAt + 22],
            ["0px 0px", "0px -250px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.4, 0, 0.2, 1),
            },
          ),
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            position: "relative",
            backgroundColor: "#ece6e2",
            scale: interpolate(
              frame,
              [urlPulseAt, urlPulseAt + 10, urlPulseAt + 22],
              [1, 1.05, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
            borderRadius: 14,
            padding: "10px 14px",
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 19,
            color: "#3c3c3c",
          }}
        >
          <LockIcon size={18} color="#0f5c57" />
          <span style={{ flex: 1 }}>mysalon.ma/salon-yasmine</span>
          <QrIcon size={22} color="#0f5c57" />
          <div
            style={{
              position: "absolute",
              inset: -4,
              borderRadius: 18,
              border: "3px solid #0f5c57",
              pointerEvents: "none",
              opacity: interpolate(
                frame,
                [urlPulseAt, urlPulseAt + 8, urlPulseAt + 30, urlPulseAt + 44],
                [0, 1, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              ),
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 18,
            color: "#0f5c57",
          }}
        >
          <StarMark size={16} color="#0f5c57" />
          MySalon.ma
        </div>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 18,
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            boxShadow: "0 2px 8px rgba(15,61,58,0.06)",
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 30,
              color: "#1a1a1a",
            }}
          >
            Salon Yasmine
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              fontFamily: SANS,
              fontSize: 18,
              color: "#6b6b6b",
            }}
          >
            <PinIcon size={18} color="#b81238" />
            12, rue Ibn Battouta, Maârif, Casablanca
          </div>
          <div style={{ fontFamily: SANS, fontSize: 18, color: "#6b6b6b" }}>
            Coiffure & soins, sur rendez-vous
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              fontFamily: SANS,
              fontSize: 18,
              color: "#3c3c3c",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <ClockIcon size={17} color="#3c3c3c" /> 9:00 – 19:00
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <PhoneIcon size={17} color="#3c3c3c" /> 0612345678
            </span>
          </div>
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 17,
            letterSpacing: "0.1em",
            color: "#1a1a1a",
            marginTop: 8,
          }}
        >
          PRESTATIONS & TARIFS
        </div>
        <SectionLabel>COIFFURE</SectionLabel>
        <ServiceRow
          name="Coupe femme"
          minutes={45}
          price={150}
          tag="avec Yasmine"
          tapAt={tapAt}
        />
        <ServiceRow
          name="Brushing"
          minutes={30}
          price={100}
          tag="avec Yasmine"
          tapAt={null}
        />
        <ServiceRow
          name="Coloration"
          minutes={120}
          price={400}
          tag="avec Yasmine"
          tapAt={null}
        />
        <SectionLabel>SOINS & ESTHÉTIQUE</SectionLabel>
        <ServiceRow
          name="Manucure"
          minutes={45}
          price={120}
          tag="Cabine soins"
          tapAt={null}
        />
        <ServiceRow
          name="Soin du visage"
          minutes={60}
          price={250}
          tag="Cabine soins"
          tapAt={null}
        />
        <ServiceRow
          name="Épilation sourcils"
          minutes={15}
          price={60}
          tag="Cabine soins"
          tapAt={null}
        />
        <div
          style={{
            fontFamily: SANS,
            fontSize: 15,
            color: "#8a8a8a",
            textAlign: "center",
            marginTop: 10,
            lineHeight: 1.4,
          }}
        >
          Réservation gratuite via MySalon.ma — paiement sur place au salon.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#0b2624",
          opacity: interpolate(frame, [sheetIn, sheetIn + 12], [0, 0.45], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 600,
          backgroundColor: "#ffffff",
          borderRadius: "30px 30px 0 0",
          padding: "16px 24px 24px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          boxShadow: "0 -10px 40px rgba(0,0,0,0.2)",
          translate: interpolate(
            frame,
            [sheetIn, sheetIn + 16],
            ["0px 620px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        <div
          style={{
            width: 56,
            height: 6,
            borderRadius: 3,
            backgroundColor: "#e4dcd8",
            alignSelf: "center",
          }}
        />
        {confirmed ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              paddingTop: 12,
            }}
          >
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: "#0f5c57",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 12px 30px rgba(15,92,87,0.35)",
                scale: interpolate(
                  frame,
                  [confirmAt + 6, confirmAt + 20],
                  [0, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.spring({
                      damping: 12,
                      stiffness: 170,
                      mass: 0.8,
                    }),
                    output: "perceptual-scale",
                  },
                ),
              }}
            >
              <CheckIcon size={54} color="#ffffff" strokeWidth={3} />
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontWeight: 900,
                fontSize: 36,
                color: "#1a1a1a",
              }}
            >
              RDV confirmé
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 24,
                color: "#0f5c57",
              }}
            >
              Jeudi 12 sept. · 14:30
            </div>
            <div style={{ fontFamily: SANS, fontSize: 20, color: "#6b6b6b" }}>
              Coupe femme · avec Yasmine · 150 DH
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                alignSelf: "stretch",
                marginTop: 14,
                paddingTop: 18,
                borderTop: "1px solid #eee6e2",
              }}
            >
              <ConfirmationLine
                icon="mail"
                text="Confirmation envoyée par email"
                at={confirmAt + 36}
              />
              <ConfirmationLine
                icon="calendar"
                text="Ajouté à votre agenda"
                at={confirmAt + 48}
              />
              <ConfirmationLine
                icon="bell"
                text="Rappel automatique la veille"
                at={confirmAt + 60}
              />
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: 30,
                color: "#1a1a1a",
              }}
            >
              Coupe femme
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 19,
                color: "#6b6b6b",
                marginTop: -6,
              }}
            >
              45 min · 150 DH · avec Yasmine
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: "0.12em",
                color: "#6b6b6b",
                marginTop: 8,
              }}
            >
              CHOISISSEZ UN CRÉNEAU
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              <Chip label="Jeu. 12" selected tapAt={null} />
              <Chip label="Ven. 13" selected={false} tapAt={null} />
              <Chip label="Sam. 14" selected={false} tapAt={null} />
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              <Chip label="10:00" selected={false} tapAt={null} />
              <Chip label="11:30" selected={false} tapAt={null} />
              <Chip
                label="14:30"
                selected={frame >= slotAt + 4}
                tapAt={slotAt}
              />
              <Chip label="16:00" selected={false} tapAt={null} />
            </div>
            <div
              style={{
                position: "relative",
                marginTop: "auto",
                backgroundColor: frame >= confirmAt + 3 ? "#0b4a45" : "#0f5c57",
                color: "#ffffff",
                borderRadius: 16,
                padding: "20px 0",
                textAlign: "center",
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 24,
                boxShadow: "0 10px 26px rgba(15,92,87,0.3)",
              }}
            >
              Confirmer le RDV
              <TapRing at={confirmAt} />
            </div>
          </>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          left: 14,
          right: 14,
          top: 58,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          borderRadius: 22,
          backgroundColor: "rgba(255,255,255,0.97)",
          boxShadow: "0 16px 40px rgba(15,61,58,0.28)",
          translate: interpolate(
            frame,
            [reminderAt, reminderAt + 18],
            ["0px -180px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 200 }),
            },
          ),
          opacity: interpolate(frame, [reminderAt, reminderAt + 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            backgroundColor: "#0f5c57",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <BellIcon size={26} color="#ffffff" />
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              fontFamily: SANS,
              fontSize: 15,
              color: "#6b6b6b",
            }}
          >
            <span style={{ fontWeight: 700, color: "#0f5c57" }}>
              MySalon.ma
            </span>
            <span>maintenant</span>
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 19,
              color: "#1a1a1a",
            }}
          >
            Rappel : RDV demain à 14:30
          </div>
          <div style={{ fontFamily: SANS, fontSize: 16, color: "#6b6b6b" }}>
            Coupe femme avec Yasmine · Salon Yasmine
          </div>
        </div>
      </div>
    </div>
  );
};
