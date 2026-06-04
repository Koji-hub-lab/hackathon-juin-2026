"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import {
  RADAR_WAREHOUSES,
  polarToVec3,
  activityColor,
} from "./warehouseRadarMeta";

const NEON_CYAN = "#22d3ee";
const NEON_GREEN = "#34d399";
const RADAR_RADIUS = 3.6;

const seededRand = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const clamp01 = (x) => Math.min(1, Math.max(0, x));

const smoother = (x) => {
  const t = clamp01(x);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

function circlePoints(radius, segments = 96) {
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push([Math.cos(a) * radius, 0, Math.sin(a) * radius]);
  }
  return pts;
}

function vec3FromPolar(angleDeg, radius, y = 0) {
  const a = (angleDeg * Math.PI) / 180;
  return new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius);
}

function matchWarehouse(warehouses, city) {
  return (
    warehouses.find(
      (w) =>
        w.city?.toLowerCase().includes(city.toLowerCase()) ||
        w.name?.toLowerCase().includes(city.toLowerCase())
    ) ?? null
  );
}

function RadarGrid() {
  const rings = useMemo(
    () => [0.9, 1.8, 2.7, RADAR_RADIUS].map((r) => circlePoints(r)),
    []
  );

  return (
    <group>
      {rings.map((pts, i) => (
        <Line
          key={i}
          points={pts}
          color={NEON_CYAN}
          lineWidth={1}
          transparent
          opacity={0.28 + i * 0.1}
        />
      ))}
      <Line
        points={[
          [-RADAR_RADIUS, 0, 0],
          [RADAR_RADIUS, 0, 0],
        ]}
        color={NEON_CYAN}
        lineWidth={1}
        transparent
        opacity={0.2}
      />
      <Line
        points={[
          [0, 0, -RADAR_RADIUS],
          [0, 0, RADAR_RADIUS],
        ]}
        color={NEON_CYAN}
        lineWidth={1}
        transparent
        opacity={0.2}
      />
    </group>
  );
}

function RotatingRing() {
  const ref = useRef();
  const pts = useMemo(() => circlePoints(RADAR_RADIUS + 0.15, 128), []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={ref}>
      <Line
        points={pts}
        color={NEON_GREEN}
        lineWidth={2}
        transparent
        opacity={0.45}
      />
    </group>
  );
}

function RadarSweep() {
  const ref = useRef();
  const spokes = useMemo(() => [0, 0.12, 0.24, 0.36, 0.48, 0.6], []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 1.1;
  });

  return (
    <group ref={ref}>
      {spokes.map((offset, i) => {
        const end = vec3FromPolar((offset * 180) / Math.PI, RADAR_RADIUS, 0.002);
        return (
          <Line
            key={i}
            points={[
              [0, 0.002, 0],
              [end.x, 0.002, end.z],
            ]}
            color={NEON_GREEN}
            lineWidth={2.5 - i * 0.2}
            transparent
            opacity={0.65 - i * 0.09}
          />
        );
      })}
    </group>
  );
}

function CenterPulse() {
  const core = useRef();
  const glow = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const k = 1 + Math.sin(t * 2.2) * 0.22;
    if (core.current) core.current.scale.setScalar(k * 0.35);
    if (glow.current) {
      glow.current.scale.setScalar(1.4 + Math.sin(t * 1.5) * 0.25);
      glow.current.material.opacity = 0.12 + Math.sin(t * 2) * 0.06;
    }
  });

  return (
    <group>
      <mesh ref={glow}>
        <sphereGeometry args={[0.9, 24, 24]} />
        <meshBasicMaterial
          color={NEON_CYAN}
          transparent
          opacity={0.15}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={core}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={NEON_CYAN} toneMapped={false} />
      </mesh>
    </group>
  );
}

function LocalParticles({ color, position }) {
  const ref = useRef();
  const count = 12;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 0.15 + seededRand(i) * 0.2;
      const a = seededRand(i + 7) * Math.PI * 2;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = (seededRand(i + 3) - 0.5) * 0.15;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.8;
  });

  return (
    <group position={position}>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color={color}
          transparent
          opacity={0.75}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function WarehousePopup({ data, color }) {
  if (!data) return null;
  return (
    <div
      className="pointer-events-none w-44 rounded-xl border border-cyan-400/40 bg-slate-950/90 px-3 py-2.5 text-left shadow-[0_0_24px_rgba(34,211,238,0.35)] backdrop-blur-md"
      style={{ fontFamily: "var(--font-geist-mono, monospace)" }}
    >
      <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color }}>
        {data.label}
      </p>
      <dl className="mt-2 space-y-1 text-[10px] text-slate-300">
        <div className="flex justify-between gap-2">
          <dt className="text-slate-500">Capacité</dt>
          <dd className="tabular-nums text-white">{data.capacity}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-500">Remplissage</dt>
          <dd className="tabular-nums text-cyan-300">{data.fillPercent}%</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-500">Produits</dt>
          <dd className="tabular-nums text-white">{data.productCount}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-500">Statut</dt>
          <dd style={{ color }}>{data.status}</dd>
        </div>
      </dl>
    </div>
  );
}

function WarehouseNode({ hub, warehouse, productCount, hasAlert }) {
  const [hovered, setHovered] = useState(false);
  const core = useRef();
  const ring = useRef();
  const position = useMemo(
    () => vec3FromPolar(hub.angleDeg, hub.radius, 0),
    [hub.angleDeg, hub.radius]
  );

  const fillPercent = warehouse
    ? Math.round((warehouse.stock / warehouse.capacity) * 100)
    : 50;
  const color = activityColor(fillPercent, hasAlert);
  const status =
    hasAlert || fillPercent < 25
      ? "Critique"
      : fillPercent < 55
        ? "Surveillance"
        : "Opérationnel";

  const popupData = {
    label: hub.name,
    capacity: warehouse?.capacity?.toLocaleString("fr-FR") ?? "—",
    fillPercent,
    productCount,
    status,
  };

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (core.current) {
      const k = 1 + Math.sin(t * 3 + position.x) * 0.2;
      core.current.scale.setScalar(k);
    }
    if (ring.current) {
      ring.current.scale.setScalar(1 + Math.sin(t * 2.5) * 0.12);
    }
  });

  return (
    <group position={position}>
      <mesh
        visible={false}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.14, 0.22, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={core}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.35 : 0.18}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      <Line
        points={[
          [0, 0, 0],
          [0, 0.75, 0],
        ]}
        color={color}
        lineWidth={1}
        transparent
        opacity={0.55}
      />

      <LocalParticles color={color} position={[0, 0.05, 0]} />

      <Html
        center
        distanceFactor={10}
        position={[0, hovered ? 1.35 : 0.92, 0]}
        style={{ pointerEvents: hovered ? "auto" : "none" }}
      >
        {hovered ? (
          <WarehousePopup data={popupData} color={color} />
        ) : (
          <span
            style={{
              color,
              fontSize: 11,
              letterSpacing: 1,
              textShadow: `0 0 10px ${color}`,
              whiteSpace: "nowrap",
              fontFamily: "var(--font-geist-mono, monospace)",
            }}
          >
            ◢ {hub.name}
          </span>
        )}
      </Html>
    </group>
  );
}

function FlowOnLine({ start, end, color, speed = 0.35, phase = 0 }) {
  const ref = useRef();
  const startV = useMemo(() => new THREE.Vector3(...start), [start]);
  const endV = useMemo(() => new THREE.Vector3(...end), [end]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = (state.clock.elapsedTime * speed + phase) % 1;
    ref.current.position.lerpVectors(startV, endV, t);
    ref.current.position.y = 0.04;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

function NetworkLinks({ hubs, warehouses, alerts }) {
  const links = useMemo(() => {
    const indices = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [0, 2],
    ];
    return indices.map(([a, b]) => {
      const ha = hubs[a];
      const hb = hubs[b];
      const wa = matchWarehouse(warehouses, ha.name);
      const wb = matchWarehouse(warehouses, hb.name);
      const fillA = wa ? (wa.stock / wa.capacity) * 100 : 50;
      const fillB = wb ? (wb.stock / wb.capacity) * 100 : 50;
      const alertA = alerts.some((al) => al.warehouseId === wa?.id && al.level === "danger");
      const alertB = alerts.some((al) => al.warehouseId === wb?.id && al.level === "danger");
      const color = activityColor((fillA + fillB) / 2, alertA || alertB);
      const start = polarToVec3(ha.angleDeg, ha.radius, 0.03);
      const end = polarToVec3(hb.angleDeg, hb.radius, 0.03);
      return { start, end, color };
    });
  }, [hubs, warehouses, alerts]);

  return (
    <group>
      {links.map((link, i) => (
        <group key={i}>
          <Line
            points={[link.start, link.end]}
            color={link.color}
            lineWidth={1.5}
            transparent
            opacity={0.55}
          />
          <FlowOnLine
            start={link.start}
            end={link.end}
            color={link.color}
            phase={i * 0.2}
            speed={0.28 + i * 0.04}
          />
          <FlowOnLine
            start={link.end}
            end={link.start}
            color={link.color}
            phase={i * 0.2 + 0.5}
            speed={0.22}
          />
        </group>
      ))}
    </group>
  );
}

function AmbientParticles({ count = 280 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.2 + seededRand(i * 3 + 1) * 5;
      const a = seededRand(i * 3 + 2) * Math.PI * 2;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = (seededRand(i * 3 + 3) - 0.5) * 2.8;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={NEON_CYAN}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export function MissionRadarScene({ progress, warehouses = [], products = [], alerts = [] }) {
  const radarRef = useRef();
  const startPos = useMemo(() => new THREE.Vector3(0, 5.5, 10), []);
  const endPos = useMemo(() => new THREE.Vector3(0, 3.2, 6.2), []);
  const lookScratch = useMemo(() => new THREE.Vector3(), []);

  const productCountByWarehouse = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      map[p.warehouseId] = (map[p.warehouseId] || 0) + 1;
    });
    return map;
  }, [products]);

  useFrame((state, delta) => {
    const p = progress ? clamp01(progress.get()) : 0;
    const e = smoother(p);

    state.camera.position.lerpVectors(startPos, endPos, e);
    lookScratch.set(0, 0, 0);
    state.camera.lookAt(lookScratch);

    if (radarRef.current) {
      radarRef.current.rotation.y += delta * 0.18 * (1 - e * 0.85);
    }
  });

  return (
    <group>
      <ambientLight intensity={0.55} />
      <fog attach="fog" args={["#030712", 8, 22]} />

      <group ref={radarRef}>
        <RadarGrid />
        <RotatingRing />
        <RadarSweep />
        <CenterPulse />
        <NetworkLinks
          hubs={RADAR_WAREHOUSES}
          warehouses={warehouses}
          alerts={alerts}
        />
        {RADAR_WAREHOUSES.map((hub) => {
          const wh = matchWarehouse(warehouses, hub.name);
          const hasAlert = alerts.some(
            (a) => a.warehouseId === wh?.id && a.level === "danger"
          );
          return (
            <WarehouseNode
              key={hub.name}
              hub={hub}
              warehouse={wh}
              productCount={wh ? productCountByWarehouse[wh.id] ?? 0 : 0}
              hasAlert={hasAlert}
            />
          );
        })}
        <AmbientParticles />
      </group>
    </group>
  );
}
