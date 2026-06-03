import api from "./api";
import { mockInventory } from "@/mock/data";

export const getInventory = async (warehouseId) => {
  try {
    const { data } = await api.get("/api/inventory", {
      params: warehouseId ? { warehouseId } : undefined,
    });
    return data;
  } catch {
    return warehouseId
      ? mockInventory.filter((i) => i.warehouseId === Number(warehouseId))
      : mockInventory;
  }
};
