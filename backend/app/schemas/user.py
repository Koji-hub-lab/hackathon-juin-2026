from typing import Optional

from pydantic import BaseModel, ConfigDict


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    role: str
    group: str
    avatar: str


class UserIn(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    group: Optional[str] = None
