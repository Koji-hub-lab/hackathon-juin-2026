"use client";

export default function ConnectionBadge({ connected }) {
  if (connected) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-40" />
          <span className="relative h-2 w-2 rounded-full bg-blue-600" />
        </span>
        En ligne
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
      <span className="h-2 w-2 rounded-full bg-slate-400" />
      Hors ligne
    </span>
  );
}
