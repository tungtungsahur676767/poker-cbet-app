import { NextRequest, NextResponse } from "next/server";
import { SpotType } from "@prisma/client";
import { parseCard } from "../../../lib/cards";
import { findStrategy } from "../../../lib/strategyMatcher";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { spotType, cards } = body;

  if (!spotType || !cards || !Array.isArray(cards) || cards.length !== 3) {
    return NextResponse.json({ error: "Format invalide" }, { status: 400 });
  }

  const parsedCards = cards.map(parseCard);
  const result = await findStrategy(parsedCards, spotType as SpotType);

  return NextResponse.json(result);
}
