"""Schémas Pydantic v2 — noms de champs en camelCase pour coller strictement
au contrat API documenté (Section 4 du README équipe)."""

from typing import List, Optional

from pydantic import BaseModel


class Warehouse(BaseModel):
    id: int
    name: str
    city: str
    stock: int
    capacity: int
    weeklyUsage: int


class Product(BaseModel):
    id: int
    name: str
    warehouseId: int
    quantity: int
    minThreshold: int
    unit: str


class Alert(BaseModel):
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
    # Champs optionnels : la validation métier renvoie le 400 documenté.
    warehouseId: Optional[int] = None
    productId: Optional[int] = None
    quantity: Optional[int] = None
    type: Optional[str] = None


class User(BaseModel):
    id: int
    name: str
    role: str
    group: str
    avatar: str


class UserCreate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    group: Optional[str] = None
