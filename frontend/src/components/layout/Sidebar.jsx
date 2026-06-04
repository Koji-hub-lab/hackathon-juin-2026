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
    <aside className="relative z-30 flex w-[72px] flex-col border-r border-white/[0.06] bg-[#050505] lg:w-[88px]">
      <div className="flex h-[57px] items-center justify-center border-b border-white/[0.06]">
        <span
          className="text-lg font-black text-[#ff5c00]"
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
              className={`group relative flex flex-col items-center gap-1 rounded-xl py-3 text-center transition-all duration-300 ${
                active
                  ? "bg-[#ff5c00] text-black glow-orange"
                  : "text-neutral-500 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <span className="font-mono text-sm font-bold">{item.short}</span>
              <span
                className={`max-w-full truncate px-1 font-mono text-[8px] uppercase tracking-wider ${
                  active ? "text-black/70" : "text-neutral-600"
                }`}
              >
                {item.label}
              </span>
              {active && (
                <span className="absolute -left-2 top-1/2 h-8 w-0.5 -translate-y-1/2 rounded-full bg-[#ff5c00]" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/[0.06] p-3 text-center">
        <p className="font-mono text-[8px] leading-tight text-neutral-700">
          J.U.I.N
          <br />
          2026
        </p>
      </div>
    </aside>
  );
}
