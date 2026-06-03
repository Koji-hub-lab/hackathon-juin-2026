from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Product, Warehouse
from app.schemas import InventoryView

router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.get("", response_model=list[InventoryView])
async def get_inventory(
    warehouseId: Optional[int] = None,
    session: AsyncSession = Depends(get_db),
):
    wh_stmt = select(Warehouse).order_by(Warehouse.id)
    if warehouseId is not None:
        wh_stmt = wh_stmt.where(Warehouse.id == warehouseId)
    warehouses = (await session.scalars(wh_stmt)).all()

    products = (await session.scalars(select(Product))).all()

    result = []
    for w in warehouses:
        wh_products = [
            {
                "id": p.id,
                "name": p.name,
                "quantity": p.quantity,
                "minThreshold": p.minThreshold,
                "unit": p.unit,
                "belowThreshold": p.quantity < p.minThreshold,
            }
            for p in products
            if p.warehouseId == w.id
        ]
        fill_percent = round(w.stock / w.capacity * 100) if w.capacity else 0
        result.append(
            {
                "warehouseId": w.id,
                "warehouseName": w.name,
                "city": w.city,
                "stock": w.stock,
                "capacity": w.capacity,
                "fillPercent": fill_percent,
                "belowThreshold": fill_percent < 25,
                "products": wh_products,
            }
        )
    return result
