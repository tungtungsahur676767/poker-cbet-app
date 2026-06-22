"use client";

import { useMemo, useState } from "react";
import { RANKS, SUITS } from "../lib/cards";

const suitConfig: Record<
  string,
  { symbol: string; color: string; bg: string; border: string }
> = {
  s: {
    symbol: "♠",
    color: "text-slate-100",
    bg: "bg-slate-800",
    border: "border-slate-600",
  },
  h: {
    symbol: "♥",
    color: "text-red-400",
    bg: "bg-red-950/40",
    border: "border-red-500/50",
  },
  d: {
    symbol: "♦",
    color: "text-sky-300",
    bg: "bg-sky-950/40",
    border: "border-sky-500/50",
  },
  c: {
    symbol: "♣",
    color: "text-emerald-300",
    bg: "bg-emerald-950/40",
    border: "border-emerald-500/50",
  },
};

function SelectedCard({ card }: { card: string }) {
  const rank = card[0];
  const suit = card[1];
  const cfg = suitConfig[suit];

  return (
    <div
      className={`flex h-16 w-12 flex-col justify-between rounded-lg border p-2 shadow-md ${cfg.bg} ${cfg.border}`}
    >
      <span className={`text-sm font-bold leading-none ${cfg.color}`}>{rank}</span>
      <span className={`self-end text-lg leading-none ${cfg.color}`}>{cfg.symbol}</span>
    </div>
  );
}

export default function CardPicker({
  onSubmit,
}: {
  onSubmit: (cards: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const allCards = useMemo(
    () =>
      RANKS.flatMap((rank) =>
        SUITS.map((suit) => ({
          code: `${rank}${suit}`,
          rank,
          suit,
          ...suitConfig[suit],
        }))
      ),
    []
  );

  const toggleCard = (card: string) => {
    if (selected.includes(card)) {
      setSelected(selected.filter((c) => c !== card));
      return;
    }

    if (selected.length >= 3) return;

    setSelected([...selected, card]);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Choix du flop</h2>
            <p className="text-sm text-zinc-400">
              Selectionne exactement 3 cartes differentes.
            </p>
          </div>

          <div className="rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-zinc-300">
            {selected.length}/3 cartes
          </div>
        </div>

        <div className="mb-5 flex min-h-[88px] items-center gap-3 rounded-xl border border-dashed border-zinc-700 bg-zinc-950/80 p-4">
          {selected.length > 0 ? (
            selected.map((card) => <SelectedCard key={card} card={card} />)
          ) : (
            <span className="text-zinc-500">Aucune carte selectionnee</span>
          )}
        </div>

        <div className="space-y-4">
          {RANKS.map((rank) => (
            <div key={rank} className="grid grid-cols-[48px_1fr] items-center gap-3">
              <div className="text-lg font-bold text-zinc-300">{rank}</div>

              <div className="grid grid-cols-4 gap-3">
                {allCards
                  .filter((card) => card.rank === rank)
                  .map((card) => {
                    const active = selected.includes(card.code);

                    return (
                      <button
                        key={card.code}
                        type="button"
                        onClick={() => toggleCard(card.code)}
                        className={`group flex h-20 flex-col justify-between rounded-xl border p-3 text-left transition ${
                          active
                            ? "scale-[1.02] border-yellow-400 bg-yellow-500/15 shadow-lg shadow-yellow-500/10"
                            : `${card.border} ${card.bg} hover:scale-[1.01] hover:border-zinc-400`
                        }`}
                      >
                        <span
                          className={`text-base font-bold leading-none ${
                            active ? "text-yellow-300" : card.color
                          }`}
                        >
                          {card.rank}
                        </span>

                        <span
                          className={`self-end text-2xl leading-none ${
                            active ? "text-yellow-300" : card.color
                          }`}
                        >
                          {card.symbol}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setSelected([])}
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-zinc-200 hover:bg-zinc-800"
        >
          Reinitialiser
        </button>

        <button
          type="button"
          disabled={selected.length !== 3}
          onClick={() => onSubmit(selected)}
          className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Valider le flop
        </button>
      </div>
    </div>
  );
}
