export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "../../../../lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier recu" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const safeName = `${Date.now()}-${file.name || "image.png"}`.replace(/\s+/g, "-");
    const fullPath = path.join(uploadsDir, safeName);

    await writeFile(fullPath, buffer);

    return NextResponse.json({
      ok: true,
      imageUrl: `/uploads/${safeName}`,
    });
  } catch (error) {
    console.error("Erreur upload-image:", error);

    return NextResponse.json(
      { error: "Erreur serveur lors de l'upload de l'image" },
      { status: 500 }
    );
  }
}
