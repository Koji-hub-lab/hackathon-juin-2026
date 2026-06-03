# Supply Chain Radar — Frontend

Tableau de bord **Next.js** (App Router, JavaScript, Tailwind) du projet **Supply Chain Radar** — Hackathon J.U.I.N 2026, Thème 10.

Superviseur multi-entrepôts avec prédiction IA de rupture de stock. Le backend **Spring Boot** (branche `backend`) écoute sur le port **8080** ; ce frontend tourne sur le port **3000**.

## Stack

- Next.js 16 (App Router) · React 19
- JavaScript (pas de TypeScript, convention équipe)
- Tailwind CSS v4
- Recharts (graphiques)
- Axios (appels REST)
- SockJS + `@stomp/stompjs` (WebSocket STOMP temps réel)

> Note : le README équipe mentionne Next.js 14 ; le projet a été initialisé avec Next.js 16 (compatible, App Router identique). Tailwind v4 remplace la config `tailwind.config.js` par une config CSS dans `globals.css`.

## Prérequis

- Node.js 20+
- npm

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

## Scripts

Depuis le dossier `frontend/` :

```bash
npm run dev    # next dev --turbopack (port 3000)
npm run build  # build de production
npm run start  # serveur de production (port 3000)
npm run lint   # ESLint
```

## Structure

```
src/
├── app/
│   ├── layout.js          # Sidebar + Navbar + thème sombre
│   ├── page.js            # redirige vers /dashboard
│   ├── dashboard/         # KPI, graphiques, widget IA, temps réel
│   ├── warehouses/        # taux de remplissage par entrepôt
│   ├── alerts/            # alertes filtrables par niveau
│   └── products/          # catalogue groupé par entrepôt
├── mock/data.js           # données simulées (Phase 1 + repli)
├── services/              # api.js (Axios) + services par domaine
├── components/
│   ├── layout/            # Sidebar, Navbar
│   ├── charts/            # StockBarChart, TrendLineChart (Recharts)
│   ├── widgets/           # StockCard, AlertCard, IAPredictionWidget
│   └── ui/                # Badge, ProgressBar
└── hooks/useSocket.js     # WebSocket STOMP (SockJS)
```

## Phase 1 / Phase 2 — intégration backend

Les services (`src/services/*`) appellent l'API réelle (`/api/...` sur le port 8080)
et **basculent automatiquement sur les mocks** (`src/mock/data.js`) si le backend
n'est pas joignable. Le dashboard est donc démontrable seul, et se connecte au
backend dès qu'il est lancé — sans modification de code.

Le hook `useSocket` se connecte à `ws://localhost:8080/ws` (topic `/topic/alerts`)
et affiche un badge « 🟢 Temps réel actif » lorsque la connexion STOMP est établie.

## Contrat API

Voir la Section 4 du README équipe (`/api/warehouses`, `/api/products`,
`/api/alerts`, `/api/predict`, `/api/inventory`, `/api/users`, `POST /api/movement`).
