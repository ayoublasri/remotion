import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SANS, SERIF } from "../../fonts";
import { CheckIcon, MessageIcon, SearchIcon } from "../Icons";
import { TapRing } from "../TapRing";

const Stat: React.FC<{ readonly value: string; readonly label: string }> = ({
  value,
  label,
}) => (
  <div
    style={{
      flex: 1,
      backgroundColor: "#fdf4f1",
      borderRadius: 12,
      padding: "12px 10px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
    }}
  >
    <div
      style={{
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 22,
        color: "#0f5c57",
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontFamily: SANS,
        fontSize: 14,
        color: "#6b6b6b",
        textAlign: "center",
      }}
    >
      {label}
    </div>
  </div>
);

const HistoryRow: React.FC<{
  readonly service: string;
  readonly price: string;
  readonly date: string;
}> = ({ service, price, date }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      fontFamily: SANS,
      fontSize: 18,
      color: "#1a1a1a",
      padding: "10px 0",
      borderBottom: "1px solid #eee6e2",
    }}
  >
    <span style={{ fontWeight: 600 }}>{service}</span>
    <span style={{ color: "#6b6b6b" }}>
      {price} · {date}
    </span>
  </div>
);

// Client profile with history, spend and a one-tap WhatsApp offer.
export const ClientsScreen: React.FC<{ readonly tapAt: number }> = ({
  tapAt,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        backgroundColor: "#fdf4f1",
        padding: "64px 18px 0",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        translate: interpolate(frame, [0, 14], ["520px 0px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <div
        style={{
          fontFamily: SERIF,
          fontWeight: 900,
          fontSize: 30,
          color: "#1a1a1a",
        }}
      >
        Clients
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          backgroundColor: "#ffffff",
          borderRadius: 14,
          padding: "12px 14px",
          fontFamily: SANS,
          fontSize: 18,
          color: "#8a8a8a",
        }}
      >
        <SearchIcon size={20} color="#8a8a8a" />
        Rechercher une cliente
      </div>
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 20,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          boxShadow: "0 2px 8px rgba(15,61,58,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: 31,
              backgroundColor: "#0f5c57",
              color: "#ffffff",
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            SB
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 25,
                color: "#1a1a1a",
              }}
            >
              Salma Bennani
            </div>
            <div
              style={{
                alignSelf: "flex-start",
                backgroundColor: "#fde4ea",
                color: "#b81238",
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 14,
                padding: "4px 10px",
                borderRadius: 8,
              }}
            >
              Cliente fidèle
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Stat value="6" label="visites" />
          <Stat value="1 240 DH" label="dépensés" />
          <Stat value="2 sept." label="dernier RDV" />
        </div>
        <div>
          <HistoryRow service="Coloration" price="400 DH" date="2 sept." />
          <HistoryRow service="Coupe femme" price="150 DH" date="14 août" />
          <HistoryRow service="Brushing" price="100 DH" date="30 juil." />
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            backgroundColor: frame >= tapAt + 3 ? "#1da851" : "#25d366",
            color: "#ffffff",
            borderRadius: 14,
            padding: "16px 0",
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 21,
          }}
        >
          <MessageIcon size={24} color="#ffffff" />
          Envoyer une offre WhatsApp
          <TapRing at={tapAt} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          borderRadius: 16,
          backgroundColor: "#ffffff",
          boxShadow: "0 14px 34px rgba(15,61,58,0.22)",
          fontFamily: SANS,
          fontSize: 18,
          color: "#1a1a1a",
          translate: interpolate(
            frame,
            [tapAt + 8, tapAt + 22],
            ["0px 40px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 200 }),
            },
          ),
          opacity: interpolate(frame, [tapAt + 8, tapAt + 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "#25d366",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckIcon size={20} color="#ffffff" strokeWidth={3} />
        </div>
        <div>
          <div style={{ fontWeight: 700 }}>Offre envoyée à Salma</div>
          <div style={{ color: "#6b6b6b", fontSize: 16 }}>
            « -20 % sur votre prochain brushing »
          </div>
        </div>
      </div>
    </div>
  );
};
