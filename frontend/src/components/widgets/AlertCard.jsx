"use client";

import Badge from "@/components/ui/Badge";

const ICONS = { danger: "●", warning: "●", info: "●" };
const DOT = { danger: "text-rose-500", warning: "text-amber-400", info: "text-orange-400/80" };
const LABELS = { danger: "Critique", warning: "Watch", info: "Info" };

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AlertCard({ alert }) {
  const level = alert.level || "info";
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition-colors hover:border-orange-500/25 hover:bg-orange-500/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <span className={`mt-1 text-lg leading-none ${DOT[level] || DOT.info}`}>
            {ICONS[level] || "●"}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium leading-snug text-white">
              {alert.message}
            </p>
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-neutral-600">
              {alert.type} · #{alert.warehouseId} · {formatDate(alert.createdAt)}
            </p>
          </div>
        </div>
        <Badge variant={level}>{LABELS[level] || level}</Badge>
      </div>
    </div>
  );
}
