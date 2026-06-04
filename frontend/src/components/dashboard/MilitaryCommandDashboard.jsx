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
import ConnectionBadge from "@/components/premium/ConnectionBadge";
import AlertCard from "@/components/widgets/AlertCard";

function HudMetric({ label, value, unit, variant = "cyan" }) {
  const color = variant === "orange" ? "text-orange-400" : "text-cyan-400";
  return (
    <div className="border border-dashed border-white/10 px-3 py-2">
      <p className="font-mono text-[8px] uppercase tracking-widest text-slate-600">
        {label}
      </p>
      <p className={`font-mono text-xl font-bold tabular-nums ${color}`}>
        {value}
        {unit && (
          <span className="ml-1 text-[10px] font-normal text-slate-600">
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
  const now = new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100">
      {/* Scanlines */}
      <div className="pointer-events-none absolute inset-0 z-0 hud-scanlines opacity-[0.04]" />
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(34,211,238,0.06), transparent 70%)",
        }}
      />

      {/* Barre tactique */}
      <header className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/20 px-6 py-4 lg:px-10">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-cyan-500">
            Supply Chain Radar
          </p>
          <h1 className="mt-1 font-mono text-lg font-bold uppercase tracking-[0.2em] text-white lg:text-xl">
            Military Command · HUD
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="hidden font-mono text-[10px] text-slate-600 sm:block">
            <span className="text-cyan-500/70">UTC+1</span> {now}
          </div>
          <ConnectionBadge connected={connected} />
          <Link
            href="/radar"
            className="border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-300 transition-all hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)]"
          >
            Radar 3D
          </Link>
        </div>
      </header>

      {/* KPI strip */}
      <div className="relative z-10 grid grid-cols-2 gap-2 border-b border-dashed border-white/10 px-4 py-3 sm:grid-cols-4 lg:px-10">
        <HudMetric label="Stock total" value={totalStock.toLocaleString("fr-FR")} unit="u" />
        <HudMetric label="Sites actifs" value={warehouses.length} />
        <HudMetric
          label="Alertes crit."
          value={dangerCount}
          variant="orange"
        />
        <HudMetric
          label="Prédictions"
          value={predictions.length}
          unit="IA"
        />
      </div>

      {/* Grille HUD principale */}
      <div className="relative z-10 grid gap-4 p-4 lg:grid-cols-12 lg:gap-5 lg:p-8">
        {/* Gauche — Information */}
        <div className="lg:col-span-3">
          <InformationSector warehouses={warehouses} connected={connected} />
        </div>

        {/* Centre — Carte radar Cameroun */}
        <div className="lg:col-span-6">
          <HudPanel
            sector="Tactical Map"
            title="Cameroun · Sector Scan"
            className="min-h-[420px]"
          >
            <div className="flex flex-col items-center justify-center py-2">
              <CameroonRadarMap warehouses={warehouses} alerts={alerts} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-dashed border-cyan-500/20 pt-4 font-mono text-[9px] text-slate-600">
              <span>
                <span className="text-cyan-400">●</span> Nœud nominal
              </span>
              <span>
                <span className="text-orange-500 hud-node-alert">●</span> Alerte
                logistique
              </span>
            </div>
          </HudPanel>
        </div>

        {/* Droite — IA Power */}
        <div className="lg:col-span-3">
          <CentralPowerUnit
            predictions={predictions}
            dangerCount={dangerCount}
          />
        </div>

        {/* Bas — Identification + Alertes */}
        <div className="lg:col-span-5">
          <IdentificationSector products={products} />
        </div>

        <div className="lg:col-span-7">
          <HudPanel
            sector="Alert Stream"
            title="Signaux système"
            accent="orange"
          >
            <div className="max-h-52 space-y-2 overflow-y-auto">
              {recentAlerts.length === 0 && (
                <p className="py-6 text-center font-mono text-[10px] text-slate-600">
                  Aucun signal orange actif
                </p>
              )}
              {recentAlerts.map((alert, idx) => (
                <AlertCard key={`${alert.id}-${idx}`} alert={alert} />
              ))}
            </div>
            <Link
              href="/alerts"
              className="mt-3 block text-center font-mono text-[10px] font-bold uppercase tracking-widest text-orange-500/80 hover:text-orange-400"
            >
              Accès journal complet →
            </Link>
          </HudPanel>
        </div>
      </div>

      <footer className="relative z-10 border-t border-dashed border-cyan-500/20 px-8 py-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-slate-700">
          Hackathon J.U.I.N 2026 · Thème 10 · Cockpit logistique Cameroun
        </p>
      </footer>
    </div>
  );
}
