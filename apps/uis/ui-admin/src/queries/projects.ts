import { api } from "@/lib/axios";

export interface ProjectData {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  name: string;
  code: string;
  description?: string;
}

export const getProjects = async (): Promise<ProjectData[]> => {
  const { data } = await api.get("/admin/projects");
  return data;
};

export const createProject = async (project: CreateProjectData) => {
  const { data } = await api.post("/admin/projects", project);
  return data;
};

export const updateProject = async (
  id: string,
  project: Partial<CreateProjectData>,
) => {
  const { data } = await api.patch(`/admin/projects/${id}`, project);
  return data;
};
