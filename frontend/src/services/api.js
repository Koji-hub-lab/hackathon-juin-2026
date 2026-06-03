import axios from "axios";

// Base URL du backend Spring Boot (port 8080 par défaut).
// Surchargée via NEXT_PUBLIC_API_URL dans .env.local si besoin.
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

export default api;
