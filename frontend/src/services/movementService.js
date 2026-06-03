import api from "./api";

// POST /api/movement — enregistre une entrée (IN) ou sortie (OUT) de stock.
export const createMovement = async (movement) => {
  const { data } = await api.post("/api/movement", movement);
  return data;
};
