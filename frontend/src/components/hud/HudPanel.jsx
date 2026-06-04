"use client";

/**
 * Cadre HUD — coins coupés, bordure cyan fine, titre sectoriel.
 */
export default function HudPanel({
  title,
  sector,
  children,
  className = "",
  accent = "cyan",
}) {
  const border =
    accent === "orange"
      ? "border-orange-500/40 shadow-[inset_0_0_30px_rgba(255,120,0,0.06)]"
      : "border-cyan-500/30 shadow-[inset_0_0_30px_rgba(34,211,238,0.05)]";

  const labelColor = accent === "orange" ? "text-orange-400" : "text-cyan-400";

  return (
    <div
      className={`relative border bg-[#030712]/90 backdrop-blur-sm ${border} ${className}`}
      style={{
        clipPath:
          "polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))",
      }}
    >
      <div className="flex items-center justify-between border-b border-dashed border-white/10 px-4 py-2">
        <span className={`font-mono text-[10px] font-bold uppercase tracking-[0.35em] ${labelColor}`}>
          {sector}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600">
          {title}
        </span>
      </div>
      <div className="p-4">{children}</div>
      {/* Coins HUD */}
      <span className={`absolute left-0 top-0 h-3 w-3 border-l border-t ${accent === "orange" ? "border-orange-500/60" : "border-cyan-500/60"}`} />
      <span className={`absolute right-0 top-0 h-3 w-3 border-r border-t ${accent === "orange" ? "border-orange-500/60" : "border-cyan-500/60"}`} />
      <span className={`absolute bottom-0 left-0 h-3 w-3 border-b border-l ${accent === "orange" ? "border-orange-500/60" : "border-cyan-500/60"}`} />
      <span className={`absolute bottom-0 right-0 h-3 w-3 border-b border-r ${accent === "orange" ? "border-orange-500/60" : "border-cyan-500/60"}`} />
    </div>
  );
}
