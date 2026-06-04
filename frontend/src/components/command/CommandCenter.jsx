"use client";

import { Component, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSocket } from "@/hooks/useSocket";
import { getWarehouses } from "@/services/warehouseService";
import { getAlerts } from "@/services/alertService";
import { getPredictions } from "@/services/predictService";
import { getProducts } from "@/services/productService";
import ImmersiveBackground from "./ImmersiveBackground";
import AnimatedTitle from "./AnimatedTitle";
import HoloKpiCard from "./HoloKpiCard";
import RealtimeFluxPanel from "./RealtimeFluxPanel";
import AIPredictionWidget from "./AIPredictionWidget";
import { MissionRadarScene } from "./MissionRadarScene";

class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("[CommandCenter] WebGL:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-mono text-sm text-red-400">Rendu 3D indisponible</span>
        </div>
      );
    }
    return this.props.children;
  }
}

function MissionCanvas({ scrollYProgress, warehouses, products, alerts }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="animate-pulse font-mono text-xs tracking-[0.3em] text-cyan-400/80">
          Initialisation du radar…
        </span>
      </div>
    );
  }

  return (
    <CanvasErrorBoundary>
      <Canvas
        style={{ width: "100%", height: "100%", display: "block" }}
        camera={{ position: [0, 5.5, 10], fov: 48 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <MissionRadarScene
          progress={scrollYProgress}
          warehouses={warehouses}
          products={products}
          alerts={alerts}
        />
      </Canvas>
    </CanvasErrorBoundary>
  );
}

export default function CommandCenter() {
  const containerRef = useRef(null);
  const [warehouses, setWarehouses] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [products, setProducts] = useState([]);
  const [liveAlert, setLiveAlert] = useState(null);
  const [scrollPx, setScrollPx] = useState(0);

  const { connected } = useSocket((alert) => {
    setLiveAlert(alert);
  });

  useEffect(() => {
    getWarehouses().then(setWarehouses);
    getAlerts().then(setAlerts);
    getPredictions().then(setPredictions);
    getProducts().then(setProducts);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const kpiYtl = useTransform(scrollYProgress, [0, 1], [0, -24]);
  const kpiYtr = useTransform(scrollYProgress, [0, 1], [0, -18]);
  const kpiYbl = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const kpiYbr = useTransform(scrollYProgress, [0, 1], [0, 16]);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const onScroll = () => setScrollPx(el.scrollTop);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const globalFill = useMemo(() => {
    if (!warehouses.length) return 0;
    const sum = warehouses.reduce(
      (s, w) => s + Math.round((w.stock / w.capacity) * 100),
      0
    );
    return Math.round(sum / warehouses.length);
  }, [warehouses]);

  const dangerCount = alerts.filter((a) => a.level === "danger").length;

  const topPrediction = useMemo(() => {
    if (!predictions.length) return null;
    return [...predictions].sort((a, b) => a.daysUntilRupture - b.daysUntilRupture)[0];
  }, [predictions]);

  return (
    <section
      ref={containerRef}
      className="relative h-[260vh] w-full overflow-y-auto overflow-x-hidden bg-[#030712]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <ImmersiveBackground scrollY={scrollPx} />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 52%, rgba(34,211,238,0.1), transparent 55%)",
          }}
        />

        <div className="absolute inset-x-0 top-[4%] z-20 px-4">
          <AnimatedTitle />
        </div>

        <HoloKpiCard
          label="Entrepôts actifs"
          value={warehouses.length || "—"}
          sub="Réseau Cameroun"
          position="tl"
          delay={0.15}
          scrollParallax={kpiYtl}
        />
        <HoloKpiCard
          label="Produits suivis"
          value={products.length || "—"}
          sub="SKU monitorés"
          position="tr"
          delay={0.25}
          scrollParallax={kpiYtr}
        />
        <HoloKpiCard
          label="Alertes critiques"
          value={dangerCount}
          sub={dangerCount > 0 ? "Action requise" : "Réseau stable"}
          position="bl"
          delay={0.35}
          scrollParallax={kpiYbl}
        />
        <HoloKpiCard
          label="Remplissage global"
          value={`${globalFill}%`}
          sub="Moyenne capacité"
          position="br"
          delay={0.45}
          scrollParallax={kpiYbr}
        />

        <div className="absolute inset-x-0 bottom-0 top-[22%] z-10">
          <MissionCanvas
            scrollYProgress={scrollYProgress}
            warehouses={warehouses}
            products={products}
            alerts={alerts}
          />
        </div>

        <RealtimeFluxPanel connected={connected} liveAlert={liveAlert} />
        <AIPredictionWidget prediction={topPrediction} />

        <nav className="absolute bottom-4 right-4 z-40 flex gap-2">
          <Link
            href="/dashboard"
            className="rounded-xl border border-cyan-500/30 bg-slate-900/50 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-cyan-300 backdrop-blur-md transition-transform hover:scale-105 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]"
          >
            Tableau de bord
          </Link>
          <Link
            href="/warehouses"
            className="rounded-xl border border-cyan-500/30 bg-slate-900/50 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-cyan-300 backdrop-blur-md transition-transform hover:scale-105 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]"
          >
            Entrepôts
          </Link>
        </nav>

        <motion.div
          className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
          style={{ opacity: scrollHintOpacity }}
        >
          <span className="font-mono text-[10px] tracking-[0.35em] text-cyan-400/60">
            SCROLL · ZOOM RADAR
          </span>
        </motion.div>
      </div>
    </section>
  );
}
