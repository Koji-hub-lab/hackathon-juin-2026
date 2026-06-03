import api from "./api";
import { mockPredictions } from "@/mock/data";

export const getPredictions = async () => {
  try {
    const { data } = await api.get("/api/predict");
    return data;
  } catch {
    return mockPredictions;
  }
};
