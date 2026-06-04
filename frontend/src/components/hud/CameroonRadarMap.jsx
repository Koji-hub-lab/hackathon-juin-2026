"use client";

import { useMemo } from "react";

const CAMEROON_PATH =
  "M 72 28 L 128 24 L 148 58 L 158 98 L 152 148 L 138 198 L 108 238 L 78 248 L 48 228 L 36 178 L 40 128 L 52 72 Z";

export const LOGISTICS_NODES = [
  { warehouseId: 1, name: "Douala", x: 48, y: 218 },
  { warehouseId: 2, name: "Yaoundé", x: 102, y: 168 },
  { warehouseId: 3, name: "Bafoussam", x: 58, y: 148 },
  { warehouseId: 4, name: "Garoua", x: 112, y: 48 },
];

const LINKS = [[1, 2], [2, 3], [2, 4], [1, 3]];

const NODE_COLORS = {
  ok: { fill: "#2563eb", ring: "#93c5fd" },
  warn: { fill: "#f59e0b", ring: "#fcd34d" },
  alert: { fill: "#dc2626", ring: "#fca5a5" },
};

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
    <div className="relative h-full w-full min-h-0 rounded-xl bg-slate-50/80">
      <svg
        viewBox="0 0 200 260"
        className="relative z-10 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Cartographie radar Cameroun"
      >
        <defs>
          <radialGradient id="radarGlowLight" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="rgba(37,99,235,0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {[40, 70, 100, 130].map((r) => (
          <circle
            key={r}
            cx="100"
            cy="130"
            r={r}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="0.75"
          />
        ))}

        <ellipse cx="100" cy="130" rx="130" ry="130" fill="url(#radarGlowLight)" />

        <path
          d={CAMEROON_PATH}
          fill="rgba(37,99,235,0.04)"
          stroke="#94a3b8"
          strokeWidth="1.2"
        />

        {LINKS.map(([a, b]) => {
          const na = nodeById[a];
          const nb = nodeById[b];
          if (!na || !nb) return null;
          const critical = na.status === "alert" || nb.status === "alert";
          return (
            <line
              key={`${a}-${b}`}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke={critical ? "#fecaca" : "#e2e8f0"}
              strokeWidth="1.5"
            />
          );
        })}

        {nodes.map((node) => {
          const colors = NODE_COLORS[node.status] || NODE_COLORS.ok;
          const pulse = node.status === "alert" ? "hud-node-critical" : "";

          return (
            <g key={node.warehouseId}>
              <circle
                cx={node.x}
                cy={node.y}
                r="7"
                fill={colors.ring}
                fillOpacity="0.35"
              />
              <circle
                cx={node.x}
                cy={node.y}
                r="4"
                fill={colors.fill}
                className={pulse}
              />
              <text
                x={node.x}
                y={node.y - 11}
                textAnchor="middle"
                fill="#475569"
                fontSize="8"
                fontWeight="500"
                fontFamily="var(--font-geist-sans, system-ui)"
              >
                {node.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 aspect-square h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full hud-radar-sweep"
        aria-hidden
      />
    </div>
  );
}
