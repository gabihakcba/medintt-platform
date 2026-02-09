import api from "@/lib/axios";

export const confirmAccount = async (token: string) => {
  const { data } = await api.get(`/auth/confirm?token=${token}`);
  return data;
};
