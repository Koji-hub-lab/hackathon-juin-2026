"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/warehouses", label: "Entrepôts" },
  { href: "/alerts", label: "Alertes" },
  { href: "/products", label: "Produits" },
];

export default function LandingFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="border-t border-white/10 bg-[#020617] px-6 py-16 sm:px-10 lg:px-16"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-lg font-bold text-white">Supply Chain Radar</p>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Plateforme SaaS de supervision logistique et prédiction IA — conçue pour les réseaux
            multi-entrepôts en Afrique centrale.
          </p>
        </div>

        <div className="flex flex-wrap gap-10">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-600">
              Produit
            </p>
            <ul className="mt-4 space-y-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-slate-400 transition-colors hover:text-cyan-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-600">
              Démo
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>
                <a href="#kpis" className="hover:text-cyan-300">
                  Indicateurs
                </a>
              </li>
              <li>
                <a href="#network" className="hover:text-cyan-300">
                  Réseau
                </a>
              </li>
              <li>
                <a href="#ai" className="hover:text-cyan-300">
                  IA prédictive
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} Supply Chain Radar · Hackathon Juin 2026
        </p>
        <Link
          href="/dashboard"
          className="rounded-lg border border-cyan-500/30 px-4 py-2 text-xs font-medium text-cyan-300 transition-transform hover:scale-105"
        >
          Accéder au cockpit →
        </Link>
      </div>
    </motion.footer>
  );
}
