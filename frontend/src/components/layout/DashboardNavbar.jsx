"use client";

import Link from "next/link";
import { useSocket } from "@/hooks/useSocket";
import ConnectionBadge from "@/components/premium/ConnectionBadge";

export default function DashboardNavbar() {
  const { connected } = useSocket();

  return (
    <header className="fixed top-0 right-0 z-50 flex h-14 w-full items-center justify-between border-b border-slate-800/60 bg-[#080b11]/80 px-5 backdrop-blur-md lg:left-[88px] lg:w-[calc(100%-88px)]">
      <div>
        <p className="text-sm font-medium text-slate-50">Supply Chain Radar</p>
        <p className="text-xs text-slate-500">Tableau de bord</p>
      </div>
      <div className="flex items-center gap-3">
        <ConnectionBadge connected={connected} />
        <Link
          href="/radar"
          className="rounded-lg border border-slate-800/60 bg-slate-900/50 px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-800/60 hover:text-slate-50"
        >
          Radar 3D
        </Link>
      </div>
    </header>
  );
}
