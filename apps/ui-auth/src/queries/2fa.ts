import api from "../lib/axios";

export const generate2Fa = async (token: string) => {
  const response = await api.post(
    "/auth/2fa/generate",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const turnOn2Fa = async (token: string, code: string) => {
  const response = await api.post(
    "/auth/2fa/turn-on",
    { code },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
