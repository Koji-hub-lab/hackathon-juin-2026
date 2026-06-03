"use client";

import { useEffect, useState } from "react";

/**
 * Retourne `true` une fois le composant monté côté client (après une frame).
 *
 * Utile pour les composants qui dépendent d'une mesure du DOM (ex. Recharts
 * `ResponsiveContainer`) : on évite ainsi le rendu côté serveur/prerender où la
 * taille du conteneur vaut 0/-1 (warning "width(-1) and height(-1)").
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return mounted;
}
