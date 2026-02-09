import { api } from "@/lib/axios";
import { Permission } from "@medintt/types-auth";

// GET
export const getPermissions = async (): Promise<Permission[]> => {
  const { data } = await api.get("/admin/permissions");
  return data;
};

// POST
export const createPermission = async (
  permission: Pick<Permission, "resource" | "action">,
): Promise<Permission> => {
  const { data } = await api.post("/admin/permissions", permission);
  return data;
};

// PATCH
export const updatePermission = async (
  permission: Pick<Permission, "id" | "resource" | "action">,
): Promise<Permission> => {
  const { id, ...body } = permission;
  const { data } = await api.patch(`/admin/permissions/${id}`, body);
  return data;
};
