export default function Loading() {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4"
      style={{ color: "#f3f4f6" }}
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
        aria-hidden
      />
      <p className="text-sm text-gray-400">Chargement Supply Chain Radar…</p>
    </div>
  );
}
