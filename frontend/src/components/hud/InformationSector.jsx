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
      <div className="flex h-full flex-col gap-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-slate-500">Volume entrant</p>
            <p className="mt-1 text-3xl font-extrabold tabular-nums tracking-tight text-slate-900">
              {inbound}
              <span className="ml-1 text-base font-semibold text-slate-500">
                t/sem
              </span>
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
              connected
                ? "bg-blue-50 text-blue-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                connected ? "bg-blue-600" : "bg-slate-400"
              }`}
            />
            {connected ? "Connecté" : "Hors ligne"}
          </span>
        </div>

        <ul className="min-h-0 flex-1 space-y-3 overflow-auto">
          {CORRIDORS.map((c) => (
            <li
              key={c.route}
              className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
            >
              <p className="text-sm font-medium text-slate-900">{c.route}</p>
              <p className="mt-0.5 text-sm text-slate-500">
                {c.flux} ·{" "}
                <span className="font-medium text-slate-700">
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
