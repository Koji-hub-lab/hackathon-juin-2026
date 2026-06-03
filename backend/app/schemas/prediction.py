from pydantic import BaseModel


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
