"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  CanvasErrorBoundary,
  RadarScene,
} from "./RadarHero3D";

const SELECTED = { name: "Douala", angleDeg: 205, radius: 2.5, highlighted: true };

export default function RadarMini3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className="relative w-full"
      style={{
        height: 320,
        background:
          "radial-gradient(circle at 50% 60%, rgba(52,211,255,0.14), transparent 65%)",
      }}
    >
      {mounted ? (
        <CanvasErrorBoundary>
          <Canvas
            style={{ width: "100%", height: "100%", display: "block" }}
            camera={{ position: [0, 6, 11], fov: 50 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, powerPreference: "high-performance" }}
          >
            <RadarScene progress={null} selected={SELECTED} />
          </Canvas>
        </CanvasErrorBoundary>
      ) : (
        <div className="flex h-full items-center justify-center">
          <span className="animate-pulse font-mono text-xs text-cyan-400">
            Initialisation WebGL…
          </span>
        </div>
      )}
    </div>
  );
}
