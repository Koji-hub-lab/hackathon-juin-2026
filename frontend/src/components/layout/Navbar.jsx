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
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800/60 bg-[#080b11]/80 px-6 backdrop-blur-md">
      <p className="text-sm font-medium text-slate-50">Supply Chain Radar</p>
      <ConnectionBadge connected={connected} />
    </header>
  );
}
