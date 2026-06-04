from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    type: Mapped[str]
    message: Mapped[str]
    level: Mapped[str] = mapped_column(index=True)
    warehouseId: Mapped[int] = mapped_column(index=True)
    # Conservé en chaîne ISO 8601 (…Z) pour rester fidèle au format JSON d'origine.
    createdAt: Mapped[str]
