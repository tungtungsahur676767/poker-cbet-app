import { NextRequest, NextResponse } from "next/server";
import { parseCard } from "../../../lib/cards";
import { findStrategy } from "../../../lib/strategyMatcher";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { spotType, cards } = body;

    if (!spotType || !cards || !Array.isArray(cards) || cards.length !== 3) {
      return NextResponse.json({ error: "Format invalide" }, { status: 400 });
    }

    const parsedCards = cards.map(parseCard);
    const result = await findStrategy(parsedCards, spotType);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur strategy route:", error);

    return NextResponse.json(
      { error: "Erreur serveur lors de l'analyse du flop" },
      { status: 500 }
    );
  }
}
