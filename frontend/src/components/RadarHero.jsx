"use client";

/**
 * RadarHero — point d'entrée SSR-safe du Radar Global 3D.
 *
 * Charge RadarHero3D en import dynamique avec `ssr: false` : Three.js / WebGL
 * ne s'exécutent jamais côté serveur (évite "window is not defined", etc.).
 * Ce wrapper est un Client Component, donc utilisable directement dans une page
 * (Server Component) de l'App Router.
 */

import dynamic from "next/dynamic";

const RadarHero3D = dynamic(() => import("./RadarHero3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-[#020617]">
      <span className="animate-pulse font-mono text-sm tracking-widest text-cyan-400">
        Initialisation du radar…
      </span>
    </div>
  ),
});

export default function RadarHero() {
  return <RadarHero3D />;
}
