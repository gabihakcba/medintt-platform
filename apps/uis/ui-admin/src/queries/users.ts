import { api } from "@/lib/axios";

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  name: string;
  lastName: string;
  dni: string;
}

export const createUser = async (data: CreateUserData) => {
  const response = await api.post("/admin/users", data);
  return response.data;
};

export const updateUser = async (id: string, data: Partial<CreateUserData>) => {
  const response = await api.patch(`/admin/users/${id}`, data);
  return response.data;
};

import { User } from "@medintt/types-auth";

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>("/admin/users");
  return response.data;
};
