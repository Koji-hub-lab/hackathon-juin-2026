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
    <aside className="flex w-60 flex-col border-r border-gray-800 bg-gray-900">
      <div className="border-b border-gray-800 px-5 py-5">
        <p className="text-lg font-bold text-white">📡 Supply Chain</p>
        <p className="text-xs font-medium text-blue-400">Radar</p>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-500/20 text-blue-300"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-800 px-5 py-4">
        <p className="text-xs text-gray-500">Hackathon J.U.I.N 2026</p>
        <p className="text-xs text-gray-600">Thème 10</p>
      </div>
    </aside>
  );
}
