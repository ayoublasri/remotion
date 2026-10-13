import { fr } from "./motion";

// 47 senders, one name each: the first twelve come back as bookings.
export const NAMES = [
  "Nada",
  "Imane",
  "Salma",
  "Hajar",
  "Yasmine",
  "Rim",
  "Meryem",
  "Sofia",
  "Amal",
  "Kenza",
  "Lina",
  "Hiba",
  "Douae",
  "Ghita",
  "Nour",
  "Aya",
  "Chaimae",
  "Soukaina",
  "Wiam",
  "Zineb",
  "Ikram",
  "Oumaima",
  "Malak",
  "Khadija",
  "Fatima-Zahra",
  "Asmae",
  "Houda",
  "Ines",
  "Maha",
  "Siham",
  "Nisrine",
  "Rania",
  "Dounia",
  "Manal",
  "Laila",
  "Samia",
  "Widad",
  "Mouna",
  "Sanaa",
  "Nawal",
  "Hanane",
  "Loubna",
  "Najat",
  "Ilham",
  "Bouchra",
  "Latifa",
  "Safae",
];

const TEXTS = [
  "C'est combien la manucure russe ?",
  "Kayn blasa sebt ?",
  "Vous êtes ouverts dimanche ?",
  "Je peux décaler à 15h ?",
  "Vous faites la pose gel ?",
  "Une place demain matin ?",
  "C'est où exactement ?",
  "Je confirme pour jeudi",
  "Vous prenez la carte ?",
  "Le nail art, c'est combien ?",
  "Toujours dispo samedi ?",
  "Je peux venir avec ma sœur ?",
  "Bonsoir, vous avez une place ?",
  "Kayna blasa ghedda ?",
  "Vous faites la dépose ?",
  "Combien de temps pour la pose ?",
  "Vous êtes libre lundi ?",
  "Je dois annuler pour demain, désolée",
  "Encore une place ce soir ?",
  "Le babyboomer, c'est possible ?",
  "Vous travaillez le vendredi ?",
  "Je serai en retard de 10 min",
  "Vous avez le semi-permanent ?",
  "Bonsoir Sara, quels créneaux cette semaine ?",
];

export const BUBBLES = NAMES.map((name, i) => ({
  name,
  text: fr(TEXTS[i % TEXTS.length]),
  // Minutes after 23:00 for the time stamp.
  time: `23:${String(14 + Math.floor(i / 4)).padStart(2, "0")}`,
}));

export const SERVICES = [
  { name: "Manucure russe", duration: "45 min", price: "150 DH" },
  { name: "Pose gel", duration: "1 h", price: "200 DH" },
  { name: "Nail art", duration: "30 min", price: "80 DH" },
];
export const PICK_SERVICE = 0;

export const DAYS = [
  { label: "Jeu", n: 16 },
  { label: "Ven", n: 17 },
  { label: "Sam", n: 18 },
  { label: "Dim", n: 19 },
];
export const PICK_DAY = 2;
export const SLOTS = ["10:00", "11:00", "12:00", "15:00"];
export const PICK_SLOT = 1;

export type Booking = {
  day: number;
  start: number; // hour, 10..17
  hours: number;
  client: string;
  service: string;
};
// The booking that hops out of the confirmation.
export const FIRST_BOOKING: Booking = {
  day: 2,
  start: 11,
  hours: 1,
  client: "Nada",
  service: "Manucure russe",
};
// The eleven that fill the week in the burst, in landing order.
export const BURST_BOOKINGS: Booking[] = [
  { day: 0, start: 10, hours: 1, client: "Imane", service: "Pose gel" },
  { day: 1, start: 10, hours: 1, client: "Yasmine", service: "Pose gel" },
  { day: 3, start: 10, hours: 1, client: "Kenza", service: "Nail art" },
  { day: 0, start: 14, hours: 1, client: "Salma", service: "Manucure russe" },
  { day: 2, start: 14, hours: 1, client: "Sofia", service: "Pose gel" },
  { day: 1, start: 12, hours: 1, client: "Rim", service: "Manucure russe" },
  { day: 3, start: 13, hours: 1, client: "Lina", service: "Pose gel" },
  { day: 1, start: 15, hours: 1, client: "Meryem", service: "Nail art" },
  { day: 0, start: 16, hours: 1, client: "Hajar", service: "Nail art" },
  { day: 2, start: 16, hours: 1, client: "Amal", service: "Manucure russe" },
  { day: 3, start: 15, hours: 1, client: "Hiba", service: "Manucure russe" },
];
export const HOUR_FROM = 10;
export const HOUR_TO = 18;
