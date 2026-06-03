from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.database import db
from app.models import Warehouse

router = APIRouter(prefix="/warehouses", tags=["Warehouses"])


@router.get("", response_model=list[Warehouse])
def get_all():
    return db.warehouses


@router.get("/{warehouse_id}")
def get_by_id(warehouse_id: int):
    warehouse = next((w for w in db.warehouses if w["id"] == warehouse_id), None)
    if warehouse is None:
        return JSONResponse(status_code=404, content={"error": "Entrepôt non trouvé"})
    return warehouse
