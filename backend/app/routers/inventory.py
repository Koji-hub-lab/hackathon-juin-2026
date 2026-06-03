from typing import Optional

from fastapi import APIRouter

from app.database import db
from app.models import InventoryView

router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.get("", response_model=list[InventoryView])
def get_inventory(warehouseId: Optional[int] = None):
    warehouses = db.warehouses
    if warehouseId is not None:
        warehouses = [w for w in warehouses if w["id"] == warehouseId]

    result = []
    for w in warehouses:
        products = [
            {
                "id": p["id"],
                "name": p["name"],
                "quantity": p["quantity"],
                "minThreshold": p["minThreshold"],
                "unit": p["unit"],
                "belowThreshold": p["quantity"] < p["minThreshold"],
            }
            for p in db.products
            if p["warehouseId"] == w["id"]
        ]
        fill_percent = round(w["stock"] / w["capacity"] * 100) if w["capacity"] else 0
        result.append(
            {
                "warehouseId": w["id"],
                "warehouseName": w["name"],
                "city": w["city"],
                "stock": w["stock"],
                "capacity": w["capacity"],
                "fillPercent": fill_percent,
                "belowThreshold": fill_percent < 25,
                "products": products,
            }
        )
    return result
