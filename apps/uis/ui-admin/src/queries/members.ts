import { api } from "@/lib/axios";
import { User, Role, Organization, Project } from "@medintt/types-auth";

export interface Member {
  id: string;
  userId: string;
  projectId: string;
  roleId: string;
  organizationId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  project: Project;
  role: Role;
  organization?: Organization | null;
}

export interface OrganizationWithMembers extends Organization {
  members: Member[];
}

export interface UserWithMembers extends User {
  memberships: Member[];
}

export interface CreateMemberData {
  userId: string;
  projectId: string;
  roleId: string;
  organizationId?: string;
}

export const getMembersByOrg = async (): Promise<OrganizationWithMembers[]> => {
  const { data } = await api.get<OrganizationWithMembers[]>(
    "/admin/members/by-org",
  );
  return data;
};

export const getMembersByUser = async (): Promise<UserWithMembers[]> => {
  const { data } = await api.get<UserWithMembers[]>("/admin/members/by-user");
  return data;
};

export const createMember = async (
  member: CreateMemberData,
): Promise<Member> => {
  const { data } = await api.post<Member>("/admin/members", member);
  return data;
};

export const deleteMember = async (id: string): Promise<void> => {
  await api.delete(`/admin/members/${id}`);
};
