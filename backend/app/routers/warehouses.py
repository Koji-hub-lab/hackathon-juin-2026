from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models import Warehouse
from app.schemas import WarehouseSchema

router = APIRouter(prefix="/warehouses", tags=["Warehouses"])


@router.get("", response_model=list[WarehouseSchema])
async def get_all(session: AsyncSession = Depends(get_session)):
    result = await session.scalars(select(Warehouse).order_by(Warehouse.id))
    return result.all()


@router.get("/{warehouse_id}")
async def get_by_id(
    warehouse_id: int, session: AsyncSession = Depends(get_session)
):
    warehouse = await session.get(Warehouse, warehouse_id)
    if warehouse is None:
        return JSONResponse(status_code=404, content={"error": "Entrepôt non trouvé"})
    return WarehouseSchema.model_validate(warehouse).model_dump()
