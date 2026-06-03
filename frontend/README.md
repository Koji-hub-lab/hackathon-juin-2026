# Hackathon Juin 2026 — Frontend

Application **Next.js** (App Router, TypeScript, Tailwind) dans le dossier `frontend/` du dépôt [hackathon-juin-2026](https://github.com/Koji-hub-lab/hackathon-juin-2026).

Le backend **Spring Boot** (JPA, MySQL) vit sur la branche [`backend`](https://github.com/koji-hub-lab/hackathon-juin-2026/tree/backend) et écoute par défaut sur le port **8080**.

## Prérequis

- Node.js 20+
- npm
- Backend optionnel en local pour tester les appels API

## Installation

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

## Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `NEXT_PUBLIC_API_URL` | URL du backend Spring Boot | `http://localhost:8080` |

En développement, les requêtes vers `/api/*` sont proxifiées vers le backend via `next.config.ts` (évite les problèmes CORS).

## Scripts

Depuis le dossier `frontend/` :

```bash
npm run dev    # next dev --turbopack
npm run build  # build de production
npm run start  # serveur de production
npm run lint   # ESLint
```

## Structure du projet

```
src/
├── app/           # routes App Router
├── components/ui/ # composants réutilisables
├── hooks/         # hooks React client
├── lib/api/       # client HTTP vers le backend
└── types/         # types globaux
```

Les appels HTTP passent par `src/lib/api/client.ts` (`apiGet`, etc.).

## Branches du dépôt

| Emplacement | Stack |
|-------------|--------|
| `frontend/` (cette branche) | Next.js |
| branche `backend` | Spring Boot + MySQL |

Chaque stack se déploie indépendamment ; synchroniser les contrats API (DTO) au fil du développement.

## Backend local

Sur la branche `backend` :

```bash
./mvnw spring-boot:run
```

Configurer MySQL selon `src/main/resources/application.properties` avant de lancer l'API.
