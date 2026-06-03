from fastapi import APIRouter

from app.database import db
from app.models import Prediction
from app.services.predict import predict

router = APIRouter(prefix="/predict", tags=["Predict"])


@router.get("", response_model=list[Prediction])
def get_predictions():
    return [predict(w) for w in db.warehouses]
