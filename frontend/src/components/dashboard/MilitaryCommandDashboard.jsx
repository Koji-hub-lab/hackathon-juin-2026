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

function KpiCard({ label, value, featured, danger }) {
  if (featured) {
    return (
      <div className="rounded-2xl bg-blue-600 p-6 shadow-md">
        <p className="text-sm font-medium text-blue-100">{label}</p>
        <p className="mt-2 text-4xl font-extrabold tabular-nums tracking-tight text-white">
          {value}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-md">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p
        className={`mt-2 text-4xl font-extrabold tabular-nums tracking-tight ${
          danger ? "text-red-600" : "text-slate-900"
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
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-slate-50">
      <div className="shrink-0 px-6 pb-2 pt-2 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="mt-1 text-sm text-slate-500">
          Supervision des stocks et alertes en temps réel
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden px-6 pb-6 lg:px-8 lg:pb-8">
        <div className="grid shrink-0 grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          <KpiCard
            label="Stock total"
            value={totalStock.toLocaleString("fr-FR")}
            featured
          />
          <KpiCard label="Entrepôts actifs" value={warehouses.length} />
          <KpiCard
            label="Alertes critiques"
            value={dangerCount}
            danger={dangerCount > 0}
          />
          <KpiCard label="Prédictions IA" value={predictions.length} />
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-12 lg:grid-rows-2">
          <div className="min-h-0 lg:col-span-3">
            <InformationSector warehouses={warehouses} connected={connected} />
          </div>

          <div className="min-h-0 lg:col-span-6">
            <HudPanel
              title="Cartographie radar"
              subtitle="Douala · Yaoundé · Bafoussam · Garoua"
              className="h-full"
              noPadding
            >
              <div className="flex h-full min-h-[200px] items-center justify-center p-6">
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
              <div className="flex h-full min-h-0 flex-col">
                <ul className="min-h-0 flex-1 divide-y divide-slate-100 overflow-auto">
                  {recentAlerts.length === 0 && (
                    <li className="py-10 text-center text-sm text-slate-500">
                      Aucune alerte pour le moment
                    </li>
                  )}
                  {recentAlerts.map((alert, idx) => (
                    <li key={`${alert.id}-${idx}`} className="py-1">
                      <AlertCard alert={alert} />
                    </li>
                  ))}
                </ul>
                <Link
                  href="/alerts"
                  className="mt-4 text-center text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Voir toutes les alertes →
                </Link>
              </div>
            </HudPanel>
          </div>
        </div>
      </div>
    </div>
  );
}
