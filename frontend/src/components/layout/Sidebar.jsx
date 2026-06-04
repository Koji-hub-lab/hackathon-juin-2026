"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Command", short: "⌂" },
  { href: "/radar", label: "Radar 3D", short: "◎" },
  { href: "/warehouses", label: "Sites", short: "▣" },
  { href: "/alerts", label: "Alertes", short: "!" },
  { href: "/products", label: "Stock", short: "◫" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="relative z-30 flex w-[72px] flex-col border-r border-cyan-500/15 bg-[#030712] lg:w-[88px]">
      <div className="flex h-[57px] items-center justify-center border-b border-dashed border-cyan-500/20">
        <span
          className="font-mono text-sm font-black tracking-tighter text-cyan-400"
          title="Supply Chain Radar"
        >
          SCR
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-2 py-4">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`group relative flex flex-col items-center gap-1 rounded border py-3 text-center transition-all duration-300 ${
                active
                  ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                  : "border-transparent text-slate-600 hover:border-cyan-500/20 hover:bg-cyan-500/5 hover:text-cyan-400/80"
              }`}
            >
              <span className="font-mono text-sm font-bold">{item.short}</span>
              <span className="max-w-full truncate px-1 font-mono text-[8px] uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-dashed border-cyan-500/20 p-3 text-center">
        <p className="font-mono text-[8px] leading-tight text-slate-700">HUD v2</p>
      </div>
    </aside>
  );
}
