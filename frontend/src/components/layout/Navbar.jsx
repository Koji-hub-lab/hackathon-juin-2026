"use client";

import { usePathname } from "next/navigation";
import ConnectionBadge from "@/components/premium/ConnectionBadge";
import { useSocket } from "@/hooks/useSocket";

export default function Navbar() {
  const pathname = usePathname();
  const isDashboard =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  if (isDashboard) return null;

  const { connected } = useSocket();

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-orange-500/20 bg-black px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
        Supply Chain Radar
      </p>
      <div className="flex items-center gap-3">
        <ConnectionBadge connected={connected} />
        <div className="flex h-8 w-8 items-center justify-center rounded border border-orange-500/30 font-mono text-[10px] text-orange-500">
          MO
        </div>
      </div>
    </header>
  );
}
