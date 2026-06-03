# 🚀 Supply Chain Radar

Superviseur multi-entrepôts avec prédiction IA de rupture de stock — Hackathon J.U.I.N 2026, Thème 10.

## Structure

| Dossier / branche | Stack | Port |
|-------------------|--------|------|
| [`frontend/`](frontend/) | Next.js (App Router, JavaScript, Tailwind, Recharts, SockJS) | `3000` |
| Branche `backend` | Spring Boot 3 + Java 17 + Lombok + Swagger + WebSocket STOMP | `8080` |

## Démarrage rapide — frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Le frontend démarre sur http://localhost:3000 et fonctionne même sans backend
(repli automatique sur des données simulées). Dès que le backend Spring Boot
tourne sur le port 8080, les appels REST et le WebSocket temps réel se branchent
automatiquement.

Documentation détaillée : [frontend/README.md](frontend/README.md).

## Branches Git

- `frontend` — application Next.js dans `frontend/`
- `backend` — API Spring Boot
