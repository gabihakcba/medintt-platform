import { apiAuth } from "@/lib/axios";
import { Organization } from "@medintt/types-auth";

// GET
export const getOrganizations = async (): Promise<Organization[]> => {
  const { data } = await apiAuth.get("/organizations");
  return data;
};

// POST
export const createOrganization = async (
  organization: Pick<Organization, "name" | "cuit">,
): Promise<Organization> => {
  const { data } = await apiAuth.post("/organizations", organization);
  return data;
};

// PATCH
export const updateOrganization = async (
  organization: Pick<Organization, "id" | "name" | "cuit">,
): Promise<Organization> => {
  const { id, ...body } = organization;
  const { data } = await apiAuth.patch(`/organizations/${id}`, body);
  return data;
};
