import api from "../lib/axios";
import { ForgotPasswordDto } from "@medintt/types-auth";

export const forgotPassword = async (data: ForgotPasswordDto) => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};
