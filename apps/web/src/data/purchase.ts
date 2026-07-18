export type SeatState = "available" | "occupied" | "selected";

export type Seat = {
  id: string;
  row: string;
  number: number;
  kind: "standard" | "premium" | "accessible";
};

export type ConcessionProduct = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  priceCents: number;
  image: string;
};

export type ConcessionCategory = {
  id: string;
  name: string;
  description: string;
  products: ConcessionProduct[];
};

export const ticketPriceCents = 1450;
export const premiumSeatPriceCents = 1750;
export const convenienceFeeCents = 250;
export const salesTaxRate = 0.115;

export const seatRows: Seat[][] = [
  buildSeatRow("A", 10, "standard"),
  buildSeatRow("B", 12, "standard"),
  buildSeatRow("C", 12, "standard"),
  buildSeatRow("D", 12, "premium"),
  buildSeatRow("E", 12, "premium"),
  buildSeatRow("F", 12, "standard"),
  buildSeatRow("G", 10, "standard"),
  buildSeatRow("H", 8, "accessible"),
];

export const occupiedSeatIds = new Set([
  "A4",
  "A5",
  "B7",
  "B8",
  "C2",
  "C9",
  "D5",
  "D6",
  "E7",
  "F3",
  "F10",
  "G4",
  "H2",
]);

export const concessionCategories: ConcessionCategory[] = [
  {
    id: "combos",
    name: "Combos",
    description: "Balanced sets for the full movie run.",
    products: [
      {
        id: "classic-combo",
        categoryId: "combos",
        name: "Classic combo",
        description: "Large popcorn and two fountain drinks.",
        priceCents: 1895,
        image:
          "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "date-night",
        categoryId: "combos",
        name: "Date night",
        description: "Shareable popcorn, candy, and two drinks.",
        priceCents: 2295,
        image:
          "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "family-set",
        categoryId: "combos",
        name: "Family set",
        description: "Two large popcorns, four drinks, and candy.",
        priceCents: 3495,
        image:
          "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    id: "popcorn",
    name: "Popcorn",
    description: "Fresh batches with classic and flavored options.",
    products: [
      {
        id: "butter-popcorn",
        categoryId: "popcorn",
        name: "Butter popcorn",
        description: "Large popcorn with warm butter.",
        priceCents: 895,
        image:
          "https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "caramel-popcorn",
        categoryId: "popcorn",
        name: "Caramel popcorn",
        description: "Crunchy caramel-coated popcorn.",
        priceCents: 995,
        image:
          "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "spicy-popcorn",
        categoryId: "popcorn",
        name: "Spicy popcorn",
        description: "Savory popcorn with chile and lime.",
        priceCents: 925,
        image:
          "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    id: "drinks",
    name: "Drinks",
    description: "Cold drinks for every seat in the row.",
    products: [
      {
        id: "fountain-drink",
        categoryId: "drinks",
        name: "Fountain drink",
        description: "Choose cola, lemon-lime, or iced tea.",
        priceCents: 595,
        image:
          "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "sparkling-water",
        categoryId: "drinks",
        name: "Sparkling water",
        description: "Chilled mineral water with bubbles.",
        priceCents: 475,
        image:
          "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "cold-brew",
        categoryId: "drinks",
        name: "Cold brew",
        description: "Smooth coffee over ice.",
        priceCents: 675,
        image:
          "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    id: "candy",
    name: "Candy",
    description: "Boxed favorites and sweet finishes.",
    products: [
      {
        id: "chocolate-bites",
        categoryId: "candy",
        name: "Chocolate bites",
        description: "Milk chocolate pieces in a theater box.",
        priceCents: 525,
        image:
          "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "fruit-chews",
        categoryId: "candy",
        name: "Fruit chews",
        description: "Bright fruit candy with a soft chew.",
        priceCents: 495,
        image:
          "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=900&q=80",
      },
      {
        id: "sour-mix",
        categoryId: "candy",
        name: "Sour mix",
        description: "Tangy gummies with a sugar finish.",
        priceCents: 545,
        image:
          "https://images.unsplash.com/photo-1575224300306-1b8da36134ec?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
];

export const allConcessionProducts = concessionCategories.flatMap(
  (category) => category.products,
);

export function getSeatPriceCents(seat: Seat) {
  return seat.kind === "premium" ? premiumSeatPriceCents : ticketPriceCents;
}

function buildSeatRow(row: string, count: number, kind: Seat["kind"]): Seat[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${row}${index + 1}`,
    row,
    number: index + 1,
    kind,
  }));
}
