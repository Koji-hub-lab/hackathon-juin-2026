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
    <div className="relative h-full w-full min-h-0">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(249,115,22,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.06) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      <svg
        viewBox="0 0 200 260"
        className="relative z-10 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Radar Cameroun"
      >
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="rgba(249,115,22,0.12)" />
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

        {[40, 70, 100, 130].map((r) => (
          <circle
            key={r}
            cx="100"
            cy="130"
            r={r}
            fill="none"
            stroke="rgba(249,115,22,0.15)"
            strokeWidth="0.5"
            strokeDasharray="4 6"
          />
        ))}

        <ellipse cx="100" cy="130" rx="130" ry="130" fill="url(#radarGlow)" />

        <path
          d={CAMEROON_PATH}
          fill="rgba(249,115,22,0.03)"
          stroke="rgba(249,115,22,0.4)"
          strokeWidth="1"
          strokeDasharray="6 4"
        />

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
              stroke={
                alertLink
                  ? "rgba(249,115,22,0.7)"
                  : "rgba(255,255,255,0.15)"
              }
              strokeWidth="1"
              strokeDasharray={alertLink ? "2 3" : undefined}
            />
          );
        })}

        {nodes.map((node) => {
          const isAlert = node.status === "alert";
          const isWarn = node.status === "warn";
          const fill = isAlert
            ? "#f97316"
            : isWarn
              ? "#fb923c"
              : "#fafafa";
          const pulse = isAlert ? "hud-node-alert" : "";

          return (
            <g key={node.warehouseId} filter="url(#nodeGlow)">
              <circle
                cx={node.x}
                cy={node.y}
                r="6"
                fill={fill}
                fillOpacity={isAlert ? 0.35 : 0.15}
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
                fill="#a3a3a3"
                fontSize="7"
                fontFamily="var(--font-geist-mono, monospace)"
              >
                {node.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-20 aspect-square h-[85%] max-h-full w-[85%] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full hud-radar-sweep"
        aria-hidden
      />
    </div>
  );
}
