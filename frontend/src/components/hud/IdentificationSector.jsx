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
    <svg viewBox="0 0 200 60" className="h-12 w-full shrink-0" preserveAspectRatio="none">
      <path
        d={path}
        fill="none"
        stroke="rgba(249,115,22,0.6)"
        strokeWidth="1"
        className="hud-wave-dash"
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
    <HudPanel sector="Search Sistem" title="Trafic BTP" className="h-full">
      <Waveform />
      <div className="mt-2 flex min-h-0 flex-1 items-end justify-between gap-1 border-t border-orange-500/20 pt-2">
        {bars.length === 0 &&
          Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="w-full max-w-[12px] bg-orange-500/20"
              style={{ height: `${30 + i * 8}%` }}
            />
          ))}
        {bars.map((b) => (
          <div key={b.label} className="flex flex-1 flex-col items-center gap-0.5">
            <div
              className={`w-full max-w-[10px] ${
                b.alert ? "bg-orange-500 hud-bar-pulse" : "bg-orange-500/50"
              }`}
              style={{ height: `${Math.max(8, b.h)}%` }}
            />
            <span className="truncate font-mono text-[7px] text-neutral-600">
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </HudPanel>
  );
}
