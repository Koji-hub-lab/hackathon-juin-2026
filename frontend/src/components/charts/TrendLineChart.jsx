"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useMounted } from "@/hooks/useMounted";

// Taux de remplissage projeté par entrepôt (à partir des prédictions IA).
export default function TrendLineChart({ predictions = [] }) {
  const mounted = useMounted();
  const data = predictions.map((p) => ({
    name: p.warehouseName,
    "Remplissage %": p.fillPercent,
    "Jours avant rupture": p.daysUntilRupture,
  }));

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
      <h2 className="mb-4 text-lg font-bold text-blue-400">
        📈 Tendance de remplissage
      </h2>
      <div className="h-72 w-full">
        {/* Rendu différé au client : évite le warning Recharts (taille 0 au SSR). */}
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: 8,
                  color: "#f3f4f6",
                }}
              />
              <Line
                type="monotone"
                dataKey="Remplissage %"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Jours avant rupture"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
