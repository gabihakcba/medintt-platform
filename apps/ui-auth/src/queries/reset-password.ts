import api from "../lib/axios";
import { ResetPasswordDto } from "@medintt/types-auth";

export const resetPassword = async (data: ResetPasswordDto) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};
