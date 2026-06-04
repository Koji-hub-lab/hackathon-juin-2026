import api from "./api";
import { mockWarehouses } from "@/mock/data";

// Appels réels (Phase 2) avec repli automatique sur les mocks (Phase 1)
// si le backend n'est pas joignable. L'UI reste donc démontrable seule.
export const getWarehouses = async () => {
  try {
    const { data } = await api.get("/api/warehouses");
    return data;
  } catch {
    return mockWarehouses;
  }
};

export const getWarehouseById = async (id) => {
  try {
    const { data } = await api.get(`/api/warehouses/${id}`);
    return data;
  } catch {
    return mockWarehouses.find((w) => w.id === Number(id)) || null;
  }
};
