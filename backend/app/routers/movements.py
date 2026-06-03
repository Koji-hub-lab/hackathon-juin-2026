from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.database import db
from app.models import MovementRequest

router = APIRouter(prefix="/movement", tags=["Movements"])


@router.post("")
def create_movement(req: MovementRequest):
    if (
        req.warehouseId is None
        or req.productId is None
        or not req.quantity
        or req.type is None
    ):
        return JSONResponse(
            status_code=400,
            content={
                "error": "Champs manquants : warehouseId, productId, quantity, type"
            },
        )

    if req.type not in ("IN", "OUT"):
        return JSONResponse(
            status_code=400,
            content={"error": 'type doit être "IN" ou "OUT"'},
        )

    warehouse = next(
        (w for w in db.warehouses if w["id"] == req.warehouseId), None
    )
    if warehouse is None:
        return JSONResponse(status_code=404, content={"error": "Entrepôt non trouvé"})

    delta = req.quantity if req.type == "IN" else -req.quantity
    warehouse["stock"] = max(0, warehouse["stock"] + delta)
    db.save()

    return {"success": True, "newStock": warehouse["stock"]}
