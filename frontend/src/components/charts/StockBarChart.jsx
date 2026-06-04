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
import CyberPanel from "@/components/cyber/CyberPanel";

// Stock vs capacité par entrepôt.
export default function StockBarChart({ warehouses = [] }) {
  const mounted = useMounted();
  const data = warehouses.map((w) => ({
    name: w.name,
    Stock: w.stock,
    Capacité: w.capacity,
  }));

  return (
    <CyberPanel className="p-5">
      <h2 className="mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text font-mono text-sm font-bold uppercase tracking-wider text-transparent">
        Stock par entrepôt
      </h2>
      <div className="h-72 w-full">
        {/* Rendu différé au client : évite le warning Recharts (taille 0 au SSR). */}
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
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
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Capacité" fill="#374151" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Stock" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </CyberPanel>
  );
}
