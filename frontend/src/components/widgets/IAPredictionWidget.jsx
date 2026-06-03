"use client";

// Widget bonus IA (+3 pts) : affiche les prédictions de rupture de stock.
function getStyle(days) {
  if (days <= 2) return { bg: "bg-red-500/20", border: "border-red-500", icon: "🔴" };
  if (days <= 7) return { bg: "bg-orange-500/20", border: "border-orange-500", icon: "🟠" };
  if (days <= 14) return { bg: "bg-yellow-500/20", border: "border-yellow-500", icon: "🟡" };
  return { bg: "bg-green-500/20", border: "border-green-500", icon: "🟢" };
}

export default function IAPredictionWidget({ predictions = [] }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
      <h2 className="mb-4 text-lg font-bold text-blue-400">
        🤖 Prédictions IA — Ruptures de stock
      </h2>
      <div className="space-y-3">
        {predictions.length === 0 && (
          <p className="text-sm text-gray-500">Aucune prédiction disponible.</p>
        )}
        {predictions.map((p) => {
          const style = getStyle(p.daysUntilRupture);
          return (
            <div
              key={p.warehouseId}
              className={`rounded-lg border p-3 transition-opacity duration-300 ${style.bg} ${style.border}`}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="font-semibold text-white">
                  {style.icon} {p.warehouseName}
                </span>
                <span className="text-xs text-gray-400">
                  Confiance : {p.confidence}%
                </span>
              </div>
              <div className="mb-2 h-1.5 w-full rounded-full bg-gray-700">
                <div
                  className="h-1.5 rounded-full bg-blue-400 transition-all duration-500"
                  style={{ width: `${p.fillPercent}%` }}
                />
              </div>
              <p className="text-sm text-gray-300">{p.recommendation}</p>
              <p className="mt-1 text-xs text-gray-500">
                Rupture dans {p.daysUntilRupture} jours · Tendance : {p.trend}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
