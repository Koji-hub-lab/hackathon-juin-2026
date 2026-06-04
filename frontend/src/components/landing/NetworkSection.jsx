"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import CameroonRadarMap from "@/components/hud/CameroonRadarMap";
import LandingSection from "./LandingSection";
import SectionHeader from "./SectionHeader";
import { staggerContainer, staggerItem } from "./motionPresets";

function WarehouseCard({ warehouse, hasDanger }) {
  const fill = Math.round((warehouse.stock / warehouse.capacity) * 100);
  return (
    <motion.div
      variants={staggerItem}
      className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-white">{warehouse.city}</p>
          <p className="text-xs text-slate-500">{warehouse.name}</p>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
            hasDanger
              ? "bg-orange-500/20 text-orange-300"
              : fill < 40
                ? "bg-amber-500/20 text-amber-300"
                : "bg-emerald-500/20 text-emerald-300"
          }`}
        >
          {hasDanger ? "Alerte" : fill < 40 ? "Surveillance" : "OK"}
        </span>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Remplissage</span>
          <span className="tabular-nums text-cyan-300">{fill}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
            initial={{ width: 0 }}
            whileInView={{ width: `${fill}%` }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.2 }}
          />
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Stock {warehouse.stock?.toLocaleString("fr-FR")} / {warehouse.capacity?.toLocaleString("fr-FR")}
      </p>
    </motion.div>
  );
}

export default function NetworkSection({ warehouses, alerts }) {
  const listRef = useRef(null);
  const listInView = useInView(listRef, { once: true, amount: 0.15 });
  const dangerIds = new Set(
    alerts.filter((a) => a.level === "danger").map((a) => a.warehouseId)
  );

  return (
    <LandingSection id="network" className="border-t border-cyan-500/10 bg-[#040a18]">
      <SectionHeader
        badge="Réseau"
        title="Quatre hubs. Un seul tableau de bord."
        description="Douala, Yaoundé, Bafoussam et Garoua — cartographie géoréférencée et flux inter-sites en temps réel."
      />

      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="min-h-[360px] overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 p-4 shadow-2xl backdrop-blur-sm lg:min-h-[420px] lg:p-6"
        >
          <CameroonRadarMap warehouses={warehouses} alerts={alerts} />
        </motion.div>

        <motion.div
          ref={listRef}
          variants={staggerContainer}
          initial="hidden"
          animate={listInView ? "visible" : "hidden"}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"
        >
          {warehouses.map((w) => (
            <WarehouseCard
              key={w.id}
              warehouse={w}
              hasDanger={dangerIds.has(w.id)}
            />
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mx-auto mt-12 flex justify-center"
      >
        <Link
          href="/warehouses"
          className="rounded-xl border border-cyan-500/30 px-6 py-3 text-sm font-medium text-cyan-300 transition-transform hover:scale-105 hover:shadow-[0_0_24px_rgba(34,211,238,0.2)]"
        >
          Explorer tous les entrepôts →
        </Link>
      </motion.div>
    </LandingSection>
  );
}
