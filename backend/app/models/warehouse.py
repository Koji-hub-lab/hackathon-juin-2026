from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Warehouse(Base):
    __tablename__ = "warehouses"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str]
    city: Mapped[str]
    stock: Mapped[int]
    capacity: Mapped[int]
    weeklyUsage: Mapped[int]
