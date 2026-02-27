import { apiAuth } from "@/lib/axios";

export const refresh = async () => {
  const { data } = await apiAuth.post("/auth/refresh");
  return data;
};

export const logout = async () => {
  try {
    // Quitamos el return para que no bloquee el flujo
    await apiAuth.get("/auth/logout");
  } catch (error) {
    console.error("Error en logout", error);
  } finally {
    // replace es más limpio que href para sesiones
    window.location.replace("/");
  }
};
