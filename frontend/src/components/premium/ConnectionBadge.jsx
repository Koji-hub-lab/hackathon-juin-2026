"use client";

export default function ConnectionBadge({ connected }) {
  if (connected) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        En ligne
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1 text-xs text-slate-500">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
      Hors ligne
    </span>
  );
}
