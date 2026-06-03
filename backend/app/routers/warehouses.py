from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Warehouse
from app.schemas import WarehouseOut

router = APIRouter(prefix="/warehouses", tags=["Warehouses"])


@router.get("", response_model=list[WarehouseOut])
async def get_all(session: AsyncSession = Depends(get_db)):
    result = await session.scalars(select(Warehouse).order_by(Warehouse.id))
    return result.all()


@router.get("/{warehouse_id}")
async def get_by_id(warehouse_id: int, session: AsyncSession = Depends(get_db)):
    warehouse = await session.get(Warehouse, warehouse_id)
    if warehouse is None:
        return JSONResponse(status_code=404, content={"error": "Entrepôt non trouvé"})
    return WarehouseOut.model_validate(warehouse).model_dump()
