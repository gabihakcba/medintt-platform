import { LoginDto, LoginResponseDto } from "@medintt/types-auth";
import axios from "axios";

export const login = async (data: LoginDto): Promise<LoginResponseDto> => {
  const response = await axios.post(
    "http://localhost:3001/api/v1/auth/login",
    data
  );
  return response.data;
};
