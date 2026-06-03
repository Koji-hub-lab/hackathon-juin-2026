"""Application FastAPI — Supply Chain Radar.

Point d'entrée de l'API :
  - Initialisation de l'app FastAPI.
  - CORS autorisé pour le frontend Next.js (ports 3000 et 3005).
  - Cycle de vie (lifespan) : initialisation de la base SQLite/SQLAlchemy
    (création des tables + seed des données) au démarrage, puis libération
    propre des ressources à l'arrêt.
  - Inclusion de tous les routeurs existants sous le préfixe /api.
  - Endpoint WebSocket /ws et scheduler Redis activés uniquement si ENABLE_REDIS.

Lancement :
    uvicorn app.main:app --reload --port 8080
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, init_db
from app.redis_client import close_redis
from app.routers import (
    alerts,
    inventory,
    movements,
    predict,
    products,
    users,
    warehouses,
    ws,
)
from app.services.scheduler import start_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Cycle de vie de l'application.

    Startup : crée les tables SQLAlchemy et injecte les données initiales
    (migration + seed via la base SQLite/PostgreSQL configurée).
    Shutdown : arrête le scheduler, ferme Redis et libère le moteur SQLAlchemy.
    """
    # --- Startup ---
    await init_db()
    task = start_scheduler() if settings.ENABLE_REDIS else None

    yield

    # --- Shutdown ---
    if task is not None:
        task.cancel()
    if settings.ENABLE_REDIS:
        await close_redis()
    await engine.dispose()


# Initialisation de l'application FastAPI.
app = FastAPI(
    title="Supply Chain Radar API",
    version="2.0",
    lifespan=lifespan,
)

# Configuration CORS : autorise le frontend Next.js sur les ports 3000 et 3005.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.get("/api/health", tags=["Health"])
async def health():
    """Sonde de disponibilité de l'API."""
    return {"status": "UP"}


# Inclusion de tous les routeurs existants sous le préfixe /api.
for module in (warehouses, products, alerts, movements, predict, inventory, users):
    app.include_router(module.router, prefix="/api")

# Endpoint WebSocket natif /ws à la racine (actif uniquement avec Redis).
if settings.ENABLE_REDIS:
    app.include_router(ws.router)
