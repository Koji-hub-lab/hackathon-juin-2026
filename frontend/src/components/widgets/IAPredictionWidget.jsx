"use client";

import CyberPanel from "@/components/cyber/CyberPanel";

function getStyle(days) {
  if (days <= 2)
    return { bg: "bg-red-500/15", border: "border-red-500/50", icon: "🔴" };
  if (days <= 7)
    return { bg: "bg-orange-500/15", border: "border-orange-500/50", icon: "🟠" };
  if (days <= 14)
    return { bg: "bg-yellow-500/15", border: "border-yellow-500/50", icon: "🟡" };
  return { bg: "bg-emerald-500/15", border: "border-emerald-500/50", icon: "🟢" };
}

export default function IAPredictionWidget({ predictions = [] }) {
  return (
    <CyberPanel className="p-5" glow="emerald">
      <h2 className="mb-4 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text font-mono text-sm font-bold uppercase tracking-wider text-transparent">
        Prédictions IA — Ruptures
      </h2>
      <div className="space-y-3">
        {predictions.length === 0 && (
          <p className="font-mono text-xs text-slate-600">
            Aucune prédiction disponible.
          </p>
        )}
        {predictions.map((p) => {
          const style = getStyle(p.daysUntilRupture);
          return (
            <div
              key={p.warehouseId}
              className={`rounded-lg border p-3 backdrop-blur-sm transition-opacity duration-300 ${style.bg} ${style.border}`}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium text-slate-100">
                  {style.icon} {p.warehouseName}
                </span>
                <span className="font-mono text-[10px] text-slate-500">
                  {p.confidence}%
                </span>
              </div>
              <div className="mb-2 h-1 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-1 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${p.fillPercent}%` }}
                />
              </div>
              <p className="text-sm text-slate-400">{p.recommendation}</p>
              <p className="mt-1 font-mono text-[10px] text-slate-600">
                Rupture {p.daysUntilRupture}j · {p.trend}
              </p>
            </div>
          );
        })}
      </div>
    </CyberPanel>
  );
}
