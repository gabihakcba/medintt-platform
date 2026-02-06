import { LoginDto, LoginResponseDto } from "@medintt/types-auth";
import api from "../lib/axios";

export const login = async (data: LoginDto): Promise<LoginResponseDto> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};
