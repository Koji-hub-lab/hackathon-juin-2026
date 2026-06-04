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

  const readiness = Math.max(
    0,
    Math.min(100, avgConfidence - dangerCount * 8)
  );

  const status =
    dangerCount >= 2 ? "DEGRADED" : dangerCount >= 1 ? "CAUTION" : "OPTIMAL";
  const statusColor =
    status === "OPTIMAL"
      ? "text-cyan-400"
      : status === "CAUTION"
        ? "text-amber-400"
        : "text-orange-500";

  return (
    <HudPanel sector="Central Power Unit" title="IA Core" accent="orange">
      <div className="space-y-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-600">
            Engine
          </p>
          <p className="mt-1 font-mono text-sm font-bold text-orange-400">
            GEMINI 1.5 FLASH
          </p>
        </div>

        <div className="border border-dashed border-orange-500/25 bg-orange-500/5 p-3">
          <p className="font-mono text-[9px] text-slate-500">IA STATUS</p>
          <p className={`mt-1 font-mono text-xl font-black tracking-widest ${statusColor}`}>
            {status}
          </p>
        </div>

        <div>
          <div className="flex justify-between font-mono text-[10px]">
            <span className="text-slate-500">DECISION READINESS</span>
            <span className="tabular-nums text-orange-400">{readiness}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden bg-slate-900">
            <div
              className="h-full bg-gradient-to-r from-orange-600 to-amber-400 transition-all duration-700"
              style={{ width: `${readiness}%` }}
            />
          </div>
        </div>

        <ul className="space-y-1.5 font-mono text-[9px] text-slate-500">
          <li>
            <span className="text-cyan-500/80">▸</span> Inférence rupture stock
          </li>
          <li>
            <span className="text-cyan-500/80">▸</span> Latence &lt; 120ms
          </li>
          <li>
            <span className="text-orange-500/80">▸</span> Signaux critiques:{" "}
            <span className="text-orange-400">{dangerCount}</span>
          </li>
        </ul>
      </div>
    </HudPanel>
  );
}
