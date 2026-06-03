from typing import Optional

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Product
from app.schemas import ProductOut

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=list[ProductOut])
async def get_all(
    warehouseId: Optional[int] = None,
    session: AsyncSession = Depends(get_db),
):
    stmt = select(Product).order_by(Product.id)
    if warehouseId is not None:
        stmt = stmt.where(Product.warehouseId == warehouseId)
    result = await session.scalars(stmt)
    return result.all()


@router.get("/{product_id}")
async def get_by_id(product_id: int, session: AsyncSession = Depends(get_db)):
    product = await session.get(Product, product_id)
    if product is None:
        return JSONResponse(status_code=404, content={"error": "Produit non trouvé"})
    return ProductOut.model_validate(product).model_dump()
