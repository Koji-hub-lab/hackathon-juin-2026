from pydantic import BaseModel, ConfigDict


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    warehouseId: int
    quantity: int
    minThreshold: int
    unit: str
