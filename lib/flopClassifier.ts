import { Card, rankValue, sortCardsDesc } from "./cards";

export type FlopTexture = "RAINBOW" | "TWOTONE" | "MONOTONE";
export type PairingType = "UNPAIRED" | "PAIRED" | "TRIPS";

export type FlopAnalysis = {
  normalizedFlop: string;
  ranks: string[];
  values: number[];
  texture: FlopTexture;
  pairing: PairingType;
  isPaired: boolean;
  isTrips: boolean;
  hasAce: boolean;
  broadwayCount: number;
  highCard: string;
  middleCard: string;
  lowCard: string;
  structureTag: string;
  classKey: string;
  familyKey: string;
};

function getTexture(cards: Card[]): FlopTexture {
  const suits = new Set(cards.map((c) => c.suit));
  if (suits.size === 1) return "MONOTONE";
  if (suits.size === 2) return "TWOTONE";
  return "RAINBOW";
}

function getPairing(ranks: string[]): PairingType {
  const counts = Object.values(
    ranks.reduce<Record<string, number>>((acc, rank) => {
      acc[rank] = (acc[rank] || 0) + 1;
      return acc;
    }, {})
  );

  if (counts.includes(3)) return "TRIPS";
  if (counts.includes(2)) return "PAIRED";
  return "UNPAIRED";
}

function isBroadway(v: number) {
  return v >= 10;
}

function gapProfile(values: number[]): string {
  const [a, b, c] = values;
  const g1 = a - b;
  const g2 = b - c;

  if (g1 <= 1 && g2 <= 2) return "VERY_CONNECTED";
  if (g1 <= 2 && g2 <= 3) return "CONNECTED";
  if (g1 >= 4 && g2 >= 4) return "DISCONNECTED";
  return "SEMI_CONNECTED";
}

function pairedStructure(ranks: string[]): string {
  const counts: Record<string, number> = {};
  for (const r of ranks) counts[r] = (counts[r] || 0) + 1;

  const pairRank = Object.keys(counts).find((r) => counts[r] === 2)!;
  const kickerRank = Object.keys(counts).find((r) => counts[r] === 1)!;

  const pairValue =
    pairRank === "A" ? 14 :
    pairRank === "K" ? 13 :
    pairRank === "Q" ? 12 :
    pairRank === "J" ? 11 :
    pairRank === "T" ? 10 : Number(pairRank);

  const kickerValue =
    kickerRank === "A" ? 14 :
    kickerRank === "K" ? 13 :
    kickerRank === "Q" ? 12 :
    kickerRank === "J" ? 11 :
    kickerRank === "T" ? 10 : Number(kickerRank);

  let pairBucket = "LOW_PAIRED";
  if (pairValue >= 11) pairBucket = "HIGH_PAIRED";
  else if (pairValue >= 7) pairBucket = "MID_PAIRED";

  let kickerBucket = "LOW_KICKER";
  if (kickerValue >= 10) kickerBucket = "HIGH_KICKER";
  else if (kickerValue >= 7) kickerBucket = "MID_KICKER";

  return `${pairBucket}_${kickerBucket}`;
}

function unpairedStructure(values: number[]): string {
  const [a, b, c] = values;
  const hasAce = a === 14;
  if (hasAce && b <= 7) return "A_HIGH_DRY";
  if (a >= 13 && b >= 10) return "DOUBLE_BROADWAY";
  if (a >= 10 && b >= 8 && c <= 5) return "HIGH_CONNECTED_LOW";
  if (a <= 9 && c >= 5) return "LOW_MID_CONNECTED";
  return gapProfile(values);
}

export function analyzeFlop(cards: Card[]): FlopAnalysis {
  const sorted = sortCardsDesc(cards);
  const ranks = sorted.map((c) => c.rank);
  const values = sorted.map((c) => rankValue(c.rank));
  const texture = getTexture(sorted);
  const pairing = getPairing(ranks);
  const isPaired = pairing === "PAIRED";
  const isTrips = pairing === "TRIPS";
  const broadwayCount = values.filter(isBroadway).length;

  let structureTag = "GENERIC";
  if (isTrips) {
    structureTag = "TRIPS_BOARD";
  } else if (isPaired) {
    structureTag = pairedStructure(ranks);
  } else {
    structureTag = unpairedStructure(values);
  }

  let familyKey = "";
  if (isTrips) {
    familyKey = `TRIPS_${ranks[0]}_${texture}`;
  } else if (isPaired) {
    const uniqueRanks = [...new Set(ranks)];
    const pairRank = uniqueRanks.find((r) => ranks.filter((x) => x === r).length === 2)!;
    familyKey = `${pairRank}${pairRank}X_${structureTag}_${texture}`;
  } else {
    familyKey = `${ranks[0]}${ranks[1]}X_${structureTag}_${texture}`;
  }

  const normalizedFlop = sorted.map((c) => `${c.rank}${c.suit}`).join("");

  return {
    normalizedFlop,
    ranks,
    values,
    texture,
    pairing,
    isPaired,
    isTrips,
    hasAce: values.includes(14),
    broadwayCount,
    highCard: ranks[0],
    middleCard: ranks[1],
    lowCard: ranks[2],
    structureTag,
    classKey: familyKey,
    familyKey,
  };
}
