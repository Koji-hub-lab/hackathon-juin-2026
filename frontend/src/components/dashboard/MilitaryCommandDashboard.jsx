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

function HudMetric({ label, value, unit }) {
  return (
    <div className="border border-orange-500/20 bg-black/50 px-3 py-1.5 backdrop-blur-sm">
      <p className="font-mono text-[8px] uppercase tracking-widest text-neutral-500">
        {label}
      </p>
      <p className="font-mono text-lg font-bold tabular-nums text-neutral-100">
        {value}
        {unit && (
          <span className="ml-1 text-[10px] font-normal text-neutral-500">
            {unit}
          </span>
        )}
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
  const recentAlerts = [...liveAlerts, ...alerts].slice(0, 4);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-black p-2">
      <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-4">
        <HudMetric label="Stock" value={totalStock.toLocaleString("fr-FR")} unit="u" />
        <HudMetric label="Sites" value={warehouses.length} />
        <HudMetric label="Critiques" value={dangerCount} />
        <HudMetric label="Prédictions IA" value={predictions.length} />
      </div>

      <div className="mt-2 grid min-h-0 flex-1 grid-cols-1 grid-rows-2 gap-2 lg:grid-cols-12">
        <div className="min-h-0 lg:col-span-3 lg:row-span-1">
          <InformationSector warehouses={warehouses} connected={connected} />
        </div>

        <div className="min-h-0 lg:col-span-6 lg:row-span-1">
          <HudPanel sector="Tactical" title="Cameroun · Radar" className="h-full">
            <CameroonRadarMap warehouses={warehouses} alerts={alerts} />
          </HudPanel>
        </div>

        <div className="min-h-0 lg:col-span-3 lg:row-span-1">
          <CentralPowerUnit predictions={predictions} dangerCount={dangerCount} />
        </div>

        <div className="min-h-0 lg:col-span-5 lg:row-span-1">
          <IdentificationSector products={products} />
        </div>

        <div className="min-h-0 lg:col-span-7 lg:row-span-1">
          <HudPanel sector="Alertes" title="Temps réel" className="h-full">
            <div className="flex h-full min-h-0 flex-col">
              <div className="min-h-0 flex-1 space-y-2 overflow-auto">
                {recentAlerts.length === 0 && (
                  <p className="py-4 text-center font-mono text-[10px] text-neutral-600">
                    Aucun signal
                  </p>
                )}
                {recentAlerts.map((alert, idx) => (
                  <AlertCard key={`${alert.id}-${idx}`} alert={alert} />
                ))}
              </div>
              <Link
                href="/alerts"
                className="mt-2 shrink-0 text-center font-mono text-[10px] font-bold uppercase tracking-wider text-orange-500 hover:text-orange-400"
              >
                Journal →
              </Link>
            </div>
          </HudPanel>
        </div>
      </div>
    </div>
  );
}
