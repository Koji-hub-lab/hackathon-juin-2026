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

  return (
    <HudPanel
      title="Moteur IA"
      subtitle="Gemini 1.5 Flash · ruptures de stock"
      className="h-full"
    >
      <div className="flex h-full flex-col justify-between gap-6">
        <div className="rounded-xl bg-blue-50 px-4 py-3">
          <p className="text-sm text-slate-500">État du modèle</p>
          <p className="mt-1 text-lg font-bold text-blue-700">{status}</p>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-slate-500">Prêt à décider</span>
            <span className="text-3xl font-extrabold tabular-nums text-slate-900">
              {readiness}%
            </span>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${readiness}%` }}
            />
          </div>
        </div>

        <p className="text-sm text-slate-500">
          Alertes critiques{" "}
          <span
            className={
              dangerCount > 0
                ? "font-bold text-red-600"
                : "font-semibold text-slate-700"
            }
          >
            {dangerCount}
          </span>
        </p>
      </div>
    </HudPanel>
  );
}
