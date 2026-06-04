# Démarrage local — frontend (Cloud Agent / Cursor)

## Le serveur tourne, mais le navigateur affiche `ERR_CONNECTION_REFUSED` ?

Sur un **agent cloud**, `http://localhost:3000` dans **Chrome/Firefox sur ton PC**
pointe vers **ton ordinateur**, pas vers la machine distante où tourne Next.js.

Le frontend peut être **OK sur la VM** (logs `✓ Ready`, `GET /dashboard 200`)
tout en refusant la connexion dans un navigateur externe sans **port forwarding**.

## Démarrage

```bash
cd frontend
npm run dev
```

Attendre : `✓ Ready` et `Network: http://0.0.0.0:3000`.

## Ouvrir l’app dans le navigateur (Cursor)

1. Panneau **Ports** (barre latérale ou `View` → `Ports`).
2. **Forward** (ou **Open**) le port **3000**.
3. Cliquer sur l’URL proposée par Cursor (souvent `localhost:3000` **via le tunnel**).
4. Aller sur `/dashboard` :  
   `http://localhost:3000/dashboard`

Ne pas lancer un second `npm run dev` si tu vois `EADDRINUSE` — un serveur tourne déjà.

## Libérer le port 3000

```bash
pkill -f "next dev"
pkill -f next-server
npm run dev
```

## Page blanche ou onglet qui « tourne » sans rien afficher

Souvent l’une de ces causes :

1. **Port 3000 non forwardé** — le HTML ou les fichiers `/_next/static/*` ne passent pas le tunnel : fond blanc, onglet en chargement. Vérifier **Ports → Forward 3000**, puis ouvrir l’URL proposée par Cursor (pas une autre machine).
2. **Turbopack / HMR** — en tunnel, le WebSocket HMR peut échouer. Utiliser le script par défaut `npm run dev` (Webpack, sans `--turbopack`). Turbopack optionnel : `npm run dev:turbo`.
3. **Crash JavaScript** — ouvrir les DevTools (F12) → Console. Si erreur `global is not defined`, mettre à jour le frontend (hook `useSocket` avec imports dynamiques).

Test rapide sur la VM :

```bash
curl -sI http://127.0.0.1:3000/dashboard | head -1
# doit afficher HTTP/1.1 200 OK
```

Mode plus stable (build de prod) :

```bash
npm run build && npm run start
```

## Port alternatif

```bash
npx next dev -H 0.0.0.0 -p 3005
```

Puis forwarder le port **3005** dans Cursor.

## Backend (API)

```bash
cd ../backend
./start.sh
```

API : http://localhost:8080 — forwarder aussi le port **8080** si le dashboard appelle l’API.
