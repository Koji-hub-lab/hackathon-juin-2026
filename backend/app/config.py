"""Configuration applicative via Pydantic-Settings (chargée depuis .env)."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # TEMPORAIRE : SQLite local pour tester sans Docker.
    # Pour PostgreSQL, surcharger via .env :
    #   DATABASE_URL=postgresql+asyncpg://supplychain:supplychain@localhost:5432/supplychain
    DATABASE_URL: str = "sqlite+aiosqlite:///./test.db"
    # Connexion Redis (Pub/Sub temps réel).
    REDIS_URL: str = "redis://localhost:6379/0"
    # TEMPORAIRE : Redis + WebSocket désactivés pour démarrer sans Docker.
    # Repasser à True (ou définir ENABLE_REDIS=true dans .env) avec Redis lancé.
    ENABLE_REDIS: bool = False
    # Canal Redis de diffusion des alertes.
    ALERTS_CHANNEL: str = "alerts"
    # Origines CORS autorisées (frontend Next.js : ports 3000 et 3005).
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:3005",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
