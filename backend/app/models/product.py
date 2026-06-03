from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str]
    warehouseId: Mapped[int] = mapped_column(
        ForeignKey("warehouses.id"), index=True
    )
    quantity: Mapped[int]
    minThreshold: Mapped[int]
    unit: Mapped[str]
