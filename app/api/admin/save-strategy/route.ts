export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const body = await req.json();

    const {
      spotType,
      scope,
      strategyText,
      classKey,
      exactFlop,
      exampleFlop,
      title,
      notes,
      attachedToLabel,
      imageUrl,
    } = body;

    if (!spotType || !scope || !strategyText || !exampleFlop) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const created = await prisma.strategy.create({
      data: {
        spotType: spotType as any,
        scope: scope as any,
        strategyText,
        classKey: classKey || null,
        exactFlop: exactFlop || null,
        exampleFlop,
        title: title || null,
        notes: notes || null,
        attachedToLabel: attachedToLabel || null,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json({ ok: true, strategy: created });
  } catch (error) {
    console.error("Erreur save-strategy:", error);

    return NextResponse.json(
      { error: "Erreur serveur lors de l'enregistrement de la strategie" },
      { status: 500 }
    );
  }
}
