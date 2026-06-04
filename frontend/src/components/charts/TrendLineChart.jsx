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

export default function TrendLineChart({ predictions = [] }) {
  const mounted = useMounted();
  const data = predictions.map((p) => ({
    name: p.warehouseName?.split(" ")[0] ?? p.warehouseName,
    "Remplissage %": p.fillPercent,
    "Jours rupture": p.daysUntilRupture,
  }));

  return (
    <div className="p-6 md:p-8">
      <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-orange-500">
        Tendance IA
      </h2>
      <p className="mt-1 text-2xl font-black tracking-tight text-white">
        Remplissage & horizon
      </p>
      <div className="mt-6 h-72 w-full">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" stroke="#525252" fontSize={11} tickLine={false} />
              <YAxis stroke="#525252" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid rgba(255,92,0,0.3)",
                  borderRadius: 12,
                  color: "#fafafa",
                }}
              />
              <Line
                type="monotone"
                dataKey="Remplissage %"
                stroke="#ff5c00"
                strokeWidth={2}
                dot={{ r: 3, fill: "#ff5c00" }}
              />
              <Line
                type="monotone"
                dataKey="Jours rupture"
                stroke="#737373"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
