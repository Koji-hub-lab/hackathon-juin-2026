"""Application FastAPI — Supply Chain Radar (async, PostgreSQL + Redis).

Configure CORS (frontend port 3000), initialise la base (migration + seed) au
démarrage, lance le scheduler d'alertes Redis et expose tous les routeurs sous
le préfixe /api, plus l'endpoint WebSocket natif /ws.
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
    # Startup : migration + seed, puis tâche d'alertes Redis.
    await init_db()
    task = start_scheduler()
    yield
    # Shutdown : arrêt propre des ressources.
    task.cancel()
    await close_redis()
    await engine.dispose()


app = FastAPI(title="Supply Chain Radar API", version="2.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.get("/api/health", tags=["Health"])
async def health():
    return {"status": "UP"}


# Routeurs REST sous le préfixe /api.
for module in (warehouses, products, alerts, movements, predict, inventory, users):
    app.include_router(module.router, prefix="/api")

# Endpoint WebSocket natif à la racine : /ws.
app.include_router(ws.router)
