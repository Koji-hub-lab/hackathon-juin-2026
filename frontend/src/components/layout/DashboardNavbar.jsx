"use client";

import Link from "next/link";
import { useSocket } from "@/hooks/useSocket";
import ConnectionBadge from "@/components/premium/ConnectionBadge";

export default function DashboardNavbar() {
  const { connected } = useSocket();
  const time = new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="fixed top-0 right-0 z-50 flex h-12 w-full items-center justify-between border-b border-orange-500/20 bg-black/90 px-4 backdrop-blur-md lg:left-[88px] lg:w-[calc(100%-88px)]">
      <div className="flex items-center gap-6">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-neutral-300">
          SCR · HUD
        </span>
        <span className="hidden font-mono text-[10px] tabular-nums text-neutral-500 sm:inline">
          {time}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <ConnectionBadge connected={connected} />
        <Link
          href="/radar"
          className="border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-orange-400 shadow-[0_0_16px_rgba(249,115,22,0.15)] transition-colors hover:border-orange-500/50 hover:bg-orange-500/20"
        >
          Radar 3D
        </Link>
      </div>
    </header>
  );
}
