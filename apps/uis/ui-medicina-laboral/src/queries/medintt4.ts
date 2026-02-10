import { api } from "@/lib/axios";

export interface Provincia {
  Id: number;
  Provincia: string;
}

export interface Localidad {
  Id: number;
  Localidad: string;
  CP: string;
  Id_Provincia: number;
}

export interface PacienteData {
  Apellido: string;
  Nombre: string;
  NroDocumento: string;
  FechaNacimiento: string; // ISO string
  Direccion: string;
  Barrio: string;
  Id_Localidad: number;
  Telefono: string;
  Email: string;
  Nacionalidad?: string;
  CUIL?: string;
}

export const getProvincias = async (): Promise<Provincia[]> => {
  const { data } = await api.get<Provincia[]>("/medintt4/provincias");
  return data;
};

export const getLocalidades = async (): Promise<Localidad[]> => {
  const { data } = await api.get<Localidad[]>(
    "/medintt4/public/localidades", // Using public endpoint
  );
  return data;
};

export const updatePaciente = async (
  proof: string,
  paciente: PacienteData,
): Promise<any> => {
  const { data } = await api.patch("/medintt4/pacientes", {
    proof,
    paciente,
  });
  return data;
};
