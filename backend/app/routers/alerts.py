from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models import Alert
from app.schemas import AlertSchema

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("", response_model=list[AlertSchema])
async def get_all(
    level: Optional[str] = None,
    session: AsyncSession = Depends(get_session),
):
    stmt = select(Alert)
    if level:
        stmt = stmt.where(Alert.level == level)
    stmt = stmt.order_by(Alert.createdAt.desc())
    result = await session.scalars(stmt)
    return result.all()
