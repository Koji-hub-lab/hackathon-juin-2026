"""Données initiales injectées dans PostgreSQL au démarrage (ex-mock.json).

Fidèles au contrat API d'origine.
"""

SEED = {
    "warehouses": [
        {"id": 1, "name": "Douala Central", "city": "Douala", "stock": 847, "capacity": 1000, "weeklyUsage": 120},
        {"id": 2, "name": "Yaoundé Nord", "city": "Yaoundé", "stock": 312, "capacity": 500, "weeklyUsage": 85},
        {"id": 3, "name": "Bafoussam Est", "city": "Bafoussam", "stock": 95, "capacity": 400, "weeklyUsage": 70},
        {"id": 4, "name": "Garoua Logistik", "city": "Garoua", "stock": 560, "capacity": 800, "weeklyUsage": 60},
    ],
    "products": [
        {"id": 1, "name": "Ciment Portland", "warehouseId": 1, "quantity": 240, "minThreshold": 50, "unit": "sacs"},
        {"id": 2, "name": "Fer à béton", "warehouseId": 1, "quantity": 180, "minThreshold": 30, "unit": "tonnes"},
        {"id": 3, "name": "Carrelage 60x60", "warehouseId": 2, "quantity": 90, "minThreshold": 20, "unit": "palettes"},
        {"id": 4, "name": "Peinture acrylique", "warehouseId": 2, "quantity": 45, "minThreshold": 15, "unit": "bidons"},
        {"id": 5, "name": "Plâtre en poudre", "warehouseId": 3, "quantity": 18, "minThreshold": 20, "unit": "sacs"},
        {"id": 6, "name": "Isolant thermique", "warehouseId": 3, "quantity": 12, "minThreshold": 25, "unit": "rouleaux"},
        {"id": 7, "name": "Gravier 0/8", "warehouseId": 4, "quantity": 320, "minThreshold": 80, "unit": "m³"},
    ],
    "alerts": [
        {"id": 1, "type": "LOW_STOCK", "message": "Bafoussam Est sous 25% de capacité", "level": "warning", "warehouseId": 3, "createdAt": "2026-06-03T06:00:00Z"},
        {"id": 2, "type": "CRITICAL", "message": "Plâtre en poudre sous le seuil minimum", "level": "danger", "warehouseId": 3, "createdAt": "2026-06-03T07:15:00Z"},
        {"id": 3, "type": "LOW_STOCK", "message": "Isolant thermique critique", "level": "danger", "warehouseId": 3, "createdAt": "2026-06-03T07:45:00Z"},
        {"id": 4, "type": "INFO", "message": "Réapprovisionnement Yaoundé programmé", "level": "info", "warehouseId": 2, "createdAt": "2026-06-03T08:00:00Z"},
    ],
    "users": [
        {"id": 1, "name": "Mekontso Olivier Steve", "role": "Tech Lead", "group": "backend", "avatar": "MO"},
        {"id": 2, "name": "Membre Backend 2", "role": "Backend Dev", "group": "backend", "avatar": "MB"},
        {"id": 3, "name": "Membre Frontend 3", "role": "Frontend Lead", "group": "frontend", "avatar": "MF"},
        {"id": 4, "name": "Membre Frontend 4", "role": "Frontend Dev", "group": "frontend", "avatar": "MF"},
    ],
}
