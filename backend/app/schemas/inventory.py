from typing import List

from pydantic import BaseModel


class InventoryProduct(BaseModel):
    id: int
    name: str
    quantity: int
    minThreshold: int
    unit: str
    belowThreshold: bool


class InventoryView(BaseModel):
    warehouseId: int
    warehouseName: str
    city: str
    stock: int
    capacity: int
    fillPercent: int
    belowThreshold: bool
    products: List[InventoryProduct]
