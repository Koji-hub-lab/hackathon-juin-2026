"use client";

/**
 * Conteneur carte « holographique » — bordure fine, fond verre, lueur optionnelle.
 */
export default function CyberPanel({
  children,
  className = "",
  glow = "cyan",
  as: Tag = "div",
}) {
  const glowClass =
    glow === "red"
      ? "shadow-[inset_0_0_60px_rgba(239,68,68,0.06),0_0_24px_rgba(239,68,68,0.08)]"
      : glow === "emerald"
        ? "shadow-[inset_0_0_60px_rgba(52,211,153,0.06),0_0_24px_rgba(16,185,129,0.08)]"
        : "shadow-[inset_0_0_60px_rgba(34,211,238,0.05),0_0_24px_rgba(34,211,238,0.07)]";

  return (
    <Tag
      className={`rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-sm ${glowClass} ${className}`}
    >
      {children}
    </Tag>
  );
}
