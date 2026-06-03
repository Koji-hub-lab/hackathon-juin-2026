import api from "./api";
import { mockUsers } from "@/mock/data";

export const getUsers = async () => {
  try {
    const { data } = await api.get("/api/users");
    return data;
  } catch {
    return mockUsers;
  }
};

export const createUser = async (user) => {
  const { data } = await api.post("/api/users", user);
  return data;
};
