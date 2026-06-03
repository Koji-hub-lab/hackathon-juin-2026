"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import { getWarehouses } from "@/services/warehouseService";
import Badge from "@/components/ui/Badge";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getWarehouses()])
      .then(([p, w]) => {
        setProducts(p);
        setWarehouses(w);
      })
      .finally(() => setLoading(false));
  }, []);

  const warehouseName = (id) =>
    warehouses.find((w) => w.id === id)?.name || `Entrepôt #${id}`;

  // Regroupe les produits par entrepôt.
  const grouped = products.reduce((acc, p) => {
    (acc[p.warehouseId] = acc[p.warehouseId] || []).push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Produits</h1>
        <p className="text-sm text-gray-400">Catalogue par entrepôt</p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Chargement…</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([warehouseId, items]) => (
            <div key={warehouseId}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
                {warehouseName(Number(warehouseId))}
              </h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => {
                  const below = p.quantity < p.minThreshold;
                  return (
                    <div
                      key={p.id}
                      className="rounded-xl border border-gray-800 bg-gray-900 p-4"
                    >
                      <div className="flex items-start justify-between">
                        <p className="font-medium text-white">{p.name}</p>
                        {below && <Badge variant="danger">⚠️ Sous seuil</Badge>}
                      </div>
                      <p className="mt-2 text-2xl font-bold text-blue-400">
                        {p.quantity}{" "}
                        <span className="text-sm font-normal text-gray-500">
                          {p.unit}
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Seuil minimum : {p.minThreshold} {p.unit}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
