"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TYPES = {
  delivery: { label: "Nouvelle livraison", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  stock: { label: "Nouveau stock", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  alert: { label: "Nouvelle alerte", color: "text-orange-400", bg: "bg-orange-500/10" },
  ws: { label: "WebSocket", color: "text-blue-400", bg: "bg-blue-500/10" },
};

let idSeq = 0;

export default function RealtimeFluxPanel({ connected, liveAlert }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents((prev) => {
      const next = [
        {
          id: ++idSeq,
          type: connected ? "ws" : "ws",
          text: connected ? "Connexion WebSocket établie" : "WebSocket en attente…",
        },
        ...prev,
      ].slice(0, 10);
      return next;
    });
  }, [connected]);

  useEffect(() => {
    if (!liveAlert) return;
    setEvents((prev) =>
      [
        {
          id: ++idSeq,
          type: "alert",
          text: liveAlert.message || "Alerte système",
        },
        ...prev,
      ].slice(0, 10)
    );
  }, [liveAlert]);

  useEffect(() => {
    const samples = [
      { type: "delivery", text: "Livraison Douala — 120 t ciment" },
      { type: "stock", text: "Réception stock Yaoundé +45 palettes" },
      { type: "stock", text: "Inventaire Garoua synchronisé" },
    ];
    let i = 0;
    const t = setInterval(() => {
      const s = samples[i % samples.length];
      setEvents((prev) => [{ id: ++idSeq, ...s }, ...prev].slice(0, 10));
      i += 1;
    }, 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.aside
      className="absolute right-3 top-20 z-30 flex w-[min(100%,17rem)] flex-col rounded-2xl border border-cyan-500/20 bg-slate-900/40 p-4 shadow-xl backdrop-blur-[20px] lg:right-6"
      style={{ maxHeight: "calc(100vh - 6rem)" }}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
    >
      <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
        Flux temps réel
      </h3>
      <ul className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto">
        <AnimatePresence initial={false} mode="popLayout">
          {events.map((ev) => {
            const meta = TYPES[ev.type] || TYPES.stock;
            return (
              <motion.li
                key={ev.id}
                layout
                initial={{ opacity: 0, x: 48, filter: "brightness(1.8)" }}
                animate={{ opacity: 1, x: 0, filter: "brightness(1)" }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className={`rounded-lg border border-white/5 px-3 py-2 text-xs ${meta.bg}`}
              >
                <span className={`font-semibold ${meta.color}`}>{meta.label}</span>
                <p className="mt-1 text-slate-300">{ev.text}</p>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </motion.aside>
  );
}
