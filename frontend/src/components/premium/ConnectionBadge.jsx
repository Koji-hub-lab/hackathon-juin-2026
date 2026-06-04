"use client";

export default function ConnectionBadge({ connected }) {
  if (connected) {
    return (
      <span className="inline-flex items-center gap-2.5 rounded-full border border-orange-500/50 bg-orange-500/15 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-widest text-orange-300 glow-orange">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-70" />
          <span className="relative h-2 w-2 rounded-full bg-orange-500" />
        </span>
        Live
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-widest text-neutral-500">
      <span className="h-2 w-2 rounded-full bg-neutral-600" />
      Offline
    </span>
  );
}
