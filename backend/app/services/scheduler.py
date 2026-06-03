"""Tâche de fond : émet une alerte simulée toutes les 30 secondes via WebSocket."""

import asyncio
import random
from datetime import datetime, timezone

from app.routers.ws import manager

INTERVAL_SECONDS = 30


async def _alert_loop() -> None:
    while True:
        await asyncio.sleep(INTERVAL_SECONDS)
        alert = {
            "id": int(datetime.now(timezone.utc).timestamp() * 1000),
            "type": "LOW_STOCK",
            "message": "Simulation : niveau de stock bas détecté",
            "level": "warning",
            "warehouseId": random.randint(1, 4),
            "createdAt": datetime.now(timezone.utc)
            .isoformat()
            .replace("+00:00", "Z"),
        }
        await manager.broadcast(alert)
        print("⚡ new_alert émis → /ws")


def start_scheduler() -> asyncio.Task:
    """Démarre la boucle d'alertes en tâche de fond."""
    return asyncio.create_task(_alert_loop())
