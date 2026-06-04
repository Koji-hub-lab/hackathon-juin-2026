import api from "./api";
import { mockAlerts } from "@/mock/data";

export const getAlerts = async (level) => {
  try {
    const { data } = await api.get("/api/alerts", {
      params: level ? { level } : undefined,
    });
    return data;
  } catch {
    const alerts = level
      ? mockAlerts.filter((a) => a.level === level)
      : mockAlerts;
    return [...alerts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }
};
