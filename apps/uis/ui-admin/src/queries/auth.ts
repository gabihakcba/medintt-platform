import { apiAuth } from "@/lib/axios";

export const refresh = async () => {
  const { data } = await apiAuth.post("/auth/refresh");
  return data;
};

export const logout = async () => {
  const { data } = await apiAuth.get("/auth/logout");
  if (data?.success) {
    if (data.action === "EXTERNAL_LOGOUT" || data.action === "LOCAL_LOGOUT") {
      window.location.href = data.url;
    }
  }
  return data;
};
