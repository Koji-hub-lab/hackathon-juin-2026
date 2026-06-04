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
    <HudPanel sector="Information" title="Flux CM" className="h-full">
      <div className="flex h-full flex-col gap-2">
        <div className="flex items-baseline justify-between border-b border-orange-500/20 pb-2">
          <span className="font-mono text-[10px] text-neutral-500">INBOUND</span>
          <span className="font-mono text-xl font-bold tabular-nums text-neutral-100">
            {inbound}
            <span className="ml-1 text-[10px] font-normal text-neutral-500">
              t/sem
            </span>
          </span>
        </div>
        <p className="font-mono text-[9px] text-neutral-500">
          SYNC{" "}
          <span className={connected ? "text-orange-500" : "text-neutral-600"}>
            {connected ? "LIVE" : "OFFLINE"}
          </span>
        </p>
        <ul className="min-h-0 flex-1 space-y-1.5 overflow-auto">
          {CORRIDORS.map((c) => (
            <li
              key={c.route}
              className="border-l border-orange-500/30 pl-2 font-mono text-[10px]"
            >
              <p className="text-neutral-300">{c.route}</p>
              <p className="text-neutral-500">
                {c.flux} ·{" "}
                <span className="tabular-nums text-neutral-400">
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
