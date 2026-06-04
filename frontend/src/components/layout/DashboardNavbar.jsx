"use client";

import Link from "next/link";
import { useSocket } from "@/hooks/useSocket";
import ConnectionBadge from "@/components/premium/ConnectionBadge";

export default function DashboardNavbar() {
  const { connected } = useSocket();

  return (
    <header className="fixed top-0 right-0 z-50 flex h-14 w-full items-center justify-between border-b border-slate-200/60 bg-white/90 px-6 shadow-sm backdrop-blur-md lg:left-[88px] lg:w-[calc(100%-88px)]">
      <p className="text-sm font-semibold text-blue-600">Supply Chain Radar</p>
      <div className="flex items-center gap-3">
        <ConnectionBadge connected={connected} />
        <Link
          href="/radar"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Radar 3D
        </Link>
      </div>
    </header>
  );
}
