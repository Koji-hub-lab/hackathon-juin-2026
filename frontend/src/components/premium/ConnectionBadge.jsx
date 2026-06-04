"use client";

export default function ConnectionBadge({ connected }) {
  if (connected) {
    return (
      <span className="inline-flex items-center gap-2 rounded border border-cyan-500/50 bg-cyan-500/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.2)]">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-70" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-cyan-400" />
        </span>
        Link Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded border border-orange-500/40 bg-orange-500/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-orange-400">
      <span className="h-1.5 w-1.5 rounded-full bg-orange-500 hud-node-alert" />
      Signal Lost
    </span>
  );
}
