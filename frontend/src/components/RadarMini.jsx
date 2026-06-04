"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const RadarMini3D = dynamic(() => import("./RadarMini3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 w-full items-center justify-center rounded-xl bg-[#020617]">
      <span className="animate-pulse font-mono text-xs tracking-widest text-cyan-400">
        Radar 3D…
      </span>
    </div>
  ),
});

export default function RadarMini() {
  return (
    <div className="overflow-hidden rounded-xl border border-cyan-500/30 bg-[#020617] shadow-[0_0_40px_rgba(52,211,255,0.08)]">
      <div className="flex items-center justify-between border-b border-cyan-500/20 px-4 py-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-400">
            Radar Global
          </p>
          <h2 className="text-lg font-bold text-white">Vue holographique 3D</h2>
        </div>
        <Link
          href="/radar"
          className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 transition-colors hover:bg-cyan-500/20"
        >
          Plein écran →
        </Link>
      </div>
      <RadarMini3D />
    </div>
  );
}
