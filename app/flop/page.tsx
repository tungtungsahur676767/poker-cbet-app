"use client";

import { useRouter, useSearchParams } from "next/navigation";
import CardPicker from "../../components/CardPicker";

export default function FlopPage() {
  const router = useRouter();
  const params = useSearchParams();
  const spot = params.get("spot") || "SRP";

  const handleSubmit = async (cards: string[]) => {
    const res = await fetch("/api/strategy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ spotType: spot, cards }),
    });

    const data = await res.json();
    sessionStorage.setItem("strategy_result", JSON.stringify(data));
    router.push("/result");
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="text-3xl font-bold">Spot : {spot}</h1>
        <p className="text-zinc-400">
          Selectionne 3 cartes pour composer le flop.
        </p>

        <CardPicker onSubmit={handleSubmit} />
      </div>
    </main>
  );
}
