"use client";

/**
 * RadarHero3D — Hero Section "Radar Global 3D" interactif et piloté au scroll.
 *
 * Stack : React Three Fiber (rendu 3D) + framer-motion (useScroll/useTransform).
 *
 * Comportement :
 *  - Un radar holographique filaire (cercles concentriques néon + balayage)
 *    avec des entrepôts (Douala, Yaoundé, …) comme points lumineux.
 *  - Au scroll 0%  : vue globale, radar centré qui tourne lentement.
 *  - Au scroll 100%: la caméra zoome/interpole en douceur vers l'entrepôt
 *    sélectionné (Douala par défaut) et la rotation se fige.
 *
 * Performance :
 *  - Géométries mémoïsées (useMemo), vecteurs réutilisés (zéro alloc/frame).
 *  - meshBasicMaterial (sans coût d'éclairage) + DPR plafonné.
 *  - La progression de scroll est lue via MotionValue.get() dans useFrame
 *    (pas de re-render React par frame).
 *
 * Intégration : importer ce composant en dynamic({ ssr: false }) — voir
 * RadarHero.jsx — pour éviter toute exécution de Three.js côté serveur.
 */

import { Component, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";

// Couleurs néon de la charte holographique.
const NEON_GREEN = "#39ff14";
const NEON_CYAN = "#34d3ff";

const RADAR_RADIUS = 3.6;

// Entrepôts disposés sur le radar (angle en degrés, rayon dans le plan XZ).
const WAREHOUSES = [
  { name: "Douala", angleDeg: 205, radius: 2.5, highlighted: true },
  { name: "Yaoundé", angleDeg: 65, radius: 1.7 },
  { name: "Bafoussam", angleDeg: 130, radius: 3.0 },
  { name: "Garoua", angleDeg: -35, radius: 3.3 },
];

// --- Helpers ---------------------------------------------------------------

const clamp01 = (x) => Math.min(1, Math.max(0, x));

// PRNG déterministe (pur) — évite Math.random() au rendu et garantit un
// nuage de particules stable d'un rendu à l'autre.
const seededRand = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// Interpolation "smootherstep" (dérivées nulles aux extrémités) : zoom fluide.
const smoother = (x) => {
  const t = clamp01(x);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

function polarToVec3(angleDeg, radius, y = 0) {
  const a = (angleDeg * Math.PI) / 180;
  return new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius);
}

function circlePoints(radius, segments = 96) {
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push([Math.cos(a) * radius, 0, Math.sin(a) * radius]);
  }
  return pts;
}

// --- Sous-composants 3D ----------------------------------------------------

/** Cercles concentriques + croix de visée du radar. */
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
          opacity={0.35 + i * 0.08}
        />
      ))}
      {/* Croix de visée. */}
      <Line
        points={[
          [-RADAR_RADIUS, 0, 0],
          [RADAR_RADIUS, 0, 0],
        ]}
        color={NEON_CYAN}
        lineWidth={1}
        transparent
        opacity={0.25}
      />
      <Line
        points={[
          [0, 0, -RADAR_RADIUS],
          [0, 0, RADAR_RADIUS],
        ]}
        color={NEON_CYAN}
        lineWidth={1}
        transparent
        opacity={0.25}
      />
    </group>
  );
}

/** Faisceau de balayage radar (fan de spokes qui s'estompent), en rotation. */
function RadarSweep() {
  const ref = useRef();
  const spokes = useMemo(() => [0, 0.14, 0.28, 0.42, 0.56], []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.9;
  });

  return (
    <group ref={ref}>
      {spokes.map((offset, i) => {
        const end = polarToVec3((offset * 180) / Math.PI, RADAR_RADIUS, 0.001);
        return (
          <Line
            key={i}
            points={[
              [0, 0.001, 0],
              [end.x, 0.001, end.z],
            ]}
            color={NEON_GREEN}
            lineWidth={2}
            transparent
            opacity={0.55 - i * 0.1}
          />
        );
      })}
    </group>
  );
}

/** Point d'entrepôt : noyau lumineux pulsé, halo, faisceau vertical, étiquette. */
function WarehouseNode({ position, label, highlighted }) {
  const core = useRef();
  const color = highlighted ? NEON_GREEN : NEON_CYAN;

  useFrame((state) => {
    if (core.current) {
      const k = 1 + Math.sin(state.clock.elapsedTime * 3 + position.x) * 0.18;
      core.current.scale.setScalar(k);
    }
  });

  return (
    <group position={position}>
      <mesh ref={core}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {/* Halo translucide. */}
      <mesh>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.18}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
      {/* Faisceau vertical. */}
      <Line
        points={[
          [0, 0, 0],
          [0, 0.7, 0],
        ]}
        color={color}
        lineWidth={1}
        transparent
        opacity={0.5}
      />
      <Html center distanceFactor={9} position={[0, 0.95, 0]} pointerEvents="none">
        <div
          style={{
            color,
            fontFamily: "var(--font-geist-mono, monospace)",
            fontSize: 12,
            letterSpacing: 1,
            whiteSpace: "nowrap",
            textShadow: `0 0 8px ${color}`,
            userSelect: "none",
          }}
        >
          ◢ {label}
        </div>
      </Html>
    </group>
  );
}

/** Nuage de particules ambiantes (atmosphère holographique). */
function Particles({ count = 320 }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.5 + seededRand(i * 3 + 1) * 4.5;
      const a = seededRand(i * 3 + 2) * Math.PI * 2;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = (seededRand(i * 3 + 3) - 0.5) * 2.4;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color={NEON_CYAN}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// --- Scène (lit la progression de scroll et pilote la caméra) --------------

/** Scène réutilisable (hero scroll ou widget dashboard). */
export function RadarScene({ progress, selected }) {
  const radarRef = useRef();

  // Vecteurs précalculés / réutilisés (aucune allocation par frame).
  const startPos = useMemo(() => new THREE.Vector3(0, 6, 11), []);
  const target = useMemo(
    () => polarToVec3(selected.angleDeg, selected.radius, 0),
    [selected]
  );
  const endPos = useMemo(
    () => new THREE.Vector3(target.x * 0.55, 1.3, target.z * 0.55 + 2.0),
    [target]
  );
  const lookScratch = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const p = progress ? clamp01(progress.get()) : 0;
    const e = smoother(p);

    // Zoom caméra : vue globale -> entrepôt sélectionné.
    state.camera.position.lerpVectors(startPos, endPos, e);
    lookScratch.set(0, 0, 0).lerp(target, e);
    state.camera.lookAt(lookScratch);

    // Rotation lente du radar, qui se fige à mesure du zoom.
    if (radarRef.current) {
      radarRef.current.rotation.y += delta * 0.25 * (1 - e);
    }
  });

  return (
    <group>
      <ambientLight intensity={0.6} />
      <fog attach="fog" args={["#020617", 9, 24]} />

      <group ref={radarRef}>
        <RadarGrid />
        <RadarSweep />
        {WAREHOUSES.map((w) => (
          <WarehouseNode
            key={w.name}
            label={w.name}
            highlighted={w.highlighted}
            position={polarToVec3(w.angleDeg, w.radius, 0)}
          />
        ))}
        <Particles />
      </group>
    </group>
  );
}

// --- Garde-fou : Error Boundary (jamais de blocage silencieux) -------------

export class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Trace l'erreur WebGL/Three.js au lieu de rester bloqué sur un loader.
    console.error("[RadarHero3D] Erreur de rendu 3D :", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[#020617]">
          <span className="font-mono text-sm text-red-400">
            Rendu 3D indisponible (WebGL).
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Composant exporté (conteneur scroll + Canvas + overlay) ---------------

export default function RadarHero3D() {
  const containerRef = useRef(null);

  // Garde de montage : on n'initialise Three.js qu'une fois le navigateur prêt
  // (DOM monté + objet window disponible). Évite la boucle d'attente de taille.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    // rAF : on attend qu'une frame soit peinte (DOM mesuré) avant d'initialiser
    // Three.js — évite le conteneur de taille 0 et le set-state synchrone.
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Progression du scroll sur toute la hauteur du conteneur (300vh).
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const selected = WAREHOUSES.find((w) => w.highlighted) ?? WAREHOUSES[0];

  // Opacités/positions de l'overlay pilotées par le scroll.
  const introOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.22], [0, -40]);
  const detailOpacity = useTransform(scrollYProgress, [0.6, 0.92], [0, 1]);
  const detailY = useTransform(scrollYProgress, [0.6, 0.92], [30, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#020617]"
      style={{ height: "300vh", minHeight: "300vh" }}
    >
      {/* Scène fixe pendant le défilement — dimensions explicites obligatoires
          (un parent de hauteur 0 ferait tourner R3F en boucle sans rendu). */}
      <div
        className="sticky top-0 overflow-hidden"
        style={{ position: "sticky", width: "100%", height: "100vh" }}
      >
        {/* Lueur radiale d'arrière-plan. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 55%, rgba(52,211,255,0.12), transparent 60%)",
          }}
        />

        {/* Canvas monté uniquement côté client, une fois le navigateur prêt. */}
        {mounted ? (
          <CanvasErrorBoundary>
            <Canvas
              style={{ width: "100%", height: "100%", display: "block" }}
              camera={{ position: [0, 6, 11], fov: 50 }}
              dpr={[1, 2]}
              gl={{ antialias: true, powerPreference: "high-performance" }}
            >
              <RadarScene progress={scrollYProgress} selected={selected} />
            </Canvas>
          </CanvasErrorBoundary>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="animate-pulse font-mono text-sm tracking-widest text-cyan-400">
              Initialisation du radar…
            </span>
          </div>
        )}

        {/* Overlay textuel (hors Canvas, piloté par framer-motion). */}
        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="pointer-events-none absolute left-0 right-0 top-[14%] flex flex-col items-center text-center"
        >
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-cyan-400">
            Supply Chain Radar
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Radar Global 3D
          </h1>
          <p className="mt-3 max-w-md text-sm text-slate-400">
            Supervision temps réel des entrepôts. Faites défiler pour zoomer.
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: detailOpacity, y: detailY }}
          className="pointer-events-none absolute bottom-[16%] left-0 right-0 flex flex-col items-center text-center"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-green-400">
            Entrepôt ciblé
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            {selected.name}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Verrouillage caméra sur les coordonnées de l&apos;entrepôt.
          </p>
        </motion.div>

        {/* Indicateur de scroll. */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute bottom-8 left-0 right-0 flex justify-center"
        >
          <span className="font-mono text-xs tracking-widest text-cyan-400/70">
            ↓ SCROLL
          </span>
        </motion.div>
      </div>
    </section>
  );
}
