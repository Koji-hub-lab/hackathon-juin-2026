from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Warehouse
from app.schemas import Prediction
from app.services.predict import predict

router = APIRouter(prefix="/predict", tags=["Predict"])


@router.get("", response_model=list[Prediction])
async def get_predictions(session: AsyncSession = Depends(get_db)):
    warehouses = (
        await session.scalars(select(Warehouse).order_by(Warehouse.id))
    ).all()
    return [await predict(session, w) for w in warehouses]
