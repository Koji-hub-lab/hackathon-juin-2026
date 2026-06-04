"use client";

import { usePathname } from "next/navigation";
import ConnectionBadge from "@/components/premium/ConnectionBadge";
import { useSocket } from "@/hooks/useSocket";

export default function Navbar() {
  const { connected } = useSocket();
  const pathname = usePathname();
  const onDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  if (onDashboard) {
    return (
      <header className="flex h-[57px] items-center justify-end gap-4 border-b border-white/[0.06] bg-[#050505]/90 px-6 backdrop-blur-md">
        <ConnectionBadge connected={connected} />
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/10 font-mono text-xs font-bold text-orange-400">
          MO
        </div>
      </header>
    );
  }

  return (
    <header className="flex h-[57px] items-center justify-between border-b border-white/[0.06] bg-[#050505]/90 px-6 backdrop-blur-md">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-500">
        Supply Chain Radar
      </p>
      <div className="flex items-center gap-4">
        <ConnectionBadge connected={connected} />
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/10 font-mono text-xs font-bold text-orange-400">
          MO
        </div>
      </div>
    </header>
  );
}
