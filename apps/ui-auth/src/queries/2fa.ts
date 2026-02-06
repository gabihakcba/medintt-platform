import api from "../lib/axios";

export const generate2Fa = async () => {
  const response = await api.post("/auth/2fa/generate", {});
  return response.data;
};

export const turnOn2Fa = async (code: string) => {
  const response = await api.post("/auth/2fa/turn-on", { code });
  return response.data;
};
