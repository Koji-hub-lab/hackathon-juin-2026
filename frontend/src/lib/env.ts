/**
 * URL de base pour les appels API.
 * - Côté navigateur sans variable : proxy Next `/api` (rewrites en dev).
 * - Côté serveur sans variable : Spring Boot local sur le port 8080.
 */
export function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (configured) return configured;

  if (typeof window !== "undefined") {
    return "/api";
  }

  return "http://localhost:8080";
}
