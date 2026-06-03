"use client";

export default function Navbar({ connected }) {
  return (
    <header className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-6 py-3">
      <h1 className="text-base font-semibold text-white">
        Superviseur Multi-entrepôts
      </h1>
      <div className="flex items-center gap-4">
        {typeof connected === "boolean" && (
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
              connected ? "bg-green-500/20 text-green-300" : "bg-gray-700 text-gray-400"
            }`}
          >
            {connected ? "🟢 Temps réel actif" : "⚪ Déconnecté"}
          </span>
        )}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/30 text-xs font-bold text-blue-200">
          MO
        </div>
      </div>
    </header>
  );
}
