"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import CyberPanel from "@/components/cyber/CyberPanel";

const CubeGrid3D = dynamic(() => import("./CubeGrid3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[360px] w-full items-center justify-center bg-[#0b0f19]">
      <span className="animate-pulse font-mono text-xs tracking-[0.35em] text-cyan-400/70">
        CHARGEMENT CANVAS 3D…
      </span>
    </div>
  ),
});

export default function CubeGridHero({ warehouses, alerts }) {
  return (
    <CyberPanel className="overflow-hidden p-0" glow="cyan">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-950/40 px-5 py-4 backdrop-blur-md">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-cyan-400/90">
            Supply Chain · Live Mesh
          </p>
          <h2 className="mt-1 bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-400 bg-clip-text text-xl font-bold tracking-tight text-transparent sm:text-2xl">
            Vue holographique 3D
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Grille de conteneurs — cubes critiques dispersés au scroll
          </p>
        </div>
        <Link
          href="/radar"
          className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 font-mono text-xs font-medium text-cyan-300 transition-all hover:border-cyan-400/50 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
        >
          RADAR PLEIN ÉCRAN →
        </Link>
      </div>
      <div
        className="relative"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(34,211,238,0.08), transparent 70%)",
        }}
      >
        <CubeGrid3D warehouses={warehouses} alerts={alerts} />
      </div>
    </CyberPanel>
  );
}
