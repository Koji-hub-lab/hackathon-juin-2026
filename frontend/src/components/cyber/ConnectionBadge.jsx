"use client";

export default function ConnectionBadge({ connected }) {
  if (connected) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 font-mono text-xs font-semibold tracking-wide text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.25)]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        TEMPS RÉEL
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-600/60 bg-slate-800/60 px-3 py-1.5 font-mono text-xs font-medium tracking-wide text-slate-400">
      <span className="h-2 w-2 rounded-full bg-slate-500 ring-2 ring-slate-600/80" />
      DÉCONNECTÉ
    </span>
  );
}
