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
    <aside className="z-40 flex w-[72px] shrink-0 flex-col border-r border-slate-200/60 bg-white lg:w-[88px]">
      <div className="flex h-14 shrink-0 items-center justify-center border-b border-slate-100">
        <span className="text-sm font-bold text-blue-600">SCR</span>
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
              className={`rounded-xl px-2 py-2.5 text-center text-[10px] font-semibold transition-colors ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-blue-50 hover:text-blue-700"
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
