"""Tâche de fond résiliente : publie une alerte simulée sur Redis Pub/Sub
toutes les 30 secondes. Les clients WebSocket connectés au canal la reçoivent.
"""

import asyncio
import json
import random
from datetime import datetime, timezone

from app.config import settings
from app.redis_client import get_redis

INTERVAL_SECONDS = 30


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


async def _alert_loop() -> None:
    redis = get_redis()
    while True:
        await asyncio.sleep(INTERVAL_SECONDS)
        alert = {
            "id": int(datetime.now(timezone.utc).timestamp() * 1000),
            "type": "LOW_STOCK",
            "message": "Simulation : niveau de stock bas détecté",
            "level": "warning",
            "warehouseId": random.randint(1, 4),
            "createdAt": _now_iso(),
        }
        try:
            await redis.publish(settings.ALERTS_CHANNEL, json.dumps(alert))
            print(f"⚡ new_alert publié → Redis[{settings.ALERTS_CHANNEL}]")
        except Exception as exc:  # résilience : on log et on continue
            print(f"⚠️  Publication alerte échouée (Redis) : {exc}")


def start_scheduler() -> asyncio.Task:
    """Démarre la boucle d'alertes en tâche de fond (non bloquante)."""
    return asyncio.create_task(_alert_loop())
