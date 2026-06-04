"use client";

import HudPanel from "./HudPanel";

const CORRIDORS = [
  { route: "Atlantique → Douala", flux: "Ciment / fer", load: 84, unit: "t/j" },
  { route: "CEMAC → Yaoundé", flux: "Marchandises", load: 62, unit: "t/j" },
  { route: "Ouest → Bafoussam", flux: "Agro / BTP", load: 41, unit: "t/j" },
  { route: "Extrême-Nord → Garoua", flux: "Logistique", load: 58, unit: "t/j" },
];

export default function InformationSector({ warehouses = [], connected }) {
  const inbound = warehouses.reduce((s, w) => s + (w.weeklyUsage || 0), 0);

  return (
    <HudPanel sector="Information" title="Flux inter-régionaux">
      <div className="space-y-3">
        <div className="flex items-baseline justify-between border-b border-dashed border-cyan-500/20 pb-2">
          <span className="font-mono text-[10px] text-slate-500">INBOUND CM</span>
          <span className="font-mono text-2xl font-bold tabular-nums text-cyan-400">
            {inbound}
            <span className="ml-1 text-xs text-slate-600">t/sem</span>
          </span>
        </div>
        <p className="font-mono text-[9px] leading-relaxed text-slate-600">
          Corridors actifs vers hubs nationaux · sync{" "}
          <span className={connected ? "text-cyan-400" : "text-orange-500"}>
            {connected ? "LIVE" : "OFFLINE"}
          </span>
        </p>
        <ul className="space-y-2">
          {CORRIDORS.map((c) => (
            <li
              key={c.route}
              className="border-l border-cyan-500/30 pl-3 font-mono text-[10px]"
            >
              <p className="text-cyan-300/90">{c.route}</p>
              <p className="text-slate-500">
                {c.flux} ·{" "}
                <span className="tabular-nums text-slate-300">
                  {c.load} {c.unit}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </HudPanel>
  );
}
