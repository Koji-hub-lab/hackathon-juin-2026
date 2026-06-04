"use client";

export default function ConnectionBadge({ connected }) {
  if (connected) {
    return (
      <span className="inline-flex items-center gap-2 border border-orange-500/30 bg-orange-500/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.15)]">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-60" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-orange-500" />
        </span>
        Live
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 border border-orange-500/20 bg-black/50 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-neutral-500">
      <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
      Offline
    </span>
  );
}
