# Implementation Roadmaps — Hackathon Juin 2026

> **Source de vérité :** [`docs/project-context.md`](./project-context.md)  
> **Rôle :** Document d'architecture — découpage en tâches implémentables pour le MVP hackathon.  
> **Convention IDs :** `DB-xx` (database), `BE-xx` (backend), `FE-xx` (frontend), `INT-xx` (integration)

---

## Vue d'ensemble des dépendances inter-roadmaps

```
Phase 0 — Fondations
  DB-01 → DB-02 → DB-03 → DB-04 → DB-05 → DB-06
                ↓
Phase 1 — Backend core          Phase 1 — Frontend foundation (parallèle)
  BE-01..BE-08                  FE-01..FE-05
                ↓                       ↓
Phase 2 — Stock + Dashboard API
  BE-09..BE-14
                ↓
Phase 3 — Frontend features
  FE-06..FE-14
                ↓
Phase 4 — Intégration
  INT-01..INT-07
```

**Règle de parallélisation :** le frontend peut démarrer dès `FE-01` en parallèle du backend, mais les pages métier (`FE-06+`) dépendent des endpoints correspondants. L'intégration (`INT-xx`) ne démarre qu'une fois au moins un flux API stable est disponible.

---

## 1. Database Roadmap

Objectif : mettre en place le schéma MySQL, les contraintes, les index et les données de seed nécessaires au MVP.

---

### DB-01 — Provisionner l'environnement MySQL local

**Description**  
Configurer une instance MySQL 8 accessible en local pour le développement. Créer la base `hackathon` avec le timezone `Africa/Douala`. Documenter les credentials dans le README backend. Option recommandée : Docker Compose pour reproductibilité équipe.

**Dépendances**  
Aucune

**Critères d'acceptation**
- [ ] MySQL 8 tourne en local (ou via Docker) sur le port 3306
- [ ] La base `hackathon` existe et est accessible avec les credentials documentés
- [ ] Le paramètre `serverTimezone=Africa/Douala` est compatible avec la connexion Spring Boot
- [ ] `./mvnw spring-boot:run` démarre sans erreur de connexion datasource

---

### DB-02 — Modéliser et créer la table `category`

**Description**  
Implémenter l'entité JPA `Category` conforme au schéma : `id`, `name` (UNIQUE), `description`, `created_at`, `updated_at`. Hibernate doit créer/mettre à jour la table via `ddl-auto=update`. Valider la contrainte d'unicité sur `name`.

**Dépendances**  
DB-01

**Critères d'acceptation**
- [ ] La table `category` est créée au démarrage de l'application
- [ ] `name` est NOT NULL et UNIQUE
- [ ] `created_at` et `updated_at` sont renseignés automatiquement
- [ ] Insertion de deux catégories avec le même nom → erreur de contrainte

---

### DB-03 — Modéliser et créer la table `product`

**Description**  
Implémenter l'entité JPA `Product` avec relation `@ManyToOne` vers `Category`. Colonnes : `name`, `sku` (UNIQUE), `description`, `price`, `quantity`, `min_threshold`, timestamps. Contraintes : `price >= 0`, `quantity >= 0`, `min_threshold >= 0`.

**Dépendances**  
DB-02

**Critères d'acceptation**
- [ ] La table `product` est créée avec FK `category_id → category.id`
- [ ] `sku` est NOT NULL et UNIQUE
- [ ] Un produit sans catégorie valide est rejeté (FK violation)
- [ ] Les valeurs négatives pour `price`, `quantity`, `min_threshold` sont rejetées

---

### DB-04 — Modéliser et créer la table `stock_movement`

**Description**  
Implémenter l'entité JPA `StockMovement` avec relation `@ManyToOne` vers `Product`. Colonnes : `type` (ENUM `IN`, `OUT`, `ADJUST`), `quantity` (> 0), `reason`, `created_at`. La suppression d'un produit avec mouvements doit être gérée au niveau service (pas de CASCADE DELETE).

**Dépendances**  
DB-03

**Critères d'acceptation**
- [ ] La table `stock_movement` est créée avec FK `product_id → product.id`
- [ ] Seules les valeurs `IN`, `OUT`, `ADJUST` sont acceptées pour `type`
- [ ] `quantity` doit être strictement positif
- [ ] Un mouvement référence obligatoirement un produit existant

---

### DB-05 — Ajouter les index de performance

**Description**  
Créer les index recommandés dans `project-context.md` : `idx_product_category`, `idx_product_sku`, `idx_product_quantity`, `idx_movement_product`, `idx_movement_created`. Utiliser `@Index` JPA ou script Flyway/Liquibase si l'équipe choisit les migrations.

**Dépendances**  
DB-04

**Critères d'acceptation**
- [ ] Les 5 index existent en base après démarrage
- [ ] `EXPLAIN` sur une requête filtrée par `category_id` utilise l'index
- [ ] `EXPLAIN` sur une requête filtrée par `sku` utilise l'index
- [ ] Aucune régression sur le démarrage application

---

### DB-06 — Créer le script de seed de développement

**Description**  
Charger des données initiales au démarrage (profil `dev` uniquement) : 3–5 catégories, 10–20 produits, 5–10 mouvements de stock variés. Inclure au moins 2 produits en alerte (`quantity <= min_threshold`) et 1 produit en rupture (`quantity = 0`).

**Dépendances**  
DB-04

**Critères d'acceptation**
- [ ] Au moins 3 catégories seedées
- [ ] Au moins 10 produits répartis dans les catégories
- [ ] Au moins 5 mouvements (mix IN/OUT/ADJUST)
- [ ] Au moins 2 produits en statut alerte LOW et 1 en statut OUT
- [ ] Le seed est idempotent (pas de doublons au redémarrage) ou clairement limité au profil `dev`

---

## 2. Backend Roadmap

Objectif : exposer une API REST complète pour produits, catégories, stock et dashboard, conforme à la spec API de `project-context.md`.

---

### BE-01 — Structurer les packages backend

**Description**  
Créer l'arborescence packages définie dans `project-context.md` : `config`, `controller`, `dto`, `entity`, `repository`, `service`, `exception`. S'assurer que l'application Spring Boot scanne correctement tous les packages.

**Dépendances**  
DB-01

**Critères d'acceptation**
- [ ] Tous les packages existent sous `com.example.hackathon`
- [ ] L'application démarre sans erreur de component scan
- [ ] La structure correspond au diagramme d'architecture documenté

---

### BE-02 — Implémenter la gestion centralisée des erreurs

**Description**  
Créer `GlobalExceptionHandler`, `ApiErrorDto`, et les exceptions métier (`ResourceNotFoundException`, `InsufficientStockException`). Toutes les erreurs API retournent un JSON `{ message, error?, status }` avec le code HTTP approprié (400, 404, 409, 500).

**Dépendances**  
BE-01

**Critères d'acceptation**
- [ ] Une ressource inexistante retourne HTTP 404 avec body JSON structuré
- [ ] Une validation `@Valid` échouée retourne HTTP 400 avec message explicite
- [ ] Un conflit métier (ex. SKU dupliqué) retourne HTTP 409
- [ ] Aucune stack trace n'est exposée au client en réponse API

---

### BE-03 — Configurer CORS et préfixe API

**Description**  
Configurer `CorsConfig` pour autoriser le frontend Next.js en dev (`localhost:3000`) et préparer les origines prod. Standardiser le préfixe `/api` sur tous les controllers REST.

**Dépendances**  
BE-01

**Critères d'acceptation**
- [ ] Les requêtes depuis `http://localhost:3000` ne sont pas bloquées par CORS
- [ ] Tous les endpoints sont sous `/api/*`
- [ ] Les headers `Accept: application/json` et `Content-Type: application/json` sont supportés
- [ ] La configuration prod est externalisée (variable ou profil)

---

### BE-04 — API CRUD Catégories

**Description**  
Implémenter `Category` entity/repository/service/controller/DTO. Endpoints : `GET /api/categories`, `POST /api/categories`, `PUT /api/categories/{id}`, `DELETE /api/categories/{id}`. Inclure `productCount` dans la réponse GET. Rejeter DELETE si la catégorie contient des produits (409).

**Dépendances**  
DB-02, BE-02

**Critères d'acceptation**
- [ ] CRUD catégories fonctionnel via curl/Postman
- [ ] `GET /api/categories` retourne `productCount` par catégorie
- [ ] DELETE sur catégorie avec produits → HTTP 409
- [ ] Nom de catégorie dupliqué → HTTP 409

---

### BE-05 — Repository et entité Product

**Description**  
Implémenter `ProductRepository` avec méthodes de recherche : par SKU, par catégorie, pagination, recherche texte (name/sku), filtre alerte. Mapper l'entité vers `ProductDto` incluant `categoryName` et `alertStatus` (`OK`, `LOW`, `OUT`).

**Dépendances**  
DB-03, BE-04

**Critères d'acceptation**
- [ ] `ProductRepository` supporte pagination Spring Data
- [ ] Recherche par `search` couvre `name` et `sku`
- [ ] `alertStatus` est calculé correctement : OK / LOW / OUT
- [ ] `ProductDto` inclut `categoryId` et `categoryName`

---

### BE-06 — Service Product (règles métier)

**Description**  
Implémenter `ProductService` : création, lecture, mise à jour, suppression. Règles : SKU unique, catégorie existante, `quantity` non modifiable via PUT (uniquement via mouvements), suppression interdite si mouvements historiques existent.

**Dépendances**  
BE-05

**Critères d'acceptation**
- [ ] Création avec SKU dupliqué → exception → HTTP 409
- [ ] Création avec `categoryId` invalide → HTTP 404
- [ ] PUT ne modifie pas `quantity` directement
- [ ] DELETE refusé si des `stock_movement` existent pour le produit

---

### BE-07 — Controller Product CRUD

**Description**  
Exposer les endpoints : `GET /api/products`, `GET /api/products/{id}`, `POST /api/products`, `PUT /api/products/{id}`, `DELETE /api/products/{id}`. Validation `@Valid` sur les DTOs d'entrée. Codes HTTP conformes à la spec (201, 200, 204, 400, 404, 409).

**Dépendances**  
BE-06, BE-03

**Critères d'acceptation**
- [ ] Tous les endpoints produits répondent conformément à la spec section 7.1
- [ ] `GET /api/products` supporte `page`, `size`, `search`, `categoryId`, `alertOnly`
- [ ] POST retourne HTTP 201 avec le produit créé
- [ ] DELETE retourne HTTP 204 en succès

---

### BE-08 — Pagination et filtres produits

**Description**  
Finaliser la réponse paginée `{ content, totalElements, totalPages, page, size }`. Optimiser les requêtes avec les index DB. Valider performance < 500 ms pour 1000 produits (NFR-01).

**Dépendances**  
BE-07, DB-05

**Critères d'acceptation**
- [ ] Structure de réponse paginée conforme à la spec
- [ ] Filtre `alertOnly=true` ne retourne que LOW et OUT
- [ ] Filtre `categoryId` fonctionne correctement
- [ ] Temps de réponse < 500 ms sur jeu de seed (benchmark manuel)

---

### BE-09 — Repository et entité StockMovement

**Description**  
Implémenter `StockMovementRepository` avec pagination et filtre optionnel `productId`. Créer `StockMovementDto` pour les réponses incluant `newQuantity` après mouvement.

**Dépendances**  
DB-04, BE-05

**Critères d'acceptation**
- [ ] Entité et repository fonctionnels
- [ ] Historique paginé par produit ou global
- [ ] DTO inclut `id`, `productId`, `type`, `quantity`, `reason`, `newQuantity`, `createdAt`

---

### BE-10 — Service Stock (logique transactionnelle)

**Description**  
Implémenter `StockService` : enregistrer mouvement IN/OUT/ADJUST, mettre à jour `product.quantity` atomiquement dans une `@Transactional`. Règles : OUT refusé si stock insuffisant, ADJUST remplace la quantité ou ajuste relativement (définir et documenter le comportement ADJUST).

**Dépendances**  
BE-09, BE-06

**Critères d'acceptation**
- [ ] Mouvement IN augmente `quantity` correctement
- [ ] Mouvement OUT diminue `quantity` et est refusé si stock insuffisant (HTTP 400)
- [ ] Mouvement et mise à jour quantité sont atomiques (rollback en cas d'erreur)
- [ ] Produit inexistant → HTTP 404

---

### BE-11 — Controller Stock Movements

**Description**  
Exposer `POST /api/stock/movements` et `GET /api/stock/movements`. Validation du body (`productId`, `type`, `quantity`, `reason`). Réponse 201 avec `newQuantity`.

**Dépendances**  
BE-10, BE-03

**Critères d'acceptation**
- [ ] POST crée un mouvement et retourne HTTP 201 conforme spec section 7.3
- [ ] GET retourne historique paginé avec filtre `productId`
- [ ] Type invalide → HTTP 400
- [ ] `quantity <= 0` → HTTP 400

---

### BE-12 — Service Dashboard (agrégations KPI)

**Description**  
Implémenter `DashboardService` : calculer `totalProducts`, `totalStockUnits`, `totalStockValue`, `alertCount`, `outOfStockCount`, `categoryBreakdown`. Utiliser requêtes JPQL/@Query optimisées.

**Dépendances**  
BE-05, BE-10, DB-06

**Critères d'acceptation**
- [ ] `totalProducts` = COUNT produits
- [ ] `totalStockUnits` = SUM(quantity)
- [ ] `totalStockValue` = SUM(quantity × price)
- [ ] `alertCount` = produits avec `0 < quantity <= min_threshold`
- [ ] `outOfStockCount` = produits avec `quantity = 0`
- [ ] `categoryBreakdown` agrège par catégorie (productCount, totalQuantity, totalValue)

---

### BE-13 — Controller Dashboard

**Description**  
Exposer `GET /api/dashboard/summary` et `GET /api/dashboard/alerts`. Le endpoint alerts retourne la liste des produits en alerte (LOW + OUT) triés par criticité (OUT first).

**Dépendances**  
BE-12, BE-03

**Critères d'acceptation**
- [ ] `GET /api/dashboard/summary` retourne JSON conforme spec section 7.4
- [ ] `GET /api/dashboard/alerts` retourne produits LOW et OUT
- [ ] Les valeurs correspondent aux données seed
- [ ] Réponse en < 500 ms

---

### BE-14 — Tests backend (unitaires et intégration légers)

**Description**  
Ajouter tests pour les règles métier critiques : SKU unique, stock insuffisant, calcul alertStatus, agrégations dashboard. Utiliser `@SpringBootTest` ou `@DataJpaTest` + tests service. Pas de suite E2E complète (hors scope MVP).

**Dépendances**  
BE-11, BE-13

**Critères d'acceptation**
- [ ] Test : OUT avec stock insuffisant → exception
- [ ] Test : SKU dupliqué → exception
- [ ] Test : alertStatus LOW/OUT/OK calculé correctement
- [ ] `./mvnw test` passe sans erreur

---

## 3. Frontend Roadmap

Objectif : livrer l'interface Next.js complète consommant l'API backend, avec dashboard, CRUD produits, mouvements stock et alertes.

---

### FE-01 — Consolider le scaffolding Next.js

**Description**  
Intégrer ou vérifier le scaffolding de la branche `cursor/init-nextjs-6535` sur `frontend` : App Router, TypeScript, Tailwind 4, `next.config.ts` (proxy `/api/*`), `.env.local.example`, structure dossiers. S'assurer que `npm run dev`, `npm run build`, `npm run lint` passent.

**Dépendances**  
Aucune (parallèle à DB/BE)

**Critères d'acceptation**
- [ ] `npm run dev` démarre sur port 3000
- [ ] `npm run build` réussit sans erreur
- [ ] `npm run lint` passe
- [ ] Proxy `/api/*` → `localhost:8080` configuré dans `next.config.ts`

---

### FE-02 — Étendre le client HTTP API

**Description**  
Compléter `src/lib/api/client.ts` avec `apiPost`, `apiPut`, `apiDelete` en plus de `apiGet`. Gestion uniforme des erreurs HTTP (parse `ApiErrorBody`, throw avec message lisible). Conserver `cache: "no-store"` par défaut (FR-DB04).

**Dépendances**  
FE-01

**Critères d'acceptation**
- [ ] Quatre méthodes HTTP disponibles et typées génériquement
- [ ] Erreur 4xx/5xx lève une exception avec `message` du backend
- [ ] Headers `Content-Type: application/json` envoyés sur POST/PUT
- [ ] DELETE gère correctement les réponses 204 sans body

---

### FE-03 — Définir les types TypeScript (contrats API)

**Description**  
Créer les interfaces dans `src/lib/api/types.ts` et `src/types/` : `Product`, `Category`, `StockMovement`, `DashboardSummary`, `PaginatedResponse<T>`, `AlertProduct`, `AlertStatus`. Aligner strictement sur la spec API section 7.

**Dépendances**  
FE-02

**Critères d'acceptation**
- [ ] Tous les DTO API section 7 ont une interface TypeScript correspondante
- [ ] `AlertStatus` = `'OK' | 'LOW' | 'OUT'`
- [ ] `PaginatedResponse<Product>` inclut `content`, `totalElements`, `totalPages`, `page`, `size`
- [ ] Types exportés et réutilisables par hooks et composants

---

### FE-04 — Layout applicatif et navigation

**Description**  
Créer un layout principal avec header, navigation latérale ou tabs : Dashboard, Produits, Mouvements, Alertes. Langue française. Liens actifs selon la route courante. Responsive basique (mobile-friendly).

**Dépendances**  
FE-01

**Critères d'acceptation**
- [ ] Navigation accessible depuis toutes les pages
- [ ] 4 liens fonctionnels : `/`, `/products`, `/stock/movements`, `/alerts`
- [ ] Titre application « Dashboard Stock / Produits » visible
- [ ] Layout responsive sans rupture majeure sur mobile

---

### FE-05 — Composants UI réutilisables

**Description**  
Implémenter dans `src/components/ui/` : `KpiCard`, `DataTable`, `StockBadge`, `LoadingSpinner`, `ErrorMessage`, `EmptyState`. Style cohérent Tailwind, support dark mode si déjà amorcé dans le scaffold.

**Dépendances**  
FE-04

**Critères d'acceptation**
- [ ] `KpiCard` affiche label, valeur, couleur optionnelle
- [ ] `StockBadge` rend OK (vert), LOW (orange), OUT (rouge)
- [ ] `DataTable` supporte colonnes configurables et état vide
- [ ] Composants réutilisés sans duplication de styles

---

### FE-06 — Page Dashboard (`/`)

**Description**  
Implémenter la page d'accueil consommant `GET /api/dashboard/summary` et `GET /api/dashboard/alerts`. Afficher 5 KPI cards, liste alertes, lien vers détail produit. Gérer états loading/error.

**Dépendances**  
FE-03, FE-05, BE-13 (ou mock API)

**Critères d'acceptation**
- [ ] 5 KPIs affichés : produits, stock total, valeur, alertes, ruptures
- [ ] Valeurs correspondent aux données backend
- [ ] Liste des produits en alerte visible sous les KPIs
- [ ] État loading pendant fetch, message d'erreur si API down

---

### FE-07 — Page liste produits (`/products`)

**Description**  
Table paginée des produits via `GET /api/products`. Colonnes : nom, SKU, catégorie, quantité, prix, statut. Pagination page/size. Bouton « Nouveau produit ». Lien vers détail et édition.

**Dépendances**  
FE-03, FE-05, BE-07 (ou mock API)

**Critères d'acceptation**
- [ ] Liste paginée fonctionnelle (navigation pages)
- [ ] `StockBadge` affiché par produit
- [ ] Bouton création mène à `/products/new`
- [ ] Clic sur ligne mène au détail `/products/[id]`

---

### FE-08 — Filtres et recherche produits

**Description**  
Ajouter barre de recherche texte, filtre par catégorie (select alimenté par `GET /api/categories`), toggle « Alertes seulement ». Synchroniser filtres avec query params URL.

**Dépendances**  
FE-07, BE-08

**Critères d'acceptation**
- [ ] Recherche texte filtre par nom/SKU
- [ ] Filtre catégorie fonctionne
- [ ] Toggle alertes appelle `alertOnly=true`
- [ ] Filtres persistés dans l'URL (shareable)

---

### FE-09 — Formulaires création et édition produit

**Description**  
Pages `/products/new` et `/products/[id]/edit`. Formulaire : name, sku, description, price, minThreshold, categoryId. Validation client (React Hook Form + Zod recommandé). POST/PUT vers API. Redirect après succès.

**Dépendances**  
FE-03, FE-05, BE-07, BE-04

**Critères d'acceptation**
- [ ] Création produit fonctionne end-to-end
- [ ] Édition pré-remplit les champs existants
- [ ] Erreurs API (409 SKU, 400 validation) affichées à l'utilisateur
- [ ] Redirection vers liste ou détail après succès

---

### FE-10 — Page détail produit (`/products/[id]`)

**Description**  
Afficher toutes les infos produit, statut stock, catégorie. Boutons éditer/supprimer. Section historique mouvements récents (5 derniers via `GET /api/stock/movements?productId=`). Formulaire rapide « Ajouter mouvement ».

**Dépendances**  
FE-09, BE-11

**Critères d'acceptation**
- [ ] Détail complet affiché pour un produit existant
- [ ] 404 affiché si produit inexistant
- [ ] Historique mouvements visible
- [ ] Mouvement rapide IN/OUT depuis la page détail

---

### FE-11 — Page mouvements stock (`/stock/movements`)

**Description**  
Page combinant formulaire de saisie (productId select, type, quantity, reason) et historique paginé global. Mise à jour visuelle après enregistrement. Gestion erreur stock insuffisant.

**Dépendances**  
FE-03, FE-05, BE-11

**Critères d'acceptation**
- [ ] Formulaire enregistre un mouvement IN/OUT/ADJUST
- [ ] Historique paginé affiché
- [ ] Erreur « Stock insuffisant » affichée clairement en cas de OUT refusé
- [ ] Quantité produit reflétée après mouvement réussi

---

### FE-12 — Page alertes (`/alerts`)

**Description**  
Page dédiée consommant `GET /api/dashboard/alerts`. Table triée par criticité (ruptures first). Lien vers fiche produit. Badge et couleurs cohérents.

**Dépendances**  
FE-05, BE-13

**Critères d'acceptation**
- [ ] Tous les produits LOW et OUT listés
- [ ] Ruptures visuellement distinguées des alertes basses
- [ ] Lien vers `/products/[id]` fonctionnel
- [ ] État vide si aucune alerte

---

### FE-13 — Graphiques dashboard (Recharts)

**Description**  
Ajouter Recharts. Graphique camembert ou barres pour `categoryBreakdown` sur le dashboard. Optionnel : top 5 produits par quantité. Légende et tooltips en français.

**Dépendances**  
FE-06, BE-13

**Critères d'acceptation**
- [ ] Graphique répartition par catégorie affiché sur `/`
- [ ] Données synchronisées avec `categoryBreakdown` API
- [ ] Graphique lisible et responsive
- [ ] Pas de crash si `categoryBreakdown` est vide

---

### FE-14 — Gestion erreurs UI et polish final

**Description**  
Uniformiser l'affichage des erreurs réseau/API sur toutes les pages. Ajouter confirmations de suppression. Format monétaire cohérent. Vérifier textes en français. Corriger états loading et empty states manquants.

**Dépendances**  
FE-06, FE-07, FE-09, FE-10, FE-11, FE-12

**Critères d'acceptation**
- [ ] Erreur API affiche message utilisateur (pas d'erreur brute)
- [ ] Confirmation avant suppression produit
- [ ] Prix formatés (ex. `89,99 €` ou FCFA selon choix équipe)
- [ ] Aucune page ne crash sur données vides

---

## 4. Integration Roadmap

Objectif : valider que backend, frontend et base de données fonctionnent ensemble de bout en bout, conformément aux critères d'acceptation hackathon.

---

### INT-01 — Documenter l'environnement de dev unifié

**Description**  
Rédiger dans le README les étapes pour lancer le stack complet : MySQL → backend (8080) → frontend (3000). Inclure variables d'environnement, commandes, ordre de démarrage, troubleshooting connexion DB.

**Dépendances**  
DB-01, FE-01, BE-01

**Critères d'acceptation**
- [ ] README backend : config MySQL + `./mvnw spring-boot:run`
- [ ] README frontend : `cp .env.local.example .env.local` + `npm run dev`
- [ ] Un nouveau développeur peut démarrer le stack en < 15 min
- [ ] Section troubleshooting pour erreurs courantes (CORS, DB, port)

---

### INT-02 — Aligner les contrats API (DTO sync)

**Description**  
Vérifier que chaque endpoint backend correspond aux types TypeScript frontend. Créer une checklist endpoint ↔ interface ↔ page consommatrice. Corriger tout écart de nommage (camelCase JSON).

**Dépendances**  
FE-03, BE-07, BE-04, BE-11, BE-13

**Critères d'acceptation**
- [ ] Checklist 12 endpoints section 7 validée
- [ ] Aucun écart de nommage entre JSON backend et types frontend
- [ ] `alertStatus`, `minThreshold`, `categoryBreakdown` identiques des deux côtés
- [ ] Checklist commitée dans `docs/` ou README

---

### INT-03 — Smoke test : flux produits

**Description**  
Test manuel bout en bout du CRUD produits : créer via UI → voir dans liste → éditer → voir modifications → supprimer (si autorisé). Valider aussi via curl en parallèle.

**Dépendances**  
INT-02, FE-09, BE-07

**Critères d'acceptation**
- [ ] Produit créé via UI apparaît dans `GET /api/products`
- [ ] Modification via UI reflétée en API
- [ ] SKU dupliqué affiche erreur UI (409)
- [ ] Suppression produit sans mouvements fonctionne

---

### INT-04 — Smoke test : flux stock

**Description**  
Test bout en bout des mouvements : entrée IN augmente stock → sortie OUT diminue → OUT refusé si insuffisant → historique visible UI et API. Vérifier cohérence quantités après chaque opération.

**Dépendances**  
INT-03, FE-11, BE-11

**Critères d'acceptation**
- [ ] IN +50 augmente quantity de 50
- [ ] OUT avec quantité excessive retourne erreur UI et API 400
- [ ] Historique UI correspond à `GET /api/stock/movements`
- [ ] Quantité cohérente entre détail produit et API

---

### INT-05 — Smoke test : dashboard et alertes

**Description**  
Valider que les 5 KPIs dashboard correspondent aux données réelles en base. Créer un produit sous seuil → vérifier incrément `alertCount`. Mettre un produit à quantity=0 → vérifier `outOfStockCount`. Graphique catégories cohérent.

**Dépendances**  
INT-04, FE-06, FE-12, FE-13, BE-13

**Critères d'acceptation**
- [ ] 5 KPIs corrects vs requêtes SQL manuelles
- [ ] Produit en alerte apparaît dans `/alerts` et sur dashboard
- [ ] Graphique catégories reflète `categoryBreakdown`
- [ ] Rafraîchissement page met à jour les KPIs (no stale cache)

---

### INT-06 — Scénario de démo hackathon

**Description**  
Préparer et exécuter un scénario de démonstration de 5 minutes couvrant : vue dashboard → création produit → entrée stock → sortie stock → alerte déclenchée → consultation page alertes. Script de démo documenté.

**Dépendances**  
INT-05

**Critères d'acceptation**
- [ ] Scénario exécutable sans erreur en live
- [ ] Script de démo écrit (étapes + données test)
- [ ] Tous les critères d'acceptation section 10.5 de `project-context.md` validés
- [ ] Durée démo ≤ 5 minutes

---

### INT-07 — Validation CORS et configuration prod

**Description**  
Tester le frontend contre le backend sans proxy Next (accès direct via `NEXT_PUBLIC_API_URL`). Valider CORS backend. Documenter la configuration pour un déploiement séparé frontend/backend.

**Dépendances**  
BE-03, FE-01, INT-05

**Critères d'acceptation**
- [ ] Frontend fonctionne avec `NEXT_PUBLIC_API_URL=http://localhost:8080` (sans proxy)
- [ ] CORS backend autorise l'origine frontend configurée
- [ ] Documentation déploiement séparé présente dans README
- [ ] Aucune requête bloquée en préflight OPTIONS

---

## 5. Matrice de priorisation MVP

| Priorité | Tâches | Justification |
|----------|--------|---------------|
| **P0 — Bloquant** | DB-01..04, BE-01..07, BE-10..11, FE-01..03, FE-06..07, FE-09, FE-11, INT-01..04 | CRUD produits + stock = cœur MVP |
| **P1 — Important** | DB-05..06, BE-08, BE-12..13, FE-04..05, FE-08, FE-10, FE-12, INT-05 | Dashboard, alertes, filtres |
| **P2 — Polish** | BE-14, FE-13..14, INT-06..07 | Graphiques, tests, démo, prod readiness |

---

## 6. Ordre d'exécution recommandé (sprint hackathon)

| Jour | Database | Backend | Frontend | Integration |
|------|----------|---------|----------|-------------|
| **J1** | DB-01 → DB-04 | BE-01 → BE-07 | FE-01 → FE-05 | INT-01 |
| **J2** | DB-05 → DB-06 | BE-08 → BE-11 | FE-06 → FE-09 | INT-02 |
| **J3** | — | BE-12 → BE-14 | FE-10 → FE-12 | INT-03 → INT-04 |
| **J4** | — | — | FE-13 → FE-14 | INT-05 → INT-07 |
| **J5** | — | — | — | INT-06 (démo) |

---

## 7. Traçabilité exigences → tâches

| Exigence (`project-context.md`) | Tâches |
|---------------------------------|--------|
| FR-P01..P07 (Produits) | DB-03, BE-05..08, FE-07..10 |
| FR-S01..S05 (Stock) | DB-04, BE-09..11, FE-10..11 |
| FR-DB01..DB04 (Dashboard) | BE-12..13, FE-06, FE-12..13 |
| FR-C01..C02 (Catégories) | DB-02, BE-04, FE-09 |
| NFR-01 (Performance) | DB-05, BE-08 |
| NFR-02 (Erreurs JSON) | BE-02, FE-02, FE-14 |
| NFR-04 (CORS) | BE-03, INT-07 |
| Section 10.5 (Critères hackathon) | INT-03..INT-06 |

---

*Document généré le 3 juin 2026 — Hackathon Juin 2026, Koji-hub-lab.*
