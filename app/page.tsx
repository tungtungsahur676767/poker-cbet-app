"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-6 text-center">
        <h1 className="text-4xl font-bold">Poker C-Bet Trainer</h1>
        <p className="text-zinc-400">
          Choisis un spot, puis selectionne un flop pour voir la strategie.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/flop?spot=SRP" className="rounded-2xl bg-zinc-800 p-6 hover:bg-zinc-700">
            SRP
          </Link>
          <Link href="/flop?spot=BET3" className="rounded-2xl bg-zinc-800 p-6 hover:bg-zinc-700">
            3BET
          </Link>
          <Link href="/flop?spot=BET4" className="rounded-2xl bg-zinc-800 p-6 hover:bg-zinc-700">
            4BET
          </Link>
          <Link href="/admin/login" className="rounded-2xl bg-emerald-700 p-6 hover:bg-emerald-600">
            Admin
          </Link>
        </div>
      </div>
    </main>
  );
}
