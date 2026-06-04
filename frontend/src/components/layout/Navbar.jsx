"use client";

import { usePathname } from "next/navigation";
import ConnectionBadge from "@/components/premium/ConnectionBadge";
import { useSocket } from "@/hooks/useSocket";

export default function Navbar() {
  const { connected } = useSocket();
  const pathname = usePathname();
  const onDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  if (onDashboard) {
    return null;
  }

  return (
    <header className="flex h-[57px] items-center justify-between border-b border-cyan-500/15 bg-[#030712]/95 px-6 backdrop-blur-md">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-500/70">
        Supply Chain Radar
      </p>
      <div className="flex items-center gap-4">
        <ConnectionBadge connected={connected} />
        <div className="flex h-8 w-8 items-center justify-center rounded border border-cyan-500/30 font-mono text-[10px] font-bold text-cyan-400">
          MO
        </div>
      </div>
    </header>
  );
}
