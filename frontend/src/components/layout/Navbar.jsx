"use client";

import ConnectionBadge from "@/components/cyber/ConnectionBadge";
import { useSocket } from "@/hooks/useSocket";

export default function Navbar() {
  const { connected } = useSocket();

  return (
    <header className="flex items-center justify-between border-b border-slate-800/90 bg-slate-950/70 px-6 py-3.5 backdrop-blur-xl">
      <div>
        <h1 className="text-base font-semibold tracking-tight text-slate-100">
          Superviseur Multi-entrepôts
        </h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
          Supply Chain Cyber Command
        </p>
      </div>
      <div className="flex items-center gap-4">
        <ConnectionBadge connected={connected} />
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-500/30 bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 font-mono text-xs font-bold text-cyan-200 shadow-[0_0_16px_rgba(34,211,238,0.15)]">
          MO
        </div>
      </div>
    </header>
  );
}
