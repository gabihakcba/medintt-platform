import { api } from "@/lib/axios";
import { Role } from "@medintt/types-auth";

// GET
export const getRoles = async (): Promise<Role[]> => {
  const { data } = await api.get("/admin/roles");
  return data;
};

// POST
export const createRole = async (
  role: Pick<Role, "name" | "description">,
): Promise<Role> => {
  const { data } = await api.post("/admin/roles", role);
  return data;
};

// PATCH
export const updateRole = async (
  role: Pick<Role, "id" | "name" | "description">,
): Promise<Role> => {
  const { id, ...body } = role;
  const { data } = await api.patch(`/admin/roles/${id}`, body);
  return data;
};
