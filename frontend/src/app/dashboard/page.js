"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { getWarehouses } from "@/services/warehouseService";
import { getAlerts } from "@/services/alertService";
import { getPredictions } from "@/services/predictService";
import StockCard from "@/components/widgets/StockCard";
import AlertCard from "@/components/widgets/AlertCard";
import IAPredictionWidget from "@/components/widgets/IAPredictionWidget";
import StockBarChart from "@/components/charts/StockBarChart";
import TrendLineChart from "@/components/charts/TrendLineChart";
import CubeGridHero from "@/components/CubeGridHero";
import ConnectionBadge from "@/components/cyber/ConnectionBadge";
import CyberPanel from "@/components/cyber/CyberPanel";

export default function DashboardPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [liveAlerts, setLiveAlerts] = useState([]);

  const { connected } = useSocket((alert) => {
    setLiveAlerts((prev) => [alert, ...prev].slice(0, 5));
  });

  useEffect(() => {
    getWarehouses().then(setWarehouses);
    getAlerts().then(setAlerts);
    getPredictions().then(setPredictions);
  }, []);

  const totalStock = warehouses.reduce((sum, w) => sum + (w.stock || 0), 0);
  const dangerCount = alerts.filter((a) => a.level === "danger").length;
  const recentAlerts = [...liveAlerts, ...alerts].slice(0, 5);

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-500/80">
            Tableau de bord
          </p>
          <h1 className="mt-1 bg-gradient-to-r from-white via-cyan-100 to-emerald-200 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            Vue d&apos;ensemble des inventaires et prédictions — maillage 3D réactif au
            scroll
          </p>
        </div>
        <ConnectionBadge connected={connected} />
      </div>

      <CubeGridHero warehouses={warehouses} alerts={alerts} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StockCard title="Entrepôts" value={warehouses.length} icon="🏭" />
        <StockCard
          title="Stock total"
          value={totalStock.toLocaleString("fr-FR")}
          subtitle="unités cumulées"
          icon="📦"
          accent="text-emerald-400"
        />
        <StockCard
          title="Alertes critiques"
          value={dangerCount}
          icon="🚨"
          accent="text-red-400"
        />
        <StockCard
          title="Prédictions IA"
          value={predictions.length}
          icon="🤖"
          accent="text-cyan-400"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StockBarChart warehouses={warehouses} />
        <TrendLineChart predictions={predictions} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <IAPredictionWidget predictions={predictions} />
        <CyberPanel className="p-5" glow="red">
          <h2 className="mb-4 bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text font-mono text-sm font-bold uppercase tracking-wider text-transparent">
            Alertes récentes
          </h2>
          <div className="space-y-3">
            {recentAlerts.length === 0 && (
              <p className="font-mono text-xs text-slate-600">Aucune alerte.</p>
            )}
            {recentAlerts.map((alert, idx) => (
              <AlertCard key={`${alert.id}-${idx}`} alert={alert} />
            ))}
          </div>
        </CyberPanel>
      </div>
    </div>
  );
}
