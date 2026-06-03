"""Application FastAPI — Supply Chain Radar.

Configure CORS (frontend port 3000), charge la base de données au démarrage,
lance le scheduler d'alertes et expose tous les routeurs sous le préfixe /api,
plus l'endpoint WebSocket natif /ws.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import db
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
    # Startup : charge mock.json en mémoire et démarre la tâche d'alertes.
    db.load()
    task = start_scheduler()
    yield
    # Shutdown : arrête proprement la tâche de fond.
    task.cancel()


app = FastAPI(title="Supply Chain Radar API", version="1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.get("/api/health", tags=["Health"])
def health():
    return {"status": "UP"}


# Routeurs REST sous le préfixe /api.
for module in (warehouses, products, alerts, movements, predict, inventory, users):
    app.include_router(module.router, prefix="/api")

# Endpoint WebSocket natif à la racine : /ws.
app.include_router(ws.router)
