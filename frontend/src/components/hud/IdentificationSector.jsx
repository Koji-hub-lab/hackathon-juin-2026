"use client";

import { useMemo } from "react";
import HudPanel from "./HudPanel";

/** Onde sinusoïdale simulée (trafic ciment). */
function Waveform({ className = "" }) {
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
      className={`w-full ${className}`}
      preserveAspectRatio="none"
    >
      <path
        d={path}
        fill="none"
        stroke="rgba(34,211,238,0.7)"
        strokeWidth="1"
        className="hud-wave-dash"
      />
      <path
        d={path}
        fill="none"
        stroke="rgba(255,120,0,0.35)"
        strokeWidth="0.5"
        transform="translate(0, 4)"
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
    <HudPanel sector="Search Sistem" title="Identification · Trafic BTP">
      <p className="mb-3 font-mono text-[9px] uppercase tracking-widest text-slate-600">
        Ciment & matériaux · temps réel
      </p>
      <Waveform />
      <div className="mt-4 flex h-24 items-end justify-between gap-1 border-t border-dashed border-cyan-500/20 pt-3">
        {bars.length === 0 &&
          Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="w-full max-w-[14px] bg-cyan-500/20"
              style={{ height: `${30 + i * 8}%` }}
            />
          ))}
        {bars.map((b) => (
          <div key={b.label} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`w-full max-w-[12px] transition-all ${
                b.alert
                  ? "bg-orange-500 hud-bar-pulse"
                  : "bg-cyan-500/70"
              }`}
              style={{ height: `${Math.max(8, b.h)}%` }}
            />
            <span className="truncate font-mono text-[7px] text-slate-600">
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </HudPanel>
  );
}
