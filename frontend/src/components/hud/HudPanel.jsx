"use client";

/** Carte surface type Linear / Vercel — bordure fine, verre léger. */
export default function HudPanel({ title, subtitle, children, className = "", noPadding = false }) {
  return (
    <div
      className={`flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-white/5 bg-slate-900/40 shadow-sm backdrop-blur-md ${className}`}
    >
      <div className="shrink-0 border-b border-slate-800/60 px-5 py-4">
        <h3 className="text-sm font-medium tracking-tight text-slate-50">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        )}
      </div>
      <div className={`min-h-0 flex-1 overflow-auto ${noPadding ? "" : "p-5"}`}>
        {children}
      </div>
    </div>
  );
}
