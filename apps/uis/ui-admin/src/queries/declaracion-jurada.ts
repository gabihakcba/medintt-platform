import { api } from "@/lib/axios";

export interface Paciente {
  Id: number;
  Nombre: string;
  Apellido: string;
  NroDocumento: string;
  Email: string;
  Telefono?: string;
}

export interface Prestataria {
  Id: number;
  Nombre: string;
}

export interface DeclaracionPendiente {
  Id: number;
  Fecha: string;
  Status: string;
  Id_Paciente: number;
  Id_empresa: number | null;
  Pacientes: Paciente;
  Prestatarias: Prestataria | null;
}

export const getPendientes = async (): Promise<DeclaracionPendiente[]> => {
  const { data } = await api.get<DeclaracionPendiente[]>(
    "/medicina-laboral/declaracion-jurada/pendientes",
  );
  return data;
};

export const sendPendingEmails = async (
  ids: number[],
): Promise<{ id: number; success: boolean; error?: string }[]> => {
  const { data } = await api.post(
    "/medicina-laboral/declaracion-jurada/send-ddjj-link",
    { ids },
  );
  return data;
};
