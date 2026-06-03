from typing import Optional

from pydantic import BaseModel


class MovementIn(BaseModel):
    # Champs optionnels : la validation métier renvoie le 400 documenté.
    warehouseId: Optional[int] = None
    productId: Optional[int] = None
    quantity: Optional[int] = None
    type: Optional[str] = None


class MovementResult(BaseModel):
    success: bool
    newStock: int
