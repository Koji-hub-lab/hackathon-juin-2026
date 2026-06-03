"""Base de données en mémoire (Singleton) basée sur resources/mock.json.

Chargement et sauvegarde synchrones. Aucune base externe : les données vivent
en mémoire et sont persistées dans le fichier JSON lors des mutations.
"""

import json
import threading
from pathlib import Path
from typing import Any, Dict, List

MOCK_PATH = Path(__file__).resolve().parent.parent / "resources" / "mock.json"


class Database:
    _instance: "Database | None" = None
    _lock = threading.Lock()

    def __new__(cls) -> "Database":
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    instance = super().__new__(cls)
                    instance._data = {}
                    cls._instance = instance
        return cls._instance

    def load(self) -> None:
        """Charge mock.json en mémoire (synchrone)."""
        with open(MOCK_PATH, encoding="utf-8") as f:
            self._data = json.load(f)

    def save(self) -> None:
        """Persiste l'état courant dans mock.json (synchrone)."""
        with open(MOCK_PATH, "w", encoding="utf-8") as f:
            json.dump(self._data, f, ensure_ascii=False, indent=2)

    @property
    def warehouses(self) -> List[Dict[str, Any]]:
        return self._data.setdefault("warehouses", [])

    @property
    def products(self) -> List[Dict[str, Any]]:
        return self._data.setdefault("products", [])

    @property
    def alerts(self) -> List[Dict[str, Any]]:
        return self._data.setdefault("alerts", [])

    @property
    def users(self) -> List[Dict[str, Any]]:
        return self._data.setdefault("users", [])


# Instance Singleton partagée par toute l'application.
db = Database()
