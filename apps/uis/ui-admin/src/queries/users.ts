import { api, apiAuth } from "@/lib/axios";

export interface CreateUserData {
  username: string;
  email: string;
  password?: string;
  name: string;
  lastName: string;
  dni: string;
  cargo?: string;
  celular?: string;
}

export interface RegisterMemberData {
  organizationId: string;
  roleCode: string;
  projectCode: string;
}

export interface CreateInterlocutorData {
  user: CreateUserData;
  member: RegisterMemberData;
}

export const createUser = async (data: CreateUserData) => {
  const response = await apiAuth.post("/auth/register", data);
  return response.data;
};

export const createInterlocutor = async (data: CreateInterlocutorData) => {
  const response = await apiAuth.post("/auth/register/interlocutor", data);
  return response.data;
};

export const updateUser = async (id: string, data: Partial<CreateUserData>) => {
  const response = await apiAuth.patch(`/users/${id}`, data);
  return response.data;
};

import { User } from "@medintt/types-auth";

export const getUsers = async (): Promise<User[]> => {
  const response = await apiAuth.get<User[]>("/users");
  return response.data;
};
