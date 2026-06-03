from typing import Optional

from fastapi import APIRouter

from app.database import db
from app.models import Alert

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("", response_model=list[Alert])
def get_all(level: Optional[str] = None):
    alerts = db.alerts
    if level:
        alerts = [a for a in alerts if a["level"] == level]
    # Tri par date de création décroissante.
    return sorted(alerts, key=lambda a: a["createdAt"], reverse=True)
