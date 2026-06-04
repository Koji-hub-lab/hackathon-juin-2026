"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

import { useMounted } from "@/hooks/useMounted";

export default function StockBarChart({ warehouses = [] }) {
  const mounted = useMounted();
  const data = warehouses.map((w) => ({
    name: w.name?.split(" ")[0] ?? w.name,
    Stock: w.stock,
    Capacité: w.capacity,
  }));

  return (
    <div className="p-6 md:p-8">
      <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-orange-500">
        Stock par site
      </h2>
      <p className="mt-1 text-2xl font-black tracking-tight text-white">
        Capacité vs stock
      </p>
      <div className="mt-6 h-72 w-full">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
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
              <Legend wrapperStyle={{ fontSize: 11, color: "#737373" }} />
              <Bar dataKey="Capacité" fill="#262626" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Stock" fill="#ff5c00" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
