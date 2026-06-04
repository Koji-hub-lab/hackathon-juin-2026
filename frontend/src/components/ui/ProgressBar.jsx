"use client";

// Couleur selon le taux de remplissage : rouge < 25%, orange < 50%, vert sinon.
function fillColor(percent) {
  if (percent < 25) return "bg-red-500";
  if (percent < 50) return "bg-orange-500";
  return "bg-green-500";
}

export default function ProgressBar({ percent = 0, showLabel = true }) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div className="w-full">
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${fillColor(clamped)}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-right text-xs text-gray-400">{clamped}%</p>
      )}
    </div>
  );
}
