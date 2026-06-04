"use client";

import { useMemo } from "react";

/** Silhouette simplifiée du Cameroun (viewBox 0 0 200 260). */
const CAMEROON_PATH =
  "M 72 28 L 128 24 L 148 58 L 158 98 L 152 148 L 138 198 L 108 238 L 78 248 L 48 228 L 36 178 L 40 128 L 52 72 Z";

/** Nœuds logistiques — coordonnées SVG normalisées. */
export const LOGISTICS_NODES = [
  { warehouseId: 1, name: "Douala", x: 48, y: 218 },
  { warehouseId: 2, name: "Yaoundé", x: 102, y: 168 },
  { warehouseId: 3, name: "Bafoussam", x: 58, y: 148 },
  { warehouseId: 4, name: "Garoua", x: 112, y: 48 },
];

const LINKS = [
  [1, 2],
  [2, 3],
  [2, 4],
  [1, 3],
];

function nodeStatus(warehouseId, warehouses, dangerIds) {
  if (dangerIds.has(warehouseId)) return "alert";
  const w = warehouses.find((wh) => wh.id === warehouseId);
  if (!w?.capacity) return "ok";
  const fill = (w.stock / w.capacity) * 100;
  if (fill < 25) return "alert";
  if (fill < 45) return "warn";
  return "ok";
}

export default function CameroonRadarMap({ warehouses = [], alerts = [] }) {
  const dangerIds = useMemo(
    () =>
      new Set(
        alerts.filter((a) => a.level === "danger").map((a) => a.warehouseId)
      ),
    [alerts]
  );

  const nodes = useMemo(
    () =>
      LOGISTICS_NODES.map((n) => ({
        ...n,
        status: nodeStatus(n.warehouseId, warehouses, dangerIds),
      })),
    [warehouses, dangerIds]
  );

  const nodeById = Object.fromEntries(nodes.map((n) => [n.warehouseId, n]));

  return (
    <div className="relative mx-auto aspect-[200/260] w-full max-w-md">
      {/* Grille de repère */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.08) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <svg
        viewBox="0 0 200 260"
        className="relative z-10 h-full w-full"
        aria-label="Carte radar Cameroun"
      >
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Cercles radar concentriques */}
        {[40, 70, 100, 130].map((r) => (
          <circle
            key={r}
            cx="100"
            cy="130"
            r={r}
            fill="none"
            stroke="rgba(34,211,238,0.12)"
            strokeWidth="0.5"
            strokeDasharray="4 6"
          />
        ))}

        <ellipse
          cx="100"
          cy="130"
          rx="130"
          ry="130"
          fill="url(#radarGlow)"
        />

        {/* Pays */}
        <path
          d={CAMEROON_PATH}
          fill="rgba(34,211,238,0.04)"
          stroke="rgba(34,211,238,0.45)"
          strokeWidth="1"
          strokeDasharray="6 4"
        />

        {/* Liaisons inter-nœuds */}
        {LINKS.map(([a, b]) => {
          const na = nodeById[a];
          const nb = nodeById[b];
          if (!na || !nb) return null;
          const alertLink = na.status === "alert" || nb.status === "alert";
          return (
            <line
              key={`${a}-${b}`}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke={alertLink ? "rgba(255,120,0,0.5)" : "rgba(34,211,238,0.35)"}
              strokeWidth="1"
              strokeDasharray={alertLink ? "2 4" : "none"}
            />
          );
        })}

        {/* Nœuds */}
        {nodes.map((node) => {
          const isAlert = node.status === "alert";
          const isWarn = node.status === "warn";
          const fill = isAlert
            ? "#ff5c00"
            : isWarn
              ? "#fbbf24"
              : "#22d3ee";
          const pulse = isAlert ? "hud-node-alert" : "";

          return (
            <g key={node.warehouseId} filter="url(#nodeGlow)">
              <circle
                cx={node.x}
                cy={node.y}
                r="6"
                fill={fill}
                fillOpacity="0.25"
                className={pulse}
              />
              <circle
                cx={node.x}
                cy={node.y}
                r="3"
                fill={fill}
                className={pulse}
              />
              <text
                x={node.x}
                y={node.y - 10}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="7"
                fontFamily="var(--font-geist-mono, monospace)"
              >
                {node.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Balayage radar */}
      <div
        className="pointer-events-none absolute left-1/2 top-[42%] z-20 h-[min(100%,280px)] w-[min(100%,280px)] -translate-x-1/2 -translate-y-1/2 rounded-full hud-radar-sweep"
        aria-hidden
      />

      <p className="absolute bottom-1 left-0 right-0 text-center font-mono text-[9px] uppercase tracking-[0.4em] text-cyan-500/50">
        Sector CM · Live Scan
      </p>
    </div>
  );
}
