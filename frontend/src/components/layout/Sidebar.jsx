"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "HUD", short: "⌂" },
  { href: "/radar", label: "3D", short: "◎" },
  { href: "/warehouses", label: "Sites", short: "▣" },
  { href: "/alerts", label: "!", short: "!" },
  { href: "/products", label: "SKU", short: "◫" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="z-40 flex w-[72px] shrink-0 flex-col border-r border-orange-500/20 bg-black lg:w-[88px]">
      <div className="flex h-12 shrink-0 items-center justify-center border-b border-orange-500/20">
        <span className="font-mono text-xs font-black text-orange-500">SCR</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`flex flex-col items-center rounded border py-2.5 font-mono transition-colors ${
                active
                  ? "border-orange-500/40 bg-orange-500/15 text-orange-500 shadow-[0_0_16px_rgba(249,115,22,0.12)]"
                  : "border-transparent text-neutral-600 hover:border-orange-500/20 hover:text-neutral-400"
              }`}
            >
              <span className="text-sm font-bold">{item.short}</span>
              <span className="text-[8px] uppercase">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
