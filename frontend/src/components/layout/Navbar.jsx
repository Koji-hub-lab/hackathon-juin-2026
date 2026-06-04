"use client";

import { usePathname } from "next/navigation";
import ConnectionBadge from "@/components/premium/ConnectionBadge";
import { useSocket } from "@/hooks/useSocket";

export default function Navbar() {
  const pathname = usePathname();
  const isDashboard =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isLanding = pathname === "/" || pathname === "/radar";

  if (isDashboard || isLanding) return null;

  const { connected } = useSocket();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200/60 bg-white px-6 shadow-sm">
      <p className="text-sm font-bold text-slate-900">Supply Chain Radar</p>
      <ConnectionBadge connected={connected} />
    </header>
  );
}
