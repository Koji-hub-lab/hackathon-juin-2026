"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import GlowButton from "@/components/premium/GlowButton";

const CubeGrid3D = dynamic(() => import("./CubeGrid3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] w-full items-center justify-center bg-black">
      <span className="animate-pulse font-mono text-xs uppercase tracking-[0.4em] text-orange-500/80">
        Initialisation mesh 3D…
      </span>
    </div>
  ),
});

export default function CubeGridHero({ warehouses, alerts, className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/[0.07] bg-black ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(255,92,0,0.12), transparent 65%)",
        }}
      />
      <div className="relative flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.06] px-6 py-5 md:px-8">
        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.5em] text-orange-500">
            Holographic Mesh
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">
            Conteneurs 3D
          </h2>
        </div>
        <GlowButton href="/radar" variant="ghost" className="!py-2 !text-[11px]">
          Plein écran
        </GlowButton>
      </div>
      <CubeGrid3D warehouses={warehouses} alerts={alerts} />
    </div>
  );
}
