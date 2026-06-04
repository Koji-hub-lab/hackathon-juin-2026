"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const LINKS = [
  { href: "#kpis", label: "Indicateurs" },
  { href: "#network", label: "Réseau" },
  { href: "#ai", label: "IA" },
  { href: "#realtime", label: "Temps réel" },
  { href: "#features", label: "Produit" },
];

export default function LandingNav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#030712]/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-xs font-bold text-white">
            SCR
          </span>
          <span className="hidden text-sm font-semibold text-white sm:inline">
            Supply Chain Radar
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs font-medium text-slate-400 transition-colors hover:text-cyan-300"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition-all hover:scale-105 hover:text-white sm:inline"
          >
            Connexion
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/25 transition-transform hover:scale-105"
          >
            Ouvrir le cockpit
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
