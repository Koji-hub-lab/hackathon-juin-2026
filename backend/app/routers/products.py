from typing import Optional

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.database import db
from app.models import Product

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=list[Product])
def get_all(warehouseId: Optional[int] = None):
    products = db.products
    if warehouseId is not None:
        products = [p for p in products if p["warehouseId"] == warehouseId]
    return products


@router.get("/{product_id}")
def get_by_id(product_id: int):
    product = next((p for p in db.products if p["id"] == product_id), None)
    if product is None:
        return JSONResponse(status_code=404, content={"error": "Produit non trouvé"})
    return product
