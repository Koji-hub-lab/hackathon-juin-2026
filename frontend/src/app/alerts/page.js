"use client";

import { useEffect, useState } from "react";
import { getAlerts } from "@/services/alertService";
import AlertCard from "@/components/widgets/AlertCard";

const FILTERS = [
  { value: "", label: "Toutes" },
  { value: "danger", label: "🔴 Critiques" },
  { value: "warning", label: "🟡 Avertissements" },
  { value: "info", label: "🔵 Infos" },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const data = await getAlerts(level || undefined);
      if (active) {
        setAlerts(data);
        setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [level]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Alertes</h1>
        <p className="text-sm text-gray-400">
          Goulots d&apos;étranglement et seuils critiques
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value || "all"}
            type="button"
            onClick={() => setLevel(f.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              level === f.value
                ? "bg-blue-500/20 text-blue-300"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Chargement…</p>
      ) : (
        <div className="space-y-3">
          {alerts.length === 0 && (
            <p className="text-sm text-gray-500">Aucune alerte pour ce filtre.</p>
          )}
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}
