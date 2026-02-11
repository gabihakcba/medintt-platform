import { api } from "@/lib/axios";

export interface Prestataria {
  Id: number;
  Codigo: string | null;
  Cuit: string | null;
  Nombre: string | null;
}

export const fetchPrestatarias = async (): Promise<Prestataria[]> => {
  const { data } = await api.get<Prestataria[]>("/medintt4/prestatarias");
  return data;
};
