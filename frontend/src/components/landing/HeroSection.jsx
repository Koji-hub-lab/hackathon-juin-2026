"use client";

import { Component, useEffect, useState } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import ImmersiveBackground from "@/components/command/ImmersiveBackground";
import AnimatedTitle from "@/components/command/AnimatedTitle";
import { MissionRadarScene } from "@/components/command/MissionRadarScene";
import LandingNav from "./LandingNav";

class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full items-center justify-center">
          <span className="font-mono text-sm text-red-400">Radar 3D indisponible</span>
        </div>
      );
    }
    return this.props.children;
  }
}

function HeroRadar({ warehouses, products, alerts }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="animate-pulse font-mono text-xs tracking-[0.25em] text-cyan-400/70">
          Chargement du radar…
        </span>
      </div>
    );
  }

  return (
    <CanvasErrorBoundary>
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 5.5, 10], fov: 48 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <MissionRadarScene warehouses={warehouses} products={products} alerts={alerts} />
      </Canvas>
    </CanvasErrorBoundary>
  );
}

export default function HeroSection({ warehouses, products, alerts }) {
  return (
    <section className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#030712]">
      <LandingNav />
      <ImmersiveBackground scrollY={0} />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 58%, rgba(34,211,238,0.12), transparent 60%)",
        }}
      />

      <div className="relative z-10 flex shrink-0 flex-col items-center px-6 pt-24 text-center sm:pt-28">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300"
        >
          SaaS logistique · Cameroun
        </motion.span>
        <div className="mt-4 w-full max-w-4xl">
          <AnimatedTitle />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/dashboard"
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition-transform hover:scale-105"
          >
            Démarrer gratuitement
          </Link>
          <a
            href="#features"
            className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200 backdrop-blur-sm transition-transform hover:scale-105 hover:border-cyan-400/40"
          >
            Découvrir le produit
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-0 mx-auto mt-2 h-[min(52vh,520px)] w-full max-w-5xl flex-1 px-4 pb-8 sm:mt-4"
      >
        <HeroRadar warehouses={warehouses} products={products} alerts={alerts} />
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#030712] to-transparent" />
    </section>
  );
}
