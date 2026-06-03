from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.database import db
from app.models import User, UserCreate

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=list[User])
def get_all():
    return db.users


@router.post("", status_code=201)
def create_user(body: UserCreate):
    if not body.name or not body.role or not body.group:
        return JSONResponse(
            status_code=400,
            content={"error": "Champs manquants : name, role, group"},
        )

    new_id = max((u["id"] for u in db.users), default=0) + 1
    avatar = "".join(part[0] for part in body.name.split()[:2]).upper()
    user = {
        "id": new_id,
        "name": body.name,
        "role": body.role,
        "group": body.group,
        "avatar": avatar,
    }
    db.users.append(user)
    db.save()
    return user
