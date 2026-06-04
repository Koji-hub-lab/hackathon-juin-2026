"use client";

import HudPanel from "./HudPanel";

export default function CentralPowerUnit({ predictions = [], dangerCount = 0 }) {
  const avgConfidence =
    predictions.length > 0
      ? Math.round(
          predictions.reduce((s, p) => s + (p.confidence || 0), 0) /
            predictions.length
        )
      : 87;

  const readiness = Math.max(0, Math.min(100, avgConfidence - dangerCount * 8));
  const status =
    dangerCount >= 2 ? "Dégradé" : dangerCount >= 1 ? "Surveillance" : "Optimal";
  const statusStyle =
    dangerCount >= 2
      ? "text-red-400"
      : dangerCount >= 1
        ? "text-amber-400"
        : "text-emerald-400";

  return (
    <HudPanel
      title="Moteur IA"
      subtitle="Gemini 1.5 Flash · ruptures de stock"
      className="h-full"
    >
      <div className="flex h-full flex-col justify-between gap-5">
        <div>
          <p className="text-xs text-slate-500">État du modèle</p>
          <p className={`mt-1 text-lg font-medium ${statusStyle}`}>{status}</p>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-500">Prêt à décider</span>
            <span className="font-sans text-xl font-semibold tabular-nums tracking-tight text-slate-50">
              {readiness}%
            </span>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500/80 to-emerald-500/80 transition-all duration-500"
              style={{ width: `${readiness}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Alertes critiques actives{" "}
          <span
            className={
              dangerCount > 0
                ? "font-medium text-red-400"
                : "text-slate-400"
            }
          >
            {dangerCount}
          </span>
        </p>
      </div>
    </HudPanel>
  );
}
