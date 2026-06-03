from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str]
    role: Mapped[str]
    # `group` est un mot réservé SQL : colonne nommée "user_group", attribut "group".
    group: Mapped[str] = mapped_column("user_group")
    avatar: Mapped[str]
