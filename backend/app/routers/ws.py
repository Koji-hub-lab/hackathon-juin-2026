"""Endpoint WebSocket natif /ws : relaie les alertes du canal Redis Pub/Sub.

Chaque client WebSocket s'abonne au canal Redis : la diffusion est ainsi
résiliente et horizontalement scalable (plusieurs instances API partagent Redis).
"""

import asyncio

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.config import settings
from app.redis_client import get_redis

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await websocket.accept()
    redis = get_redis()
    pubsub = redis.pubsub()
    await pubsub.subscribe(settings.ALERTS_CHANNEL)

    async def forward() -> None:
        # Relaie chaque message Redis vers le client WebSocket.
        async for message in pubsub.listen():
            if message and message.get("type") == "message":
                await websocket.send_text(message["data"])

    forward_task = asyncio.create_task(forward())
    try:
        # Boucle de réception : détecte la déconnexion du client.
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        forward_task.cancel()
        try:
            await pubsub.unsubscribe(settings.ALERTS_CHANNEL)
            await pubsub.aclose()
        except Exception:
            pass
