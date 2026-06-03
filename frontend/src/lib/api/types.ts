/** Réponse d'erreur générique renvoyée par l'API Spring Boot. */
export interface ApiErrorBody {
  message?: string;
  error?: string;
  status?: number;
}
