import api from "./api";
import { mockProducts } from "@/mock/data";

export const getProducts = async (warehouseId) => {
  try {
    const { data } = await api.get("/api/products", {
      params: warehouseId ? { warehouseId } : undefined,
    });
    return data;
  } catch {
    return warehouseId
      ? mockProducts.filter((p) => p.warehouseId === Number(warehouseId))
      : mockProducts;
  }
};

export const getProductById = async (id) => {
  try {
    const { data } = await api.get(`/api/products/${id}`);
    return data;
  } catch {
    return mockProducts.find((p) => p.id === Number(id)) || null;
  }
};
