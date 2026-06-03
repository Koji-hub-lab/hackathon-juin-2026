"""Algorithme IA de prédiction de rupture de stock.

La consommation hebdomadaire est dérivée de l'historique réel des mouvements de
sortie (table `movements`, type "OUT") sur les 7 derniers jours. À défaut
d'historique, on retombe sur la valeur `weeklyUsage` de l'entrepôt.
"""

import math
from datetime import datetime, timedelta, timezone

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Movement, Warehouse
from app.schemas import Prediction

WINDOW_DAYS = 7


async def _weekly_usage(session: AsyncSession, warehouse: Warehouse) -> int:
    """Somme des quantités sorties (OUT) sur la fenêtre glissante de 7 jours."""
    cutoff = (
        (datetime.now(timezone.utc) - timedelta(days=WINDOW_DAYS))
        .isoformat()
        .replace("+00:00", "Z")
    )
    consumed = await session.scalar(
        select(func.coalesce(func.sum(Movement.quantity), 0))
        .where(Movement.warehouseId == warehouse.id)
        .where(Movement.type == "OUT")
        .where(Movement.createdAt >= cutoff)
    )
    # Repli sur la consommation théorique si aucun historique exploitable.
    return int(consumed) if consumed else warehouse.weeklyUsage


async def predict(session: AsyncSession, w: Warehouse) -> Prediction:
    weekly_usage = await _weekly_usage(session, w)

    # Consommation journalière moyenne.
    daily_usage = weekly_usage / 7.0

    # Jours avant rupture (tendance linéaire).
    days_until_rupture = (
        max(0, math.floor(w.stock / daily_usage)) if daily_usage > 0 else 999
    )

    # Taux de remplissage.
    fill_ratio = w.stock / w.capacity if w.capacity else 0.0

    # Score de confiance : stock bas = confiance haute.
    if fill_ratio < 0.25:
        confidence = min(95, 90 + round((0.25 - fill_ratio) * 100))
    else:
        confidence = round(60 + fill_ratio * 20)

    # Tendance basée sur la consommation hebdomadaire.
    if weekly_usage > 100:
        trend = "baisse"
    elif weekly_usage >= 50:
        trend = "stable"
    else:
        trend = "monte"

    # Recommandation textuelle.
    if days_until_rupture <= 2:
        recommendation = "Réapprovisionnement URGENT requis"
    elif days_until_rupture <= 7:
        recommendation = "Réapprovisionner dans les 48h"
    elif days_until_rupture <= 14:
        recommendation = "Surveiller — commander sous 1 semaine"
    else:
        recommendation = "Stock suffisant"

    return Prediction(
        warehouseId=w.id,
        warehouseName=w.name,
        currentStock=w.stock,
        capacity=w.capacity,
        fillPercent=round(fill_ratio * 100),
        daysUntilRupture=days_until_rupture,
        confidence=confidence,
        trend=trend,
        recommendation=recommendation,
    )
