"""Algorithme IA de prédiction de rupture de stock.

Portage fidèle de PredictService.java (tendance linéaire). Accepte tout objet
exposant les attributs id, name, stock, capacity, weeklyUsage (modèle ORM).
"""

import math

from app.schemas import Prediction


def predict(w) -> Prediction:
    stock = w.stock
    capacity = w.capacity
    weekly_usage = w.weeklyUsage

    # Consommation journalière moyenne.
    daily_usage = weekly_usage / 7.0

    # Jours avant rupture (tendance linéaire).
    days_until_rupture = (
        max(0, math.floor(stock / daily_usage)) if daily_usage > 0 else 999
    )

    # Taux de remplissage.
    fill_ratio = stock / capacity if capacity else 0.0

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
        currentStock=stock,
        capacity=capacity,
        fillPercent=round(fill_ratio * 100),
        daysUntilRupture=days_until_rupture,
        confidence=confidence,
        trend=trend,
        recommendation=recommendation,
    )
