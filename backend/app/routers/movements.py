from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models import Movement, Warehouse
from app.schemas import MovementRequest
from app.services.scheduler import _now_iso

router = APIRouter(prefix="/movement", tags=["Movements"])


@router.post("")
async def create_movement(
    req: MovementRequest, session: AsyncSession = Depends(get_session)
):
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

    warehouse = await session.get(Warehouse, req.warehouseId)
    if warehouse is None:
        return JSONResponse(status_code=404, content={"error": "Entrepôt non trouvé"})

    delta = req.quantity if req.type == "IN" else -req.quantity
    warehouse.stock = max(0, warehouse.stock + delta)

    session.add(
        Movement(
            warehouseId=req.warehouseId,
            productId=req.productId,
            quantity=req.quantity,
            type=req.type,
            createdAt=_now_iso(),
        )
    )
    await session.commit()

    return {"success": True, "newStock": warehouse.stock}
