"use client";

import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-8">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-6 space-y-4">
        <h1 className="text-2xl font-bold">Admin</h1>

        <p className="text-zinc-300">
          La version publique est en ligne. La partie admin complete sera
          reconnectee proprement juste apres.
        </p>

        <Link
          href="/admin/dashboard"
          className="block w-full rounded-xl bg-emerald-600 p-3 text-center hover:bg-emerald-500"
        >
          Ouvrir le dashboard
        </Link>
      </div>
    </main>
  );
}
