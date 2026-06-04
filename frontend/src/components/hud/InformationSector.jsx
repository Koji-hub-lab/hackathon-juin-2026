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
    <HudPanel
      title="Flux logistique"
      subtitle="Entrées vers les hubs nationaux"
      className="h-full"
    >
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-500">Volume entrant</p>
            <p className="mt-1 font-sans text-2xl font-semibold tabular-nums tracking-tight text-slate-50">
              {inbound}
              <span className="ml-1 text-sm font-normal text-slate-500">
                t/sem
              </span>
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
              connected
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-slate-700 bg-slate-800/50 text-slate-500"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                connected ? "bg-emerald-400" : "bg-slate-600"
              }`}
            />
            {connected ? "Connecté" : "Hors ligne"}
          </span>
        </div>

        <ul className="min-h-0 flex-1 space-y-3 overflow-auto">
          {CORRIDORS.map((c) => (
            <li
              key={c.route}
              className="rounded-lg border border-slate-800/60 bg-slate-950/30 px-3 py-2.5"
            >
              <p className="text-sm text-slate-200">{c.route}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {c.flux} ·{" "}
                <span className="tabular-nums text-slate-400">
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
