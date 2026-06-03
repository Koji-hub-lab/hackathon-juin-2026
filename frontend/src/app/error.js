"use client";

export default function Error({ error, reset }) {
  return (
    <div className="mx-auto max-w-lg rounded-xl border border-red-900/50 bg-gray-900 p-6">
      <h2 className="text-lg font-bold text-red-400">Erreur d&apos;affichage</h2>
      <p className="mt-2 text-sm text-gray-400">
        {error?.message || "Une erreur a empêché le chargement de la page."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
      >
        Réessayer
      </button>
    </div>
  );
}
