from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Movement(Base):
    __tablename__ = "movements"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    warehouseId: Mapped[int] = mapped_column(
        ForeignKey("warehouses.id"), index=True
    )
    productId: Mapped[int] = mapped_column(index=True)
    quantity: Mapped[int]
    type: Mapped[str]
    createdAt: Mapped[str]
