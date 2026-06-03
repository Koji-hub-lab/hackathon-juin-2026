"""Schémas Pydantic v2 (réponses API) — camelCase, fidèles au contrat JSON.

`from_attributes=True` permet la sérialisation directe des objets ORM SQLAlchemy.
"""

from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class WarehouseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    city: str
    stock: int
    capacity: int
    weeklyUsage: int


class ProductSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    warehouseId: int
    quantity: int
    minThreshold: int
    unit: str


class AlertSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: str
    message: str
    level: str
    warehouseId: int
    createdAt: str


class Prediction(BaseModel):
    warehouseId: int
    warehouseName: str
    currentStock: int
    capacity: int
    fillPercent: int
    daysUntilRupture: int
    confidence: int
    trend: str
    recommendation: str


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


class MovementRequest(BaseModel):
    warehouseId: Optional[int] = None
    productId: Optional[int] = None
    quantity: Optional[int] = None
    type: Optional[str] = None


class UserSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    role: str
    group: str
    avatar: str


class UserCreate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    group: Optional[str] = None
