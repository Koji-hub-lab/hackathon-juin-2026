"use client";

export default function HudPanel({ title, sector, children, className = "" }) {
  return (
    <div
      className={`flex h-full min-h-0 flex-col overflow-hidden rounded-sm border border-orange-500/20 bg-black/50 shadow-[0_0_24px_rgba(249,115,22,0.08)] backdrop-blur-sm ${className}`}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-orange-500/20 px-3 py-1.5">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-orange-500">
          {sector}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">
          {title}
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-3">{children}</div>
    </div>
  );
}
