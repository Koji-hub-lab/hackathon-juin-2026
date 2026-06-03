"""Couche d'accès aux données — SQLAlchemy asynchrone (PostgreSQL via asyncpg).

Fournit l'engine, la fabrique de sessions, la dépendance `get_session` et le
script de migration/seed automatique exécuté au démarrage.
"""

from typing import AsyncGenerator

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.config import settings


class Base(DeclarativeBase):
    pass


engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
)

async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Dépendance FastAPI : fournit une session async par requête."""
    async with async_session() as session:
        yield session


async def init_db() -> None:
    """Crée les tables (migration) puis injecte les données initiales (seed)."""
    # Import tardif pour enregistrer les tables sur Base.metadata.
    import app.models  # noqa: F401

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    await _seed()


async def _seed() -> None:
    """Injecte les données initiales si la base est vide (idempotent)."""
    from app.models import Alert, Product, User, Warehouse
    from app.seed_data import SEED

    async with async_session() as session:
        count = await session.scalar(select(func.count()).select_from(Warehouse))
        if count:
            return

        session.add_all(Warehouse(**w) for w in SEED["warehouses"])
        session.add_all(Product(**p) for p in SEED["products"])
        session.add_all(Alert(**a) for a in SEED["alerts"])
        session.add_all(User(**u) for u in SEED["users"])
        await session.commit()
