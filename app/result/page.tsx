"use client";

import { useEffect, useState } from "react";
import FlopDisplay from "../../components/FlopDisplay";

export default function ResultPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("strategy_result");
    if (raw) setData(JSON.parse(raw));
  }, []);

  if (!data) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white p-8">
        Aucun resultat.
      </main>
    );
  }

  const flopCards = data.analysis?.normalizedFlop
    ? [
        data.analysis.normalizedFlop.slice(0, 2),
        data.analysis.normalizedFlop.slice(2, 4),
        data.analysis.normalizedFlop.slice(4, 6),
      ]
    : [];

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold">Strategie de c-bet</h1>

        <div className="rounded-2xl bg-zinc-900 p-6 space-y-4">
          <div>
            <p className="mb-2"><strong>Flop :</strong></p>
            <FlopDisplay cards={flopCards} />
          </div>

          <p><strong>Flop normalise :</strong> {data.analysis.normalizedFlop}</p>
          <p><strong>Classe detectee :</strong> {data.analysis.classKey}</p>
          <p><strong>Texture :</strong> {data.analysis.texture}</p>
          <p><strong>Structure :</strong> {data.analysis.structureTag}</p>
          <p><strong>Type de match :</strong> {data.matchType}</p>
        </div>

        {data.strategy ? (
          <>
            <div className="rounded-2xl bg-emerald-950 p-6 space-y-3">
              <p className="whitespace-pre-wrap">{data.strategy.strategyText}</p>
              <p>
                <strong>Rattachement :</strong>{" "}
                {data.strategy.attachedToLabel || data.strategy.classKey || data.strategy.exactFlop}
              </p>
            </div>

            {data.strategy.imageUrl && (
              <div className="rounded-2xl bg-zinc-900 p-6">
                <img
                  src={data.strategy.imageUrl}
                  alt="Illustration strategie"
                  className="max-h-[500px] rounded-xl border border-zinc-700"
                />
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl bg-red-950 p-6">
            Strategie non encore renseignee pour ce spot / cette famille de flop.
          </div>
        )}
      </div>
    </main>
  );
}
