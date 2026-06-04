"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/radar", label: "Radar 3D" },
  { href: "/warehouses", label: "Entrepôts" },
  { href: "/alerts", label: "Alertes" },
  { href: "/products", label: "Produits" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="z-40 flex w-[72px] shrink-0 flex-col border-r border-slate-800/60 bg-[#080b11] lg:w-[88px]">
      <div className="flex h-14 shrink-0 items-center justify-center border-b border-slate-800/60">
        <span className="text-sm font-semibold tracking-tight text-slate-50">
          SCR
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`rounded-lg px-2 py-2.5 text-center text-[10px] font-medium transition-colors ${
                active
                  ? "bg-slate-800/80 text-slate-50"
                  : "text-slate-500 hover:bg-slate-900/60 hover:text-slate-300"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
