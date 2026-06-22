export const RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"] as const;
export const SUITS = ["s", "h", "d", "c"] as const;

export type Rank = typeof RANKS[number];
export type Suit = typeof SUITS[number];

export type Card = {
  rank: Rank;
  suit: Suit;
};

const rankValueMap: Record<Rank, number> = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
};

export function cardToString(card: Card) {
  return `${card.rank}${card.suit}`;
}

export function parseCard(input: string): Card {
  const rank = input[0] as Rank;
  const suit = input[1] as Suit;
  return { rank, suit };
}

export function rankValue(rank: Rank) {
  return rankValueMap[rank];
}

export function sortCardsDesc(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => rankValue(b.rank) - rankValue(a.rank));
}
