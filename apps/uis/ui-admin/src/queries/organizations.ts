import { api } from "@/lib/axios";
import { Organization } from "@medintt/types-auth";

// GET
export const getOrganizations = async (): Promise<Organization[]> => {
  const { data } = await api.get("/admin/organizations");
  return data;
};

// POST
export const createOrganization = async (
  organization: Pick<Organization, "name" | "cuit">,
): Promise<Organization> => {
  const { data } = await api.post("/admin/organizations", organization);
  return data;
};

// PATCH
export const updateOrganization = async (
  organization: Pick<Organization, "id" | "name" | "cuit">,
): Promise<Organization> => {
  const { id, ...body } = organization;
  const { data } = await api.patch(`/admin/organizations/${id}`, body);
  return data;
};
