"use client";

import { useEffect, useState } from "react";
import { getWarehouses } from "@/services/warehouseService";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWarehouses()
      .then(setWarehouses)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Entrepôts</h1>
        <p className="text-sm text-gray-400">
          État des stocks et taux de remplissage par site
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Chargement…</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {warehouses.map((w) => {
            const fillPercent = Math.round((w.stock / w.capacity) * 100);
            const critical = fillPercent < 25;
            return (
              <div
                key={w.id}
                className="rounded-xl border border-gray-800 bg-gray-900 p-4"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-white">{w.name}</p>
                    <p className="text-xs text-gray-500">{w.city}</p>
                  </div>
                  {critical && <Badge variant="danger">⚠️ Critique</Badge>}
                </div>
                <ProgressBar percent={fillPercent} />
                <div className="mt-3 flex justify-between text-xs text-gray-400">
                  <span>
                    Stock : <span className="text-white">{w.stock}</span> / {w.capacity}
                  </span>
                  <span>Conso/sem : {w.weeklyUsage}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
