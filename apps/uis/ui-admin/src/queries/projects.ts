import { apiAuth } from "@/lib/axios";

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
  const { data } = await apiAuth.get("/projects");
  return data;
};

export const createProject = async (project: CreateProjectData) => {
  const { data } = await apiAuth.post("/projects", project);
  return data;
};

export const updateProject = async (
  id: string,
  project: Partial<CreateProjectData>,
) => {
  const { data } = await apiAuth.patch(`/projects/${id}`, project);
  return data;
};
