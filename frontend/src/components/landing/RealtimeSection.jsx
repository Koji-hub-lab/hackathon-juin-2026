"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef } from "react";
import LandingSection from "./LandingSection";
import SectionHeader from "./SectionHeader";
import { staggerItem } from "./motionPresets";

const TYPES = {
  delivery: { label: "Livraison", color: "text-emerald-400", dot: "bg-emerald-400" },
  stock: { label: "Stock", color: "text-cyan-400", dot: "bg-cyan-400" },
  alert: { label: "Alerte", color: "text-orange-400", dot: "bg-orange-400" },
  ws: { label: "WebSocket", color: "text-blue-400", dot: "bg-blue-400" },
};

let idSeq = 0;

export default function RealtimeSection({ connected, liveAlert }) {
  const [events, setEvents] = useState([]);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    setEvents((prev) =>
      [
        {
          id: ++idSeq,
          type: "ws",
          text: connected ? "Pipeline WebSocket actif" : "Connexion en cours…",
        },
        ...prev,
      ].slice(0, 10)
    );
  }, [connected]);

  useEffect(() => {
    if (!liveAlert) return;
    setEvents((prev) =>
      [
        {
          id: ++idSeq,
          type: "alert",
          text: liveAlert.message || "Nouvelle alerte",
        },
        ...prev,
      ].slice(0, 10)
    );
  }, [liveAlert]);

  useEffect(() => {
    const samples = [
      { type: "delivery", text: "Douala → livraison ciment 120 t confirmée" },
      { type: "stock", text: "Yaoundé — +45 palettes carrelage" },
      { type: "alert", text: "Bafoussam sous seuil critique plâtre" },
    ];
    let i = 0;
    const t = setInterval(() => {
      const s = samples[i % samples.length];
      setEvents((prev) => [{ id: ++idSeq, ...s }, ...prev].slice(0, 10));
      i += 1;
    }, 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <LandingSection id="realtime" className="border-t border-cyan-500/10 bg-[#040a18]">
      <SectionHeader
        badge="Temps réel"
        title="Chaque mouvement, visible instantanément"
        description="WebSocket STOMP, alertes push et journal d'événements — comme dans une salle de contrôle enterprise."
      />

      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 items-stretch gap-10 lg:grid-cols-2">
        <motion.div
          ref={ref}
          variants={staggerItem}
          initial={{ opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center rounded-3xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            <span
              className={`h-3 w-3 rounded-full ${connected ? "bg-emerald-400 shadow-[0_0_12px_#34d399]" : "bg-amber-400 animate-pulse"}`}
            />
            <p className="text-lg font-semibold text-white">
              {connected ? "Connecté au bus d'événements" : "Synchronisation…"}
            </p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Les équipes terrain et le siège partagent le même flux : stocks, livraisons et
            alertes critiques remontées sans rafraîchir la page.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-slate-300">
            <li className="flex gap-2">
              <span className="text-cyan-400">✓</span> Latence sub-seconde via STOMP
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-400">✓</span> Historique des 10 derniers événements
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-400">✓</span> Compatible API REST + mocks démo
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex max-h-[420px] flex-col overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-950/80 shadow-2xl backdrop-blur-xl"
        >
          <div className="border-b border-white/5 px-5 py-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400">
              Flux temps réel
            </p>
          </div>
          <ul className="flex-1 space-y-2 overflow-y-auto p-4">
            <AnimatePresence initial={false} mode="popLayout">
              {events.map((ev) => {
                const meta = TYPES[ev.type] || TYPES.stock;
                return (
                  <motion.li
                    key={ev.id}
                    layout
                    initial={{ opacity: 0, x: 40, filter: "brightness(1.6)" }}
                    animate={{ opacity: 1, x: 0, filter: "brightness(1)" }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: "spring", stiffness: 280, damping: 24 }}
                    className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
                  >
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
                    <div>
                      <span className={`text-xs font-semibold ${meta.color}`}>
                        {meta.label}
                      </span>
                      <p className="mt-0.5 text-sm text-slate-300">{ev.text}</p>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </motion.div>
      </div>
    </LandingSection>
  );
}
