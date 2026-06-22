"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async () => {
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      setError("Mot de passe invalide");
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-8">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-6 space-y-4">
        <h1 className="text-2xl font-bold">Connexion Admin</h1>

        <input
          type="password"
          className="w-full rounded-xl bg-zinc-800 p-3"
          placeholder="Mot de passe admin"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-400">{error}</p>}

        <button
          onClick={submit}
          className="w-full rounded-xl bg-emerald-600 p-3 hover:bg-emerald-500"
        >
          Se connecter
        </button>
      </div>
    </main>
  );
}
