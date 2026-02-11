import { api } from "@/lib/axios";

export interface Profesional {
  Id: number;
  Nombre: string;
  Apellido: string;
  // Add other fields if needed based on Medintt4 definition
}

export const fetchProfesionales = async (): Promise<Profesional[]> => {
  const { data } = await api.get<Profesional[]>("/medintt4/profesionales");
  return data;
};
