import { apiAuth } from "@/lib/axios";

export const refresh = async () => {
  const { data } = await apiAuth.post("/auth/refresh");
  return data;
};

export const logout = async () => {
  const origin = window.location.origin;
  window.location.href = `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/logout?from=${encodeURIComponent(origin)}`;
};
