"use client";

import CyberPanel from "@/components/cyber/CyberPanel";

const GLOW_MAP = {
  "text-green-400": "emerald",
  "text-red-400": "red",
  "text-blue-400": "cyan",
  "text-cyan-400": "cyan",
};

export default function StockCard({
  title,
  value,
  subtitle,
  icon,
  accent = "text-cyan-400",
}) {
  const glow = GLOW_MAP[accent] || "cyan";

  return (
    <CyberPanel className="p-5" glow={glow}>
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
          {title}
        </p>
        {icon && (
          <span className="text-lg opacity-80" aria-hidden>
            {icon}
          </span>
        )}
      </div>
      <p
        className={`mt-3 font-mono text-4xl font-bold tabular-nums tracking-tight ${accent} drop-shadow-[0_0_12px_rgba(34,211,238,0.15)]`}
      >
        {value}
      </p>
      {subtitle && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-slate-600">
          {subtitle}
        </p>
      )}
    </CyberPanel>
  );
}
