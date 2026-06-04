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
    dangerCount >= 2 ? "DEGRADED" : dangerCount >= 1 ? "CAUTION" : "OPTIMAL";

  return (
    <HudPanel sector="Central Power" title="IA Core" className="h-full">
      <div className="flex h-full flex-col justify-between gap-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">
            Engine
          </p>
          <p className="font-mono text-xs font-bold text-orange-500">
            GEMINI 1.5 FLASH
          </p>
        </div>

        <div className="border border-orange-500/25 bg-orange-500/5 p-2">
          <p className="font-mono text-[9px] text-neutral-500">IA STATUS</p>
          <p className="font-mono text-lg font-black tracking-wider text-neutral-100">
            {status}
          </p>
        </div>

        <div>
          <div className="flex justify-between font-mono text-[10px]">
            <span className="text-neutral-500">READINESS</span>
            <span className="tabular-nums text-orange-500">{readiness}%</span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden bg-neutral-900">
            <div
              className="h-full bg-orange-500"
              style={{ width: `${readiness}%` }}
            />
          </div>
        </div>

        <p className="font-mono text-[9px] text-neutral-500">
          Signaux critiques:{" "}
          <span className="text-orange-500">{dangerCount}</span>
        </p>
      </div>
    </HudPanel>
  );
}
