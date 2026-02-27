import { apiAuth } from "@/lib/axios";

export const refresh = async () => {
  const { data } = await apiAuth.post("/auth/refresh");
  return data;
};

export const logout = async () => {
  // window.location.href = `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/logout`;
  return await apiAuth.get("/auth/logout");
};
