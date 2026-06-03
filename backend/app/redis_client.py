"""Client Redis asynchrone partagé (Pub/Sub)."""

import redis.asyncio as aioredis

from app.config import settings

_client: aioredis.Redis | None = None


def get_redis() -> aioredis.Redis:
    """Retourne (et crée à la demande) le client Redis async partagé.

    `from_url` ne se connecte pas immédiatement : la connexion est établie
    paresseusement à la première commande, ce qui rend l'app résiliente au
    démarrage même si Redis n'est pas encore disponible.
    """
    global _client
    if _client is None:
        _client = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
        )
    return _client


async def close_redis() -> None:
    global _client
    if _client is not None:
        await _client.aclose()
        _client = None
