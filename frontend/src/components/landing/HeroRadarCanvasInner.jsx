"use client";

import { Canvas } from "@react-three/fiber";
import { MissionRadarScene } from "@/components/command/MissionRadarScene";

export default function HeroRadarCanvasInner({ warehouses, products, alerts }) {
  return (
    <Canvas
      className="h-full w-full"
      camera={{ position: [0, 5.5, 10], fov: 48 }}
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <MissionRadarScene warehouses={warehouses} products={products} alerts={alerts} />
    </Canvas>
  );
}
