export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "../../../../lib/auth";
import { getRandomUncoveredFlop } from "../../../../lib/flopGenerator";

export async function POST(req: NextRequest) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const body = await req.json();
    const { spotType } = body;

    const result = await getRandomUncoveredFlop(spotType);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur random-flop:", error);

    return NextResponse.json(
      { error: "Erreur serveur lors de la generation du flop" },
      { status: 500 }
    );
  }
}
