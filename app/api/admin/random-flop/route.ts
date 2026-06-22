import { NextRequest, NextResponse } from "next/server";
import { SpotType } from "@prisma/client";
import { isAdmin } from "../../../../lib/auth";
import { getRandomUncoveredFlop } from "../../../../lib/flopGenerator";

export async function POST(req: NextRequest) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const body = await req.json();
  const { spotType } = body;

  const result = await getRandomUncoveredFlop(spotType as SpotType);

  return NextResponse.json(result);
}
