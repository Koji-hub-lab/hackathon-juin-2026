"""Schémas Pydantic v2 (validation In/Out) — camelCase, fidèles au contrat JSON."""

from app.schemas.alert import AlertOut
from app.schemas.inventory import InventoryProduct, InventoryView
from app.schemas.movement import MovementIn, MovementResult
from app.schemas.prediction import Prediction
from app.schemas.product import ProductOut
from app.schemas.user import UserIn, UserOut
from app.schemas.warehouse import WarehouseOut

# Alias rétro-compatibles.
WarehouseSchema = WarehouseOut
ProductSchema = ProductOut
AlertSchema = AlertOut
UserSchema = UserOut
MovementRequest = MovementIn
UserCreate = UserIn

__all__ = [
    "WarehouseOut",
    "ProductOut",
    "AlertOut",
    "MovementIn",
    "MovementResult",
    "UserIn",
    "UserOut",
    "Prediction",
    "InventoryProduct",
    "InventoryView",
    # alias
    "WarehouseSchema",
    "ProductSchema",
    "AlertSchema",
    "UserSchema",
    "MovementRequest",
    "UserCreate",
]
