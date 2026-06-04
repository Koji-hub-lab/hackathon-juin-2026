"use client";

import { Component, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const COLORS = {
  healthy: "#34d3ff",
  warning: "#fbbf24",
  danger: "#ff3366",
};

const GRID_W = 10;
const GRID_D = 5;
const SPACING = 1.05;

function cubeStatus(warehouse, dangerWarehouseIds) {
  if (!warehouse?.id) return "healthy";
  if (dangerWarehouseIds.has(warehouse.id)) return "danger";
  const fill = warehouse.capacity
    ? (warehouse.stock / warehouse.capacity) * 100
    : 50;
  if (fill < 22) return "danger";
  if (fill < 45) return "warning";
  return "healthy";
}

export function buildCubeGrid(warehouses = [], alerts = []) {
  const dangerIds = new Set(
    alerts.filter((a) => a.level === "danger").map((a) => a.warehouseId)
  );
  const list = warehouses.length ? warehouses : [{ id: 0, stock: 0, capacity: 1 }];
  const cubes = [];

  for (let z = 0; z < GRID_D; z++) {
    for (let x = 0; x < GRID_W; x++) {
      const w = list[(x + z * GRID_W) % list.length];
      const status = cubeStatus(w, dangerIds);
      cubes.push({
        id: `${x}-${z}`,
        status,
        position: [
          (x - (GRID_W - 1) / 2) * SPACING,
          0,
          (z - (GRID_D - 1) / 2) * SPACING,
        ],
      });
    }
  }
  return cubes;
}

function ContainerCube({ basePosition, status, dispersion }) {
  const groupRef = useRef();
  const base = useMemo(() => new THREE.Vector3(...basePosition), [basePosition]);
  const scatter = useMemo(() => {
    const a = basePosition[0] * 1.7 + basePosition[2] * 2.3;
    return new THREE.Vector3(
      Math.sin(a) * 1.2,
      1.4 + Math.abs(Math.cos(a)),
      Math.cos(a) * 1.2
    );
  }, [basePosition]);
  const targetPos = useMemo(() => new THREE.Vector3(), []);

  const color = COLORS[status] ?? COLORS.healthy;

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;

    const d = status === "danger" ? dispersion : status === "warning" ? dispersion * 0.35 : 0;

    targetPos.copy(base).addScaledVector(scatter, d);
    g.position.lerp(targetPos, 0.18 + d * 0.35);

    if (status === "danger") {
      const pulse = 0.55 + 0.45 * Math.sin(state.clock.elapsedTime * 10);
      const mesh = g.children[0];
      if (mesh?.material) {
        mesh.material.opacity = 0.15 + pulse * 0.35;
      }
      g.rotation.x += d * 0.04;
      g.rotation.z += d * 0.03;
    } else {
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0, 0.08);
      g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, 0, 0.08);
    }

    const scale = 1 - d * (status === "danger" ? 0.75 : 0.2);
    g.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef} position={basePosition}>
      <mesh>
        <boxGeometry args={[0.82, 0.82, 0.82]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={status === "danger" ? 0.25 : 0.12}
          toneMapped={false}
          depthWrite={false}
        />
        <Edges threshold={15} color={color} />
      </mesh>
    </group>
  );
}

function CubeGridScene({ cubes, dispersion }) {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12 * (1 - dispersion * 0.7);
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.55} />
      <pointLight position={[6, 8, 4]} intensity={0.8} color="#34d3ff" />
      <pointLight position={[-5, 4, -6]} intensity={0.4} color="#39ff14" />
      <fog attach="fog" args={["#0b0f19", 14, 28]} />

      {/* Sol grille */}
      <gridHelper
        args={[18, 18, "#1e293b", "#0f172a"]}
        position={[0, -0.55, 0]}
      />

      {cubes.map((cube) => (
        <ContainerCube
          key={cube.id}
          basePosition={cube.position}
          status={cube.status}
          dispersion={dispersion}
        />
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={0.35}
        autoRotate={dispersion < 0.05}
        autoRotateSpeed={0.35}
      />
    </group>
  );
}

export class CubeGridErrorBoundary extends Component {
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
        <div className="flex h-full w-full items-center justify-center bg-[#0b0f19]">
          <span className="font-mono text-sm text-red-400">
            Grille 3D indisponible (WebGL)
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function CubeGrid3D({ warehouses = [], alerts = [] }) {
  const [mounted, setMounted] = useState(false);
  const [dispersion, setDispersion] = useState(0);

  const cubes = useMemo(
    () => buildCubeGrid(warehouses, alerts),
    [warehouses, alerts]
  );

  const dangerCount = cubes.filter((c) => c.status === "danger").length;

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Scroll du <main> (layout) → dispersion des cubes rouges.
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return undefined;

    const onScroll = () => {
      const max = main.scrollHeight - main.clientHeight;
      const ratio = max > 0 ? main.scrollTop / max : 0;
      setDispersion(Math.min(1, ratio * 1.3));
    };

    onScroll();
    main.addEventListener("scroll", onScroll, { passive: true });
    return () => main.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative h-[360px] w-full">
      {mounted ? (
        <CubeGridErrorBoundary>
          <Canvas
            style={{ width: "100%", height: "100%", display: "block" }}
            camera={{ position: [0, 7.5, 11], fov: 48 }}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          >
            <CubeGridScene cubes={cubes} dispersion={dispersion} />
          </Canvas>
        </CubeGridErrorBoundary>
      ) : (
        <div className="flex h-full items-center justify-center">
          <span className="animate-pulse font-mono text-xs tracking-[0.3em] text-cyan-400/80">
            INITIALISATION GRILLE 3D…
          </span>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-3 left-4 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">
        <span className="text-cyan-400/90">● Stock sain</span>
        <span className="text-amber-400/90">● Surveillance</span>
        <span className="text-rose-400/90">● Critique ({dangerCount})</span>
      </div>
      <div className="pointer-events-none absolute bottom-3 right-4 font-mono text-[10px] tracking-widest text-slate-600">
        SCROLL → DISPERSION ALERTES
      </div>
    </div>
  );
}
