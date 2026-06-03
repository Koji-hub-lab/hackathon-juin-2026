# Hackathon Juin 2026 — Contexte projet

> **Thème :** Theme 10 — Dashboards Stock / Produits  
> **Dépôt :** [koji-hub-lab/hackathon-juin-2026](https://github.com/koji-hub-lab/hackathon-juin-2026)  
> **Source de vérité :** Analyse du dépôt (README, configuration, branches) complétée par les spécifications proposées pour le hackathon.

Ce document sert de référence unique pour l'équipe de développement. Il distingue les éléments **documentés** dans le dépôt des éléments **proposés** en attente de validation.

---

## 1. Project vision

### Objectif

Construire une application web de **gestion de stock et de produits** avec un **tableau de bord analytique**, permettant à une équipe commerciale ou logistique de visualiser l'état du stock, gérer un catalogue produits et détecter les situations critiques (ruptures, seuils bas).

### Contexte hackathon

- Projet organisé dans le cadre du **Hackathon Juin 2026** (Koji-hub-lab).
- Architecture **multi-branches** : frontend et backend développés et déployés indépendamment.
- Priorité : livrer un **MVP fonctionnel** en quelques jours, extensible vers l'IA/RAG en phase bonus.

### Principes directeurs

| Principe | Description |
|----------|-------------|
| Simplicité | MVP centré sur produits, stock et dashboard — pas de sur-ingénierie |
| Séparation des concerns | Frontend Next.js ↔ Backend Spring Boot via REST JSON |
| Contrats explicites | DTO partagés et synchronisés entre branches |
| Évolutivité | Schéma et API pensés pour accueillir auth et module IA ultérieurement |
| Langue | Interface et documentation utilisateur en **français** |

### Stack confirmée (documentée)

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| Backend | Spring Boot 4.0.6, Java 17, Spring Data JPA, Lombok |
| Base de données | MySQL 8 (`hackathon`, timezone `Africa/Douala`) |
| Communication | REST JSON, port backend **8080** |

---

## 2. Functional requirements

### 2.1 Exigences documentées

| ID | Exigence | Source |
|----|----------|--------|
| FR-D01 | Le frontend communique avec le backend Spring Boot via HTTP/JSON | README branche init |
| FR-D02 | Variable d'environnement `NEXT_PUBLIC_API_URL` configurable (défaut `http://localhost:8080`) | README branche init |
| FR-D03 | Proxy dev : routes `/api/*` proxifiées vers le backend | `next.config.ts` |
| FR-D04 | Client HTTP centralisé (`apiGet`, etc.) dans `src/lib/api/` | README branche init |
| FR-D05 | Backend persiste les données via JPA/Hibernate sur MySQL | `application.properties` |
| FR-D06 | Schéma DB auto-généré en dev (`ddl-auto=update`) | `application.properties` |
| FR-D07 | Branches `frontend` et `backend` déployables indépendamment | README branche init |

### 2.2 Exigences métier proposées

#### Module Produits

| ID | Exigence | Priorité MVP |
|----|----------|--------------|
| FR-P01 | Créer un produit (nom, SKU, description, prix, catégorie, seuil minimum) | P0 |
| FR-P02 | Lister les produits avec pagination | P0 |
| FR-P03 | Consulter le détail d'un produit | P0 |
| FR-P04 | Modifier un produit existant | P0 |
| FR-P05 | Supprimer un produit (si aucun mouvement bloquant) | P1 |
| FR-P06 | Filtrer les produits par catégorie, texte libre, statut stock | P1 |
| FR-P07 | Associer chaque produit à une catégorie | P0 |

#### Module Stock

| ID | Exigence | Priorité MVP |
|----|----------|--------------|
| FR-S01 | Enregistrer un mouvement de stock (entrée, sortie, ajustement) | P0 |
| FR-S02 | Mettre à jour automatiquement la quantité du produit après mouvement | P0 |
| FR-S03 | Consulter l'historique des mouvements (par produit ou global) | P1 |
| FR-S04 | Empêcher une sortie si stock insuffisant | P0 |
| FR-S05 | Déclencher une alerte lorsque `quantity <= min_threshold` | P0 |

#### Module Dashboard

| ID | Exigence | Priorité MVP |
|----|----------|--------------|
| FR-DB01 | Afficher les KPIs agrégés (stock total, valeur, alertes) | P0 |
| FR-DB02 | Graphique de répartition du stock par catégorie | P1 |
| FR-DB03 | Liste des produits en alerte (sous seuil ou rupture) | P0 |
| FR-DB04 | Rafraîchissement des données à chaque visite (pas de cache stale) | P0 |

#### Module Catégories

| ID | Exigence | Priorité MVP |
|----|----------|--------------|
| FR-C01 | CRUD catégories (nom, description) | P1 |
| FR-C02 | Empêcher la suppression d'une catégorie contenant des produits | P1 |

### 2.3 Exigences non fonctionnelles

| ID | Exigence |
|----|----------|
| NFR-01 | Temps de réponse API < 500 ms pour les listes paginées (< 1000 produits) |
| NFR-02 | Réponses d'erreur JSON structurées (`message`, `error`, `status`) |
| NFR-03 | Validation des entrées côté backend (`@Valid`) |
| NFR-04 | CORS configuré pour les environnements de prod |
| NFR-05 | Code et UI en français |

---

## 3. User roles

> **Note :** Aucun rôle n'est documenté dans le README actuel. La matrice ci-dessous est **proposée** pour le hackathon.

### Rôles définis

| Rôle | Description | Périmètre |
|------|-------------|-----------|
| **Administrateur** | Gestionnaire système | Accès complet : produits, stock, catégories, paramètres, utilisateurs |
| **Gestionnaire de stock** | Opérateur logistique | CRUD produits, mouvements de stock, consultation dashboard |
| **Consultant** | Lecteur métier | Dashboard + listes en lecture seule |

### Matrice des permissions

| Action | Administrateur | Gestionnaire | Consultant |
|--------|:--------------:|:------------:|:----------:|
| Voir dashboard | ✓ | ✓ | ✓ |
| Lister / voir produits | ✓ | ✓ | ✓ |
| Créer / modifier produit | ✓ | ✓ | ✗ |
| Supprimer produit | ✓ | ✓ | ✗ |
| Enregistrer mouvement stock | ✓ | ✓ | ✗ |
| Gérer catégories | ✓ | ✓ | ✗ |
| Gérer utilisateurs | ✓ | ✗ | ✗ |

### Stratégie d'authentification

| Phase | Approche |
|-------|----------|
| **MVP (hackathon)** | Pas d'authentification — accès ouvert en local |
| **Post-MVP** | JWT via Spring Security ; rôles en base (`ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_VIEWER`) |

---

## 4. Backend architecture

### 4.1 Stack

| Composant | Technologie |
|-----------|-------------|
| Framework | Spring Boot 4.0.6 |
| Langage | Java 17 |
| Web | Spring WebMVC (`@RestController`) |
| Persistance | Spring Data JPA + Hibernate |
| Base | MySQL Connector/J |
| Build | Maven (`./mvnw`) |
| Packaging | WAR (Tomcat provided) |
| Utilitaires | Lombok |

### 4.2 Structure des packages proposée

```
com.example.hackathon
├── HackathonApplication.java
├── config/
│   ├── CorsConfig.java
│   └── WebConfig.java
├── controller/
│   ├── ProductController.java
│   ├── CategoryController.java
│   ├── StockMovementController.java
│   └── DashboardController.java
├── dto/
│   ├── ProductDto.java
│   ├── CategoryDto.java
│   ├── StockMovementDto.java
│   ├── DashboardSummaryDto.java
│   └── ApiErrorDto.java
├── entity/
│   ├── Product.java
│   ├── Category.java
│   └── StockMovement.java
├── repository/
│   ├── ProductRepository.java
│   ├── CategoryRepository.java
│   └── StockMovementRepository.java
├── service/
│   ├── ProductService.java
│   ├── CategoryService.java
│   ├── StockService.java
│   └── DashboardService.java
└── exception/
    ├── GlobalExceptionHandler.java
    ├── ResourceNotFoundException.java
    └── InsufficientStockException.java
```

### 4.3 Couches et responsabilités

| Couche | Responsabilité |
|--------|----------------|
| **Controller** | Mapping HTTP, validation `@Valid`, codes de statut, sérialisation JSON |
| **Service** | Logique métier : calcul stock, alertes, agrégations KPI, transactions |
| **Repository** | Accès données JPA, requêtes dérivées et `@Query` custom |
| **Entity** | Modèle relationnel, contraintes JPA |
| **DTO** | Contrat API exposé au frontend (découplé des entités) |
| **ExceptionHandler** | Réponses d'erreur uniformes (`ApiErrorDto`) |

### 4.4 Configuration

| Paramètre | Valeur |
|-----------|--------|
| Port | `8080` |
| Datasource URL | `jdbc:mysql://localhost:3306/hackathon?useSSL=false&serverTimezone=Africa/Douala&allowPublicKeyRetrieval=true` |
| DDL auto | `update` (dev) → `validate` (prod) |
| SQL logging | `true` (dev) |

### 4.5 Règles métier backend

1. **SKU unique** : deux produits ne peuvent pas partager le même SKU.
2. **Stock non négatif** : une sortie (`OUT`) est rejetée si `quantity < mouvement.quantity`.
3. **Mise à jour atomique** : mouvement + mise à jour quantité dans une même transaction.
4. **Alerte** : un produit est en alerte si `quantity <= min_threshold`.
5. **Suppression produit** : autorisée uniquement si aucun mouvement historique (ou soft-delete en post-MVP).

---

## 5. Frontend architecture

### 5.1 Stack

| Composant | Technologie |
|-----------|-------------|
| Framework | Next.js 16.2.7 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Langage | TypeScript 5 |
| Fonts | Geist Sans, Geist Mono |
| Dev server | Turbopack (`next dev --turbopack`) |
| Langue | Français (`lang="fr"`) |

### 5.2 Structure des dossiers

```
src/
├── app/
│   ├── layout.tsx              # Layout racine
│   ├── page.tsx                # Dashboard (/)
│   ├── products/
│   │   ├── page.tsx            # Liste produits
│   │   ├── new/page.tsx        # Création
│   │   └── [id]/
│   │       ├── page.tsx        # Détail
│   │       └── edit/page.tsx   # Édition
│   ├── stock/
│   │   └── movements/page.tsx  # Historique + formulaire
│   └── alerts/page.tsx         # Produits en alerte
├── components/
│   └── ui/                     # Composants réutilisables (Table, Card, Badge, Modal…)
├── hooks/
│   ├── useProducts.ts
│   ├── useDashboard.ts
│   └── useStockMovements.ts
├── lib/
│   ├── api/
│   │   ├── client.ts           # apiGet, apiPost, apiPut, apiDelete
│   │   └── types.ts            # ApiErrorBody, DTO interfaces
│   └── env.ts                  # getApiBaseUrl()
└── types/
    └── index.ts                # Types globaux partagés
```

### 5.3 Routing

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | KPIs + graphiques |
| `/products` | Liste produits | Table paginée + filtres |
| `/products/new` | Nouveau produit | Formulaire création |
| `/products/[id]` | Détail produit | Infos + historique stock |
| `/products/[id]/edit` | Édition | Formulaire modification |
| `/stock/movements` | Mouvements | Historique + formulaire entrée/sortie |
| `/alerts` | Alertes | Produits sous seuil |

### 5.4 Communication API

| Mécanisme | Détail |
|-----------|--------|
| Client HTTP | `src/lib/api/client.ts` — fonctions `apiGet<T>`, `apiPost<T>`, etc. |
| Base URL | `NEXT_PUBLIC_API_URL` ou proxy `/api` en dev |
| Proxy dev | Rewrite `/api/:path*` → `http://localhost:8080/:path*` |
| Cache | `cache: "no-store"` par défaut |
| Erreurs | `ApiErrorBody { message?, error?, status? }` |

### 5.5 Composants UI prévus

| Composant | Usage |
|-----------|-------|
| `KpiCard` | Affichage d'un indicateur dashboard |
| `DataTable` | Listes produits / mouvements |
| `StockBadge` | Statut stock (OK / Alerte / Rupture) |
| `ProductForm` | Création / édition produit |
| `MovementForm` | Saisie mouvement stock |
| `CategoryChart` | Graphique répartition par catégorie |
| `AlertList` | Liste produits en alerte |

### 5.6 Librairies suggérées (à ajouter)

| Librairie | Rôle |
|-----------|------|
| Recharts | Graphiques dashboard |
| React Hook Form + Zod | Validation formulaires |

---

## 6. Database schema

### 6.1 Modèle relationnel

```
┌─────────────────┐       ┌─────────────────────┐
│    category     │       │       product       │
├─────────────────┤       ├─────────────────────┤
│ id          PK  │──┐    │ id              PK  │
│ name        UK  │  └───→│ category_id     FK  │
│ description     │       │ name                │
│ created_at      │       │ sku             UK  │
│ updated_at      │       │ description         │
└─────────────────┘       │ price               │
                          │ quantity            │
                          │ min_threshold       │
                          │ created_at          │
                          │ updated_at          │
                          └──────────┬──────────┘
                                     │
                          ┌──────────▼──────────┐
                          │   stock_movement    │
                          ├─────────────────────┤
                          │ id              PK  │
                          │ product_id      FK  │
                          │ type                │  ← IN | OUT | ADJUST
                          │ quantity            │
                          │ reason              │
                          │ created_at          │
                          └─────────────────────┘
```

### 6.2 Détail des tables

#### `category`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | BIGINT | PK, AUTO_INCREMENT | Identifiant |
| `name` | VARCHAR(100) | NOT NULL, UNIQUE | Nom de la catégorie |
| `description` | TEXT | NULL | Description optionnelle |
| `created_at` | DATETIME | NOT NULL | Date de création |
| `updated_at` | DATETIME | NOT NULL | Dernière modification |

#### `product`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | BIGINT | PK, AUTO_INCREMENT | Identifiant |
| `category_id` | BIGINT | FK → category.id | Catégorie |
| `name` | VARCHAR(200) | NOT NULL | Nom du produit |
| `sku` | VARCHAR(50) | NOT NULL, UNIQUE | Référence unique |
| `description` | TEXT | NULL | Description |
| `price` | DECIMAL(10,2) | NOT NULL, >= 0 | Prix unitaire |
| `quantity` | INT | NOT NULL, >= 0 | Stock actuel |
| `min_threshold` | INT | NOT NULL, >= 0 | Seuil d'alerte |
| `created_at` | DATETIME | NOT NULL | Date de création |
| `updated_at` | DATETIME | NOT NULL | Dernière modification |

#### `stock_movement`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | BIGINT | PK, AUTO_INCREMENT | Identifiant |
| `product_id` | BIGINT | FK → product.id, NOT NULL | Produit concerné |
| `type` | ENUM('IN','OUT','ADJUST') | NOT NULL | Type de mouvement |
| `quantity` | INT | NOT NULL, > 0 | Quantité du mouvement |
| `reason` | VARCHAR(255) | NULL | Motif (réception, vente, inventaire…) |
| `created_at` | DATETIME | NOT NULL | Date du mouvement |

### 6.3 Index recommandés

| Index | Colonnes | Justification |
|-------|----------|---------------|
| `idx_product_category` | `product.category_id` | Filtres par catégorie |
| `idx_product_sku` | `product.sku` | Recherche par référence |
| `idx_product_quantity` | `product.quantity` | Requêtes alertes |
| `idx_movement_product` | `stock_movement.product_id` | Historique par produit |
| `idx_movement_created` | `stock_movement.created_at` | Tri chronologique |

### 6.4 Données de seed (dev)

Jeux de données initiaux recommandés pour le développement :

- 3–5 catégories (Électronique, Alimentaire, Textile, etc.)
- 10–20 produits répartis dans les catégories
- 5–10 mouvements de stock variés (IN, OUT)
- Au moins 2 produits sous le seuil d'alerte pour tester le dashboard

---

## 7. API specification

**Base URL :** `http://localhost:8080`  
**Format :** JSON  
**Encodage dates :** ISO 8601 (`2026-06-03T14:30:00`)

### 7.1 Produits

#### `GET /api/products`

Liste paginée des produits.

**Query params :**

| Param | Type | Défaut | Description |
|-------|------|--------|-------------|
| `page` | int | 0 | Numéro de page |
| `size` | int | 20 | Taille de page |
| `search` | string | — | Recherche texte (nom, SKU) |
| `categoryId` | long | — | Filtre par catégorie |
| `alertOnly` | boolean | false | Uniquement produits en alerte |

**Réponse 200 :**

```json
{
  "content": [
    {
      "id": 1,
      "name": "Clavier mécanique",
      "sku": "KB-001",
      "description": "Clavier AZERTY RGB",
      "price": 89.99,
      "quantity": 45,
      "minThreshold": 10,
      "categoryId": 1,
      "categoryName": "Électronique",
      "alertStatus": "OK"
    }
  ],
  "totalElements": 42,
  "totalPages": 3,
  "page": 0,
  "size": 20
}
```

`alertStatus` : `OK` | `LOW` (quantity <= minThreshold) | `OUT` (quantity = 0)

---

#### `GET /api/products/{id}`

Détail d'un produit.

**Réponse 200 :** Objet produit (même structure que ci-dessus).  
**Réponse 404 :** `{ "message": "Produit introuvable", "status": 404 }`

---

#### `POST /api/products`

Créer un produit.

**Body :**

```json
{
  "name": "Clavier mécanique",
  "sku": "KB-001",
  "description": "Clavier AZERTY RGB",
  "price": 89.99,
  "quantity": 0,
  "minThreshold": 10,
  "categoryId": 1
}
```

**Réponse 201 :** Produit créé.  
**Réponse 400 :** Validation échouée.  
**Réponse 409 :** SKU déjà existant.

---

#### `PUT /api/products/{id}`

Modifier un produit.

**Body :** Même structure que POST (sans `quantity` — modifiée via mouvements).  
**Réponse 200 :** Produit mis à jour.  
**Réponse 404 :** Produit introuvable.

---

#### `DELETE /api/products/{id}`

Supprimer un produit.

**Réponse 204 :** Supprimé.  
**Réponse 404 :** Produit introuvable.  
**Réponse 409 :** Produit avec mouvements historiques.

---

### 7.2 Catégories

#### `GET /api/categories`

**Réponse 200 :**

```json
[
  { "id": 1, "name": "Électronique", "description": "...", "productCount": 12 }
]
```

#### `POST /api/categories`

**Body :** `{ "name": "Électronique", "description": "..." }`  
**Réponse 201 :** Catégorie créée.

#### `PUT /api/categories/{id}` / `DELETE /api/categories/{id}`

CRUD standard. DELETE rejeté (409) si la catégorie contient des produits.

---

### 7.3 Mouvements de stock

#### `POST /api/stock/movements`

Enregistrer un mouvement.

**Body :**

```json
{
  "productId": 1,
  "type": "IN",
  "quantity": 50,
  "reason": "Réception fournisseur"
}
```

**Réponse 201 :**

```json
{
  "id": 15,
  "productId": 1,
  "type": "IN",
  "quantity": 50,
  "reason": "Réception fournisseur",
  "newQuantity": 95,
  "createdAt": "2026-06-03T14:30:00"
}
```

**Réponse 400 :** Stock insuffisant (sortie).  
**Réponse 404 :** Produit introuvable.

---

#### `GET /api/stock/movements`

Historique paginé.

**Query params :** `page`, `size`, `productId` (optionnel)

**Réponse 200 :** Page de mouvements.

---

### 7.4 Dashboard

#### `GET /api/dashboard/summary`

KPIs agrégés.

**Réponse 200 :**

```json
{
  "totalProducts": 42,
  "totalStockUnits": 1580,
  "totalStockValue": 45890.50,
  "alertCount": 5,
  "outOfStockCount": 2,
  "categoryBreakdown": [
    { "categoryId": 1, "categoryName": "Électronique", "productCount": 12, "totalQuantity": 450, "totalValue": 22000.00 },
    { "categoryId": 2, "categoryName": "Alimentaire", "productCount": 18, "totalQuantity": 800, "totalValue": 12000.00 }
  ]
}
```

---

#### `GET /api/dashboard/alerts`

Produits en alerte.

**Réponse 200 :**

```json
[
  {
    "id": 7,
    "name": "Câble USB-C",
    "sku": "CB-003",
    "quantity": 3,
    "minThreshold": 10,
    "alertStatus": "LOW",
    "categoryName": "Électronique"
  }
]
```

---

### 7.5 Erreurs communes

| Code | Signification | Exemple body |
|------|---------------|--------------|
| 400 | Validation / règle métier | `{ "message": "Stock insuffisant", "status": 400 }` |
| 404 | Ressource introuvable | `{ "message": "Produit introuvable", "status": 404 }` |
| 409 | Conflit (SKU dupliqué, suppression impossible) | `{ "message": "SKU déjà existant", "status": 409 }` |
| 500 | Erreur serveur | `{ "message": "Erreur interne", "status": 500 }` |

---

## 8. Dashboard KPIs

### 8.1 Indicateurs principaux

| KPI | Formule | Affichage |
|-----|---------|-----------|
| **Nombre de produits** | `COUNT(product)` | Carte KPI — entier |
| **Stock total (unités)** | `SUM(product.quantity)` | Carte KPI — entier |
| **Valeur du stock** | `SUM(product.quantity × product.price)` | Carte KPI — montant FCFA/EUR |
| **Produits en alerte** | `COUNT(product WHERE quantity <= min_threshold AND quantity > 0)` | Carte KPI — entier, couleur orange |
| **Produits en rupture** | `COUNT(product WHERE quantity = 0)` | Carte KPI — entier, couleur rouge |

### 8.2 Graphiques

| Graphique | Type | Données |
|-----------|------|---------|
| **Répartition par catégorie** | Camembert ou barres | `categoryBreakdown` — quantité ou valeur par catégorie |
| **Top 5 produits (stock)** | Barres horizontales | 5 produits avec la plus grande quantité |
| **Produits en alerte** | Table / liste | `GET /api/dashboard/alerts` |

### 8.3 Seuils visuels

| Statut | Condition | Couleur |
|--------|-----------|---------|
| OK | `quantity > min_threshold` | Vert |
| Alerte basse | `0 < quantity <= min_threshold` | Orange |
| Rupture | `quantity = 0` | Rouge |

### 8.4 Wireframe conceptuel

```
┌──────────────────────────────────────────────────────────────┐
│  Dashboard Stock / Produits                          [FR]    │
├──────────┬──────────┬──────────┬──────────┬──────────────────┤
│ Produits │ Stock    │ Valeur   │ Alertes  │ Ruptures         │
│   42     │  1 580   │ 45 890 € │    5     │    2             │
├──────────┴──────────┴──────────┴──────────┴──────────────────┤
│  [Graphique catégories]          │  [Top 5 produits]         │
├──────────────────────────────────┴───────────────────────────┤
│  Produits en alerte                                          │
│  ┌────────┬─────────┬─────┬─────────┬────────┐               │
│  │ Nom    │ SKU     │ Qty │ Seuil   │ Statut │               │
│  └────────┴─────────┴─────┴─────────┴────────┘               │
└──────────────────────────────────────────────────────────────┘
```

---

## 9. Future AI/RAG integration

> **Note :** Aucune exigence IA/RAG n'est documentée dans le dépôt. Cette section décrit une **évolution bonus** alignée sur le thème dashboard.

### 9.1 Vision

Permettre aux utilisateurs d'interroger le stock et les produits en **langage naturel** (français), avec des réponses grounded sur les données réelles de la base MySQL.

**Exemples de questions :**

- « Quels produits sont en rupture de stock ? »
- « Quelle est la valeur totale du stock électronique ? »
- « Montre-moi les 10 produits les plus stockés »
- « Quels mouvements de sortie ont eu lieu cette semaine ? »

### 9.2 Architecture RAG proposée

```
Question utilisateur (FR)
        │
        ▼
┌───────────────────┐
│  Frontend Chat UI  │  ← composant dans /dashboard ou page dédiée /assistant
└─────────┬─────────┘
          │ POST /api/ai/query
          ▼
┌───────────────────┐
│  AI Controller     │
└─────────┬─────────┘
          ▼
┌───────────────────┐     ┌─────────────────────┐
│  RAG Service       │────→│  Vector Store        │
│  - Embedding query │     │  (schéma DB, docs,   │
│  - Retrieve context│     │   exemples SQL)      │
│  - Build prompt    │     └─────────────────────┘
│  - Call LLM        │
│  - Validate SQL    │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│  SQL Executor      │  ← SELECT only, whitelist tables
│  (read-only)       │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│  Response Builder  │  ← texte + données tabulaires + suggestion graphique
└───────────────────┘
```

### 9.3 Composants techniques

| Composant | Option |
|-----------|--------|
| LLM | OpenAI GPT-4o / Anthropic Claude / Ollama local |
| Orchestration | Spring AI |
| Vector store | Qdrant, pgvector, ou Chroma |
| Embeddings | OpenAI text-embedding-3-small |
| Index RAG | Schéma DDL, descriptions colonnes, 10–20 requêtes SQL exemple |

### 9.4 Guardrails

| Règle | Description |
|-------|-------------|
| SELECT only | Interdire INSERT, UPDATE, DELETE, DROP |
| Whitelist tables | Uniquement `product`, `category`, `stock_movement` |
| Validation SQL | Parser et vérifier la requête avant exécution |
| Timeout | Max 5 s par requête SQL |
| Rate limiting | Max 20 requêtes/minute par session |
| Pas de hallucination | Si la requête ne peut pas être résolue, répondre « Je ne peux pas répondre à cette question avec les données disponibles » |

### 9.5 Endpoint API (futur)

#### `POST /api/ai/query`

**Body :**

```json
{
  "question": "Quels produits sont en rupture de stock ?"
}
```

**Réponse 200 :**

```json
{
  "answer": "Il y a actuellement 2 produits en rupture de stock : Câble USB-C (CB-003) et Adaptateur HDMI (AD-007).",
  "sql": "SELECT name, sku FROM product WHERE quantity = 0",
  "data": [
    { "name": "Câble USB-C", "sku": "CB-003" },
    { "name": "Adaptateur HDMI", "sku": "AD-007" }
  ],
  "suggestedChart": "table"
}
```

### 9.6 Prérequis d'implémentation

1. MVP stock/produits/dashboard **stable et testé**
2. Schéma DB documenté et indexé dans le vector store
3. Clé API LLM configurée (`OPENAI_API_KEY` ou équivalent)
4. Tests sur 20+ questions types en français

---

## 10. MVP scope for the hackathon

### 10.1 Objectif MVP

Livrer en hackathon une application **fonctionnelle de bout en bout** : créer des produits, enregistrer des mouvements de stock, et visualiser un dashboard avec KPIs et alertes.

### 10.2 Périmètre IN (MVP)

| # | Fonctionnalité | Backend | Frontend |
|---|----------------|:-------:|:--------:|
| 1 | Entités JPA (Product, Category, StockMovement) | ✓ | — |
| 2 | CRUD produits (create, read, update, delete) | ✓ | ✓ |
| 3 | CRUD catégories (basique) | ✓ | ✓ |
| 4 | Enregistrer mouvement stock (IN/OUT/ADJUST) | ✓ | ✓ |
| 5 | Mise à jour automatique quantité | ✓ | — |
| 6 | Validation stock insuffisant | ✓ | — |
| 7 | Dashboard KPIs (5 indicateurs) | ✓ | ✓ |
| 8 | Liste produits en alerte | ✓ | ✓ |
| 9 | Graphique répartition par catégorie | ✓ | ✓ |
| 10 | Liste produits paginée + recherche | ✓ | ✓ |
| 11 | Données de seed dev | ✓ | — |
| 12 | Gestion erreurs JSON uniforme | ✓ | ✓ |
| 13 | Proxy dev `/api/*` | — | ✓ |
| 14 | README et docs à jour | ✓ | ✓ |

### 10.3 Périmètre OUT (post-hackathon)

| Fonctionnalité | Raison |
|----------------|--------|
| Authentification / rôles | Complexité — reporté phase 2 |
| Module IA / RAG | Bonus — nécessite MVP stable |
| Upload images produits | Non requis pour le thème |
| Multi-entrepôts | Hors scope MVP |
| Export CSV / PDF | Nice-to-have |
| Notifications email | Hors scope |
| Tests E2E automatisés | Priorité manuelle en hackathon |
| CI/CD pipeline | Post-hackathon |
| Déploiement cloud | Post-hackathon |

### 10.4 Phases de livraison

| Phase | Contenu | Critère de done |
|-------|---------|-----------------|
| **Phase 1 — Backend core** | Entités, repos, CRUD produits + catégories, seed | `GET/POST/PUT/DELETE /api/products` fonctionnels via curl |
| **Phase 2 — Stock** | Service mouvements, validation, historique | Mouvement IN puis OUT, quantité cohérente |
| **Phase 3 — Dashboard API** | Agrégations KPI, alertes, breakdown catégories | `GET /api/dashboard/summary` retourne données correctes |
| **Phase 4 — Frontend pages** | Dashboard, liste produits, formulaires CRUD, mouvements | Navigation complète, données affichées |
| **Phase 5 — Polish** | Filtres, badges alerte, graphiques, gestion erreurs UI | Demo fluide de bout en bout |

### 10.5 Critères d'acceptation hackathon

- [ ] Créer un produit depuis l'UI et le voir dans la liste
- [ ] Enregistrer une entrée de stock et constater la mise à jour de la quantité
- [ ] Enregistrer une sortie refusée si stock insuffisant
- [ ] Dashboard affiche les 5 KPIs avec des valeurs correctes
- [ ] Au moins un produit en alerte visible sur le dashboard
- [ ] Graphique de répartition par catégorie fonctionnel
- [ ] Backend et frontend tournent en local avec `./mvnw spring-boot:run` + `npm run dev`
- [ ] Documentation (`README.md` + ce fichier) à jour

### 10.6 Risques et mitigations

| Risque | Impact | Mitigation |
|--------|--------|------------|
| README vide / specs incomplètes | Confusion équipe | Ce document comme référence |
| Désync DTO frontend/backend | Bugs intégration | Typer les DTO des deux côtés, tester tôt |
| MySQL non configuré en local | Backend ne démarre pas | Docker Compose MySQL + script seed |
| CORS en prod | Frontend bloqué | Configurer dès Phase 1 |
| Temps hackathon limité | MVP incomplet | Prioriser Phase 1–3 backend puis Phase 4 frontend |

---

## Annexe — Références

| Ressource | Emplacement |
|-----------|-------------|
| README frontend (init) | Branche `cursor/init-nextjs-6535` |
| Config backend | `backend` → `src/main/resources/application.properties` |
| Client API frontend | `src/lib/api/client.ts` |
| Description GitHub | « theme 10, Dashbords Stock/Produits » |
| Repo lié (référence) | [koji-hub-lab/trakstock](https://github.com/koji-hub-lab/trakstock) |

---

*Document généré le 3 juin 2026 — Hackathon Juin 2026, Koji-hub-lab.*
