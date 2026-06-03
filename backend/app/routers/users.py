from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models import User
from app.schemas import UserCreate, UserSchema

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=list[UserSchema])
async def get_all(session: AsyncSession = Depends(get_session)):
    result = await session.scalars(select(User).order_by(User.id))
    return result.all()


@router.post("", status_code=201)
async def create_user(
    body: UserCreate, session: AsyncSession = Depends(get_session)
):
    if not body.name or not body.role or not body.group:
        return JSONResponse(
            status_code=400,
            content={"error": "Champs manquants : name, role, group"},
        )

    max_id = await session.scalar(select(func.max(User.id)))
    new_id = (max_id or 0) + 1
    avatar = "".join(part[0] for part in body.name.split()[:2]).upper()

    user = User(
        id=new_id,
        name=body.name,
        role=body.role,
        group=body.group,
        avatar=avatar,
    )
    session.add(user)
    await session.commit()

    return UserSchema.model_validate(user).model_dump()
