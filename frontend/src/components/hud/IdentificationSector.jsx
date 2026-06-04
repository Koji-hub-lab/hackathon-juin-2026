"use client";

import { useMemo } from "react";
import HudPanel from "./HudPanel";

function Waveform() {
  const path = useMemo(() => {
    const pts = [];
    for (let x = 0; x <= 200; x += 4) {
      const y = 30 + Math.sin(x * 0.08) * 18 + Math.sin(x * 0.02) * 8;
      pts.push(`${x === 0 ? "M" : "L"} ${x} ${y}`);
    }
    return pts.join(" ");
  }, []);

  return (
    <svg
      viewBox="0 0 200 60"
      className="h-14 w-full shrink-0 opacity-80"
      preserveAspectRatio="none"
    >
      <path
        d={path}
        fill="none"
        stroke="rgba(34,211,238,0.35)"
        strokeWidth="1"
      />
    </svg>
  );
}

export default function IdentificationSector({ products = [] }) {
  const bars = useMemo(() => {
    const cement = products.filter((p) =>
      /ciment|plâtre|gravier|fer/i.test(p.name || "")
    );
    const list = cement.length ? cement : products.slice(0, 6);
    const max = Math.max(...list.map((p) => p.quantity || 1), 1);
    return list.map((p) => ({
      label: (p.name || "").split(" ")[0],
      h: Math.round(((p.quantity || 0) / max) * 100),
      alert: (p.quantity || 0) < (p.minThreshold || 0),
    }));
  }, [products]);

  return (
    <HudPanel
      title="Trafic matériaux"
      subtitle="Ciment & BTP · flux horaire"
      className="h-full"
    >
      <Waveform />
      <div className="mt-4 flex min-h-0 flex-1 items-end justify-between gap-2 border-t border-slate-800/60 pt-4">
        {bars.length === 0 &&
          Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="w-full max-w-3 rounded-sm bg-slate-700/40"
              style={{ height: `${30 + i * 8}%` }}
            />
          ))}
        {bars.map((b) => (
          <div key={b.label} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className={`w-full max-w-3 rounded-sm ${
                b.alert ? "bg-red-500/70" : "bg-cyan-500/40"
              }`}
              style={{ height: `${Math.max(10, b.h)}%` }}
            />
            <span className="truncate text-[10px] text-slate-500">
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </HudPanel>
  );
}
