import { api } from "@/lib/axios";

export interface Paciente {
  Id: number;
  Codigo: string | null;
  Apellido: string | null;
  Nombre: string | null;
  TipoDocumento: string | null;
  NroDocumento: string | null;
  FechaNacimiento: Date | null;
  Direccion: string | null;
  Telefono: string | null;
  Celular1: string | null;
  Email: string | null;
  Cargo: string | null;
  Puesto: string | null;
  Activo: number | null;
}

export const fetchPacientes = async (): Promise<Paciente[]> => {
  const { data } = await api.get<Paciente[]>("/medicina-laboral/pacientes");
  return data;
};
