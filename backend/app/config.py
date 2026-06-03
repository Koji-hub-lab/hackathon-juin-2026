"""Configuration applicative via Pydantic-Settings (chargée depuis .env)."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Connexion PostgreSQL asynchrone (driver asyncpg).
    DATABASE_URL: str = (
        "postgresql+asyncpg://supplychain:supplychain@localhost:5432/supplychain"
    )
    # Connexion Redis (Pub/Sub temps réel).
    REDIS_URL: str = "redis://localhost:6379/0"
    # Canal Redis de diffusion des alertes.
    ALERTS_CHANNEL: str = "alerts"
    # Origines CORS autorisées (frontend Next.js).
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
