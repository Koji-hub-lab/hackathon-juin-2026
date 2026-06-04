"use client";

import Link from "next/link";

/** Ancres de section — scroll natif, pas de navigation Next.js */
const SECTION_LINKS = [
  { href: "#kpis", label: "Indicateurs" },
  { href: "#network", label: "Réseau" },
  { href: "#ai", label: "IA" },
  { href: "#realtime", label: "Temps réel" },
  { href: "#features", label: "Produit" },
];

export default function LandingNav() {
  const handleAnchor = (e, href) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="sticky top-0 z-30 border-b border-white/10 bg-[#030712]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-center gap-4 overflow-x-auto px-4 sm:gap-8">
        {SECTION_LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={(e) => handleAnchor(e, l.href)}
            className="shrink-0 whitespace-nowrap text-xs font-medium text-slate-400 transition-colors hover:text-cyan-300"
          >
            {l.label}
          </a>
        ))}
        <Link
          href="/dashboard"
          className="ml-2 shrink-0 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-transform hover:scale-105"
        >
          Cockpit
        </Link>
      </div>
    </div>
  );
}
