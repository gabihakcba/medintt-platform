import { apiAuth } from "@/lib/axios";

export const refresh = async () => {
  const { data } = await apiAuth.post("/auth/refresh");
  return data;
};

export const logout = async () => {
  const response = await apiAuth.get("/auth/logout");
  window.location.href = "/";
  return response;
};
