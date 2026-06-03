from pydantic import BaseModel, ConfigDict


class WarehouseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    city: str
    stock: int
    capacity: int
    weeklyUsage: int
