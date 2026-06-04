"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/radar", label: "Radar 3D", icon: "📡" },
  { href: "/warehouses", label: "Entrepôts", icon: "🏭" },
  { href: "/alerts", label: "Alertes", icon: "🚨" },
  { href: "/products", label: "Produits", icon: "📦" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 flex-col border-r border-slate-800/90 bg-slate-950/80 backdrop-blur-xl">
      <div className="border-b border-slate-800/80 px-5 py-6">
        <p className="text-lg font-bold tracking-tight text-white">📡 Supply Chain</p>
        <p className="mt-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text font-mono text-xs font-semibold uppercase tracking-[0.25em] text-transparent">
          Radar
        </p>
      </div>
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "border border-cyan-500/25 bg-cyan-500/10 text-cyan-200 shadow-[inset_0_0_20px_rgba(34,211,238,0.08)]"
                  : "border border-transparent text-slate-400 hover:border-slate-700/50 hover:bg-slate-800/40 hover:text-slate-100"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-800/80 px-5 py-4">
        <p className="font-mono text-[10px] uppercase tracking-wider text-slate-600">
          Hackathon J.U.I.N 2026
        </p>
        <p className="font-mono text-[10px] text-slate-700">Thème 10</p>
      </div>
    </aside>
  );
}
