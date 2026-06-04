"use client";

import { useMemo } from "react";
import HudPanel from "./HudPanel";

function TrafficChart({ bars }) {
  const path = useMemo(() => {
    const pts = [];
    const w = 200;
    const h = 50;
    for (let i = 0; i <= 20; i++) {
      const x = (i / 20) * w;
      const y = h - 8 - Math.sin(i * 0.55) * 14 - Math.cos(i * 0.2) * 6;
      pts.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
    }
    return `${pts.join(" ")} L ${w} ${h} L 0 ${h} Z`;
  }, []);

  const linePath = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 20; i++) {
      const x = (i / 20) * 200;
      const y = 42 - Math.sin(i * 0.55) * 14 - Math.cos(i * 0.2) * 6;
      pts.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
    }
    return pts.join(" ");
  }, []);

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 200 50" className="h-24 w-full" preserveAspectRatio="none">
        <path d={path} fill="rgba(37,99,235,0.12)" />
        <path
          d={linePath}
          fill="none"
          stroke="#2563eb"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="flex h-28 items-end justify-between gap-2">
        {bars.length === 0 &&
          [40, 55, 48, 70, 62, 80, 58].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-lg bg-blue-200"
              style={{ height: `${h}%` }}
            />
          ))}
        {bars.map((b) => (
          <div key={b.label} className="flex flex-1 flex-col items-center gap-2">
            <div
              className={`w-full max-w-[28px] rounded-lg ${
                b.alert ? "bg-red-400" : "bg-blue-600"
              }`}
              style={{ height: `${Math.max(12, b.h)}%` }}
            />
            <span className="truncate text-xs text-slate-500">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function IdentificationSector({ products = [] }) {
  const bars = useMemo(() => {
    const cement = products.filter((p) =>
      /ciment|plâtre|gravier|fer/i.test(p.name || "")
    );
    const list = cement.length ? cement : products.slice(0, 7);
    const max = Math.max(...list.map((p) => p.quantity || 1), 1);
    return list.map((p) => ({
      label: (p.name || "").split(" ")[0],
      h: Math.round(((p.quantity || 0) / max) * 100),
      alert: (p.quantity || 0) < (p.minThreshold || 0),
    }));
  }, [products]);

  return (
    <HudPanel
      title="Analytique trafic"
      subtitle="Ciment & BTP · tendance horaire"
      className="h-full"
    >
      <TrafficChart bars={bars} />
    </HudPanel>
  );
}
