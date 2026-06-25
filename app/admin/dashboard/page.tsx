"use client";

import { useState } from "react";
import FlopDisplay from "../../../components/FlopDisplay";

export default function AdminDashboardPage() {
  const [spotType, setSpotType] = useState("SRP");
  const [randomFlop, setRandomFlop] = useState<any>(null);
  const [scope, setScope] = useState("CLASS");
  const [customClassKey, setCustomClassKey] = useState("");
  const [attachedToLabel, setAttachedToLabel] = useState("");
  const [strategyText, setStrategyText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  const loadRandomFlop = async () => {
    setMessage("");

    const res = await fetch("/api/admin/random-flop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ spotType }),
    });

    const data = await res.json();
    setRandomFlop(data);

    if (data?.analysis?.classKey) {
      setCustomClassKey(data.analysis.classKey);
      setAttachedToLabel(`Rattache a la classe ${data.analysis.classKey}`);
    }
  };

  const handlePasteImage = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (!file) continue;

        const formData = new FormData();
        formData.append("file", file, "pasted-image.png");

        setUploadMessage("Upload de l'image en cours...");

        const res = await fetch("/api/admin/upload-image", {
          method: "POST",
          body: formData,
        });

        let data: any = {};
        try {
          data = await res.json();
        } catch {
          data = {};
        }

        if (res.ok) {
          setImageUrl(data.imageUrl);
          setUploadMessage("Image importee avec succes.");
        } else {
          setUploadMessage(data.error || "Erreur d'upload.");
        }

        break;
      }
    }
  };

  const saveStrategy = async () => {
    if (!randomFlop) {
      setMessage("Commence par demander un flop non couvert.");
      return;
    }

    setMessage("");

    const payload = {
      spotType,
      scope,
      strategyText,
      classKey: scope === "EXACT" ? null : customClassKey,
      exactFlop: scope === "EXACT" ? randomFlop.analysis.normalizedFlop : null,
      exampleFlop: randomFlop.analysis.normalizedFlop,
      title: `${spotType} - ${randomFlop.analysis.classKey}`,
      notes: "",
      attachedToLabel,
      imageUrl,
    };

    const res = await fetch("/api/admin/save-strategy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    let data: any = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (res.ok) {
      setMessage("Strategie enregistree avec succes");
      setStrategyText("");
      setImageUrl("");
      setUploadMessage("");
    } else {
      setMessage(data.error || "Erreur lors de l'enregistrement");
    }
  };

  const flopCards = randomFlop?.analysis?.normalizedFlop
    ? [
        randomFlop.analysis.normalizedFlop.slice(0, 2),
        randomFlop.analysis.normalizedFlop.slice(2, 4),
        randomFlop.analysis.normalizedFlop.slice(4, 6),
      ]
    : [];

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>

        <div className="rounded-2xl bg-zinc-900 p-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Spot</label>
            <select
              className="w-full rounded-xl bg-zinc-800 p-3"
              value={spotType}
              onChange={(e) => setSpotType(e.target.value)}
            >
              <option value="SRP">SRP</option>
              <option value="BET3">3BET</option>
              <option value="BET4">4BET</option>
            </select>
          </div>

          <button
            onClick={loadRandomFlop}
            className="rounded-xl bg-blue-600 px-5 py-3 hover:bg-blue-500"
          >
            Proposer un flop non couvert
          </button>

          {randomFlop && (
            <div className="rounded-2xl bg-zinc-800 p-5 space-y-3">
              <p><strong>Flop propose :</strong></p>
              <FlopDisplay cards={flopCards} />
              <p><strong>Flop normalise :</strong> {randomFlop.analysis.normalizedFlop}</p>
              <p><strong>Classe calculee :</strong> {randomFlop.analysis.classKey}</p>
              <p><strong>Texture :</strong> {randomFlop.analysis.texture}</p>
              <p><strong>Structure :</strong> {randomFlop.analysis.structureTag}</p>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium">Portee</label>
            <select
              className="w-full rounded-xl bg-zinc-800 p-3"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
            >
              <option value="EXACT">Flop exact uniquement</option>
              <option value="CLASS">Classe automatique</option>
              <option value="CUSTOM">Classe personnalisee</option>
            </select>
          </div>

          {scope !== "EXACT" && (
            <div>
              <label className="mb-2 block text-sm font-medium">Classe retenue</label>
              <input
                className="w-full rounded-xl bg-zinc-800 p-3"
                value={customClassKey}
                onChange={(e) => setCustomClassKey(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Texte affiche de rattachement
            </label>
            <input
              className="w-full rounded-xl bg-zinc-800 p-3"
              value={attachedToLabel}
              onChange={(e) => setAttachedToLabel(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="mb-2 block text-sm font-medium">Image de strategie</label>

            <div
              onPaste={handlePasteImage}
              className="rounded-xl border-2 border-dashed border-zinc-600 bg-zinc-800 p-4 text-sm text-zinc-300"
            >
              Clique ici puis fais Ctrl + V pour coller une image depuis le presse-papiers.
            </div>

            {uploadMessage && <p className="text-sm text-emerald-400">{uploadMessage}</p>}

            <input
              className="w-full rounded-xl bg-zinc-800 p-3"
              placeholder="/uploads/... ou https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />

            {imageUrl && (
              <img
                src={imageUrl}
                alt="Apercu strategie"
                className="max-h-64 rounded-xl border border-zinc-700"
              />
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Strategie de c-bet
            </label>
            <textarea
              className="min-h-[220px] w-full rounded-xl bg-zinc-800 p-3"
              placeholder="Ecris ici la strategie..."
              value={strategyText}
              onChange={(e) => setStrategyText(e.target.value)}
            />
          </div>

          <button
            onClick={saveStrategy}
            className="rounded-xl bg-emerald-600 px-6 py-3 hover:bg-emerald-500"
          >
            Enregistrer la strategie
          </button>

          {message && <p className="text-emerald-400">{message}</p>}
        </div>
      </div>
    </main>
  );
}
