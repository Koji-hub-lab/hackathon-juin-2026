"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSocket } from "@/hooks/useSocket";
import { getWarehouses } from "@/services/warehouseService";
import { getAlerts } from "@/services/alertService";
import { getPredictions } from "@/services/predictService";
import { getProducts } from "@/services/productService";
import CameroonRadarMap from "@/components/hud/CameroonRadarMap";
import InformationSector from "@/components/hud/InformationSector";
import IdentificationSector from "@/components/hud/IdentificationSector";
import CentralPowerUnit from "@/components/hud/CentralPowerUnit";
import HudPanel from "@/components/hud/HudPanel";
import AlertCard from "@/components/widgets/AlertCard";

function KpiCard({ label, value, highlight }) {
  return (
    <div className="rounded-xl border border-white/5 bg-slate-900/40 px-5 py-4 backdrop-blur-md">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p
        className={`mt-1 font-sans text-3xl font-semibold tabular-nums tracking-tight ${
          highlight === "danger"
            ? "text-red-400"
            : highlight === "warn"
              ? "text-amber-400"
              : "text-slate-50"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default function MilitaryCommandDashboard() {
  const [warehouses, setWarehouses] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [products, setProducts] = useState([]);
  const [liveAlerts, setLiveAlerts] = useState([]);

  const { connected } = useSocket((alert) => {
    setLiveAlerts((prev) => [alert, ...prev].slice(0, 5));
  });

  useEffect(() => {
    getWarehouses().then(setWarehouses);
    getAlerts().then(setAlerts);
    getPredictions().then(setPredictions);
    getProducts().then(setProducts);
  }, []);

  const totalStock = warehouses.reduce((s, w) => s + (w.stock || 0), 0);
  const dangerCount = alerts.filter((a) => a.level === "danger").length;
  const recentAlerts = [...liveAlerts, ...alerts].slice(0, 5);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#080b11] p-4 lg:p-6">
      <div className="grid shrink-0 grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard
          label="Stock total"
          value={totalStock.toLocaleString("fr-FR")}
        />
        <KpiCard label="Entrepôts actifs" value={warehouses.length} />
        <KpiCard
          label="Alertes critiques"
          value={dangerCount}
          highlight={dangerCount > 0 ? "danger" : undefined}
        />
        <KpiCard label="Prédictions IA" value={predictions.length} />
      </div>

      <div className="mt-5 grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-12 lg:grid-rows-2">
        <div className="min-h-0 lg:col-span-3">
          <InformationSector warehouses={warehouses} connected={connected} />
        </div>

        <div className="min-h-0 lg:col-span-6">
          <HudPanel
            title="Cartographie radar"
            subtitle="Réseau national · Douala, Yaoundé, Bafoussam, Garoua"
            className="h-full"
            noPadding
          >
            <div className="flex h-full min-h-[220px] items-center justify-center p-4">
              <CameroonRadarMap warehouses={warehouses} alerts={alerts} />
            </div>
          </HudPanel>
        </div>

        <div className="min-h-0 lg:col-span-3">
          <CentralPowerUnit
            predictions={predictions}
            dangerCount={dangerCount}
          />
        </div>

        <div className="min-h-0 lg:col-span-5">
          <IdentificationSector products={products} />
        </div>

        <div className="min-h-0 lg:col-span-7">
          <HudPanel title="Alertes récentes" subtitle="Temps réel" className="h-full">
            <div className="flex h-full min-h-0 flex-col gap-3">
              <ul className="min-h-0 flex-1 space-y-2 overflow-auto">
                {recentAlerts.length === 0 && (
                  <li className="py-8 text-center text-sm text-slate-500">
                    Aucune alerte pour le moment
                  </li>
                )}
                {recentAlerts.map((alert, idx) => (
                  <li key={`${alert.id}-${idx}`}>
                    <AlertCard alert={alert} />
                  </li>
                ))}
              </ul>
              <Link
                href="/alerts"
                className="text-center text-sm text-slate-500 transition-colors hover:text-slate-300"
              >
                Voir toutes les alertes →
              </Link>
            </div>
          </HudPanel>
        </div>
      </div>
    </div>
  );
}
