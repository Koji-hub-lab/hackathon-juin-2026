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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400">
            Vue d&apos;ensemble des inventaires et prédictions en temps réel
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            connected ? "bg-green-500/20 text-green-300" : "bg-gray-700 text-gray-400"
          }`}
        >
          {connected ? "🟢 Temps réel actif" : "⚪ Déconnecté"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StockCard title="Entrepôts" value={warehouses.length} icon="🏭" />
        <StockCard
          title="Stock total"
          value={totalStock.toLocaleString("fr-FR")}
          subtitle="unités cumulées"
          icon="📦"
          accent="text-green-400"
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
          accent="text-blue-400"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StockBarChart warehouses={warehouses} />
        <TrendLineChart predictions={predictions} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <IAPredictionWidget predictions={predictions} />
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <h2 className="mb-4 text-lg font-bold text-blue-400">
            🚨 Alertes récentes
          </h2>
          <div className="space-y-3">
            {recentAlerts.length === 0 && (
              <p className="text-sm text-gray-500">Aucune alerte.</p>
            )}
            {recentAlerts.map((alert, idx) => (
              <AlertCard key={`${alert.id}-${idx}`} alert={alert} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
