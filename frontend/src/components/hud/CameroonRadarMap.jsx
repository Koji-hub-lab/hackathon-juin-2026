"use client";

import { useMemo, useId } from "react";
import {
  CAMEROON_SVG_PATH,
  LOGISTICS_CITIES,
  MAP_CENTER,
  MAP_VIEWBOX,
  projectLatLon,
} from "@/lib/cameroonGeo";

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

function WarehouseMarker({ node, uid }) {
  const isAlert = node.status === "alert";
  const isWarn = node.status === "warn";
  const { x, y } = node.projected;
  const labelX = x + 12;
  const labelY = y + 4;

  return (
    <g>
      {isAlert && (
        <>
          <circle
            cx={x}
            cy={y}
            r="14"
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.5"
            opacity="0.5"
            className="map-alert-ripple"
          />
          <circle
            cx={x}
            cy={y}
            r="20"
            fill="none"
            stroke="#ef4444"
            strokeWidth="1"
            opacity="0.25"
            className="map-alert-ripple-delayed"
          />
        </>
      )}

      <circle
        cx={x}
        cy={y}
        r="8"
        fill={isAlert ? "#fecaca" : isWarn ? "#fef3c7" : "#dbeafe"}
        filter={`url(#shadow-${uid})`}
      />
      <circle
        cx={x}
        cy={y}
        r="5"
        fill={isAlert ? "#ef4444" : isWarn ? "#f59e0b" : "#2563eb"}
        className={isAlert ? "hud-node-critical" : ""}
      />

      <text
        x={labelX}
        y={labelY}
        textAnchor="start"
        fill="#334155"
        fontSize="11"
        fontWeight="600"
        fontFamily="var(--font-geist-sans, system-ui)"
      >
        {node.name}
      </text>
    </g>
  );
}

export default function CameroonRadarMap({ warehouses = [], alerts = [] }) {
  const uid = useId().replace(/:/g, "");

  const dangerIds = useMemo(
    () =>
      new Set(
        alerts.filter((a) => a.level === "danger").map((a) => a.warehouseId)
      ),
    [alerts]
  );

  const nodes = useMemo(
    () =>
      LOGISTICS_CITIES.map((city) => ({
        ...city,
        status: nodeStatus(city.warehouseId, warehouses, dangerIds),
        projected: projectLatLon(city.lon, city.lat),
      })),
    [warehouses, dangerIds]
  );

  const nodeById = Object.fromEntries(nodes.map((n) => [n.warehouseId, n]));
  const { width, height } = MAP_VIEWBOX;
  const cx = MAP_CENTER.x;
  const cy = MAP_CENTER.y;
  const maxR = Math.min(width, height) * 0.48;

  return (
    <div className="relative h-full w-full min-h-0 rounded-xl bg-blue-50/40">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="relative z-10 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Carte du Cameroun — entrepôts logistiques"
      >
        <defs>
          <filter id={`shadow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#64748b" floodOpacity="0.35" />
          </filter>
          <radialGradient id={`radarGlow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(37,99,235,0.1)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Cercles radar (centre géographique) */}
        {[0.35, 0.55, 0.75, 0.95].map((ratio) => (
          <circle
            key={ratio}
            cx={cx}
            cy={cy}
            r={maxR * ratio}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}

        <ellipse
          cx={cx}
          cy={cy}
          rx={maxR}
          ry={maxR}
          fill={`url(#radarGlow-${uid})`}
        />

        {/* Pays — contour GeoJSON réel */}
        <path
          d={CAMEROON_SVG_PATH}
          fill="#f1f5f9"
          stroke="#cbd5e1"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Liaisons logistiques */}
        {LINKS.map(([a, b]) => {
          const na = nodeById[a];
          const nb = nodeById[b];
          if (!na || !nb) return null;
          const critical = na.status === "alert" || nb.status === "alert";
          return (
            <line
              key={`${a}-${b}`}
              x1={na.projected.x}
              y1={na.projected.y}
              x2={nb.projected.x}
              y2={nb.projected.y}
              stroke={critical ? "#fca5a5" : "#e2e8f0"}
              strokeWidth={critical ? 2 : 1.5}
              strokeDasharray={critical ? "4 3" : undefined}
            />
          );
        })}

        {nodes.map((node) => (
          <WarehouseMarker key={node.warehouseId} node={node} uid={uid} />
        ))}
      </svg>

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 aspect-square h-[90%] w-[90%] max-h-full max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full hud-radar-sweep opacity-70"
        aria-hidden
      />
    </div>
  );
}
