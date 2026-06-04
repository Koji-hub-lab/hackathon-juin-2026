"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSocket } from "@/hooks/useSocket";
import { getWarehouses } from "@/services/warehouseService";
import { getAlerts } from "@/services/alertService";
import { getPredictions } from "@/services/predictService";
import CubeGridHero from "@/components/CubeGridHero";
import GlassCard from "@/components/premium/GlassCard";
import GlowButton from "@/components/premium/GlowButton";
import ConnectionBadge from "@/components/premium/ConnectionBadge";
import AlertCard from "@/components/widgets/AlertCard";
import StockBarChart from "@/components/charts/StockBarChart";
import TrendLineChart from "@/components/charts/TrendLineChart";

function formatMetric(value) {
  const n = Number(value) || 0;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return n.toLocaleString("fr-FR");
}

function PredictionRow({ p }) {
  const urgent = p.daysUntilRupture <= 7;
  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        urgent
          ? "border-orange-500/40 bg-orange-500/10"
          : "border-white/[0.06] bg-white/[0.02]"
      }`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-semibold text-white">{p.warehouseName}</span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
          {p.confidence}%
        </span>
      </div>
      <p className="mt-2 text-4xl font-black tabular-nums tracking-tight text-orange-500">
        {p.daysUntilRupture}
        <span className="ml-1 text-sm font-bold text-neutral-500">j</span>
      </p>
      <p className="mt-1 text-xs text-neutral-500">{p.recommendation}</p>
      <div className="mt-3 h-px w-full bg-white/[0.06]" />
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-black/40">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400"
          style={{ width: `${Math.min(100, p.fillPercent)}%` }}
        />
      </div>
    </div>
  );
}

export default function CommandDashboard() {
  const [warehouses, setWarehouses] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [liveAlerts, setLiveAlerts] = useState([]);

  const { connected } = useSocket((alert) => {
    setLiveAlerts((prev) => [alert, ...prev].slice(0, 8));
  });

  useEffect(() => {
    getWarehouses().then(setWarehouses);
    getAlerts().then(setAlerts);
    getPredictions().then(setPredictions);
  }, []);

  const totalStock = warehouses.reduce((sum, w) => sum + (w.stock || 0), 0);
  const totalCapacity = warehouses.reduce((sum, w) => sum + (w.capacity || 0), 0);
  const dangerCount = alerts.filter((a) => a.level === "danger").length;
  const recentAlerts = [...liveAlerts, ...alerts].slice(0, 6);
  const fillGlobal =
    totalCapacity > 0 ? Math.round((totalStock / totalCapacity) * 100) : 0;

  return (
    <div className="relative min-h-screen bg-[#050505] text-white">
      {/* Ambiance */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 90% 50% at 100% 0%, rgba(255,92,0,0.18), transparent 55%), radial-gradient(ellipse 60% 40% at 0% 100%, rgba(255,92,0,0.06), transparent 50%)",
        }}
      />

      {/* ——— Hero éditorial asymétrique ——— */}
      <header className="relative z-10 grid border-b border-white/[0.06] lg:grid-cols-12">
        <div className="flex flex-col justify-between px-8 py-12 lg:col-span-5 lg:px-14 lg:py-16 xl:col-span-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.45em] text-orange-500">
              Supply Chain Radar
            </p>
            <ConnectionBadge connected={connected} />
          </div>
          <div className="mt-10">
            <h1 className="text-metric text-5xl font-black leading-[0.88] tracking-tighter sm:text-6xl lg:text-7xl xl:text-8xl">
              CYBER
              <br />
              <span className="text-[#ff5c00]">COMMAND</span>
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-neutral-500">
              Supervision multi-entrepôts, maillage 3D temps réel et ruptures
              prédites par IA — interface de pilotage premium.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <GlowButton href="/alerts">Voir alertes</GlowButton>
            <GlowButton href="/radar" variant="ghost">
              Radar immersif
            </GlowButton>
          </div>
        </div>

        {/* Bloc bicolore orange — métrique héro */}
        <div className="relative flex flex-col justify-between bg-gradient-to-br from-[#ff5c00] via-[#ff6a14] to-[#e84e00] px-8 py-12 lg:col-span-7 lg:px-14 lg:py-16 xl:col-span-8">
          <div className="flex items-start justify-between">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-black/50">
              Stock consolidé
            </p>
            <span className="rounded-full bg-black/20 px-3 py-1 font-mono text-[10px] font-bold text-black/70">
              {warehouses.length} sites
            </span>
          </div>
          <div>
            <p className="text-metric text-7xl font-black tracking-tighter text-black sm:text-8xl lg:text-9xl">
              {formatMetric(totalStock)}
            </p>
            <p className="mt-2 font-mono text-sm font-medium text-black/60">
              unités · remplissage global {fillGlobal}%
            </p>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-6 border-t border-black/15 pt-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-black/45">
                Critiques
              </p>
              <p className="text-metric mt-1 text-4xl font-black text-black">
                {dangerCount}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-black/45">
                Prédictions
              </p>
              <p className="text-metric mt-1 text-4xl font-black text-black">
                {predictions.length}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-black/45">
                Capacité
              </p>
              <p className="text-metric mt-1 text-4xl font-black text-black">
                {formatMetric(totalCapacity)}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="divider-hairline relative z-10" />

      {/* ——— Zone principale : 3D + alertes flottantes ——— */}
      <section className="relative z-10 px-6 py-10 lg:px-12 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="relative lg:col-span-8">
            <CubeGridHero warehouses={warehouses} alerts={alerts} />

            {/* Carte KPI flottante — chevauchement */}
            <GlassCard
              glow
              className="absolute -bottom-6 right-4 z-20 w-[min(100%,280px)] p-5 md:right-8 lg:-bottom-8"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-500">
                Signal IA
              </p>
              <p className="text-metric mt-2 text-5xl font-black text-white">
                {predictions[0]?.daysUntilRupture ?? "—"}
                <span className="text-lg font-bold text-neutral-500">j</span>
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                {predictions[0]?.warehouseName ?? "Analyse en cours"} — rupture
                estimée
              </p>
            </GlassCard>
          </div>

          {/* Fil d'alertes temps réel */}
          <GlassCard className="relative z-10 flex flex-col lg:col-span-4 lg:-mt-6">
            <div className="border-b border-white/[0.06] px-6 py-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-orange-500">
                Live Feed
              </p>
              <h3 className="mt-1 text-xl font-black tracking-tight">
                Alertes temps réel
              </h3>
            </div>
            <div className="max-h-[480px] flex-1 space-y-3 overflow-y-auto p-4 md:p-5">
              {recentAlerts.length === 0 && (
                <p className="px-2 py-8 text-center font-mono text-xs text-neutral-600">
                  Aucun signal actif
                </p>
              )}
              {recentAlerts.map((alert, idx) => (
                <AlertCard key={`${alert.id}-${idx}`} alert={alert} />
              ))}
            </div>
            <div className="border-t border-white/[0.06] p-4">
              <Link
                href="/alerts"
                className="block text-center font-mono text-[11px] font-bold uppercase tracking-widest text-orange-500 transition-colors hover:text-orange-400"
              >
                Tout voir →
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ——— Prédictions IA — bande asymétrique ——— */}
      <section className="relative z-10 border-t border-white/[0.06] bg-[#0a0a0a]">
        <div className="grid lg:grid-cols-12">
          <div className="border-b border-white/[0.06] px-8 py-10 lg:col-span-4 lg:border-b-0 lg:border-r lg:px-12 lg:py-14">
            <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-orange-500">
              Intelligence
            </p>
            <h2 className="text-metric mt-3 text-4xl font-black tracking-tight lg:text-5xl">
              Prédiction
              <br />
              <span className="text-neutral-600">ruptures</span>
            </h2>
            <p className="mt-4 text-sm text-neutral-500">
              Modèle IA sur historique des sorties — fenêtre de rupture par
              entrepôt.
            </p>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-2 lg:p-10 xl:grid-cols-4">
            {predictions.length === 0 && (
              <p className="col-span-full font-mono text-xs text-neutral-600">
                Aucune prédiction chargée.
              </p>
            )}
            {predictions.map((p) => (
              <PredictionRow key={p.warehouseId} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ——— Analytics ——— */}
      <section className="relative z-10 px-6 py-14 lg:px-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-600">
              Analytics
            </p>
            <h2 className="text-3xl font-black tracking-tight">Vue quantitative</h2>
          </div>
          <GlowButton href="/warehouses" variant="ghost" className="!py-2 !text-[11px]">
            Entrepôts
          </GlowButton>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="glass-panel overflow-hidden rounded-2xl p-1">
            <StockBarChart warehouses={warehouses} />
          </div>
          <div className="glass-panel overflow-hidden rounded-2xl p-1">
            <TrendLineChart predictions={predictions} />
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.06] px-8 py-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-neutral-700">
          Hackathon J.U.I.N 2026 · Thème 10 · Supply Chain Radar
        </p>
      </footer>
    </div>
  );
}
