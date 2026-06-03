"""Endpoint WebSocket natif /ws : diffuse les alertes en temps réel."""

from typing import Any, Dict, List

from fastapi import APIRouter, WebSocket, WebSocketDisconnect


class ConnectionManager:
    """Garde la liste des connexions WebSocket actives et diffuse les messages."""

    def __init__(self) -> None:
        self.active: List[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self.active:
            self.active.remove(websocket)

    async def broadcast(self, message: Dict[str, Any]) -> None:
        for websocket in list(self.active):
            try:
                await websocket.send_json(message)
            except Exception:
                self.disconnect(websocket)


# Manager partagé (utilisé par le scheduler pour diffuser les alertes).
manager = ConnectionManager()

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await manager.connect(websocket)
    try:
        while True:
            # On garde la connexion ouverte ; les messages entrants sont ignorés.
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
