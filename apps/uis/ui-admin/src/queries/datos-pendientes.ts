import { api } from "@/lib/axios";

export interface PendingPracticaAttachment {
  Id: number;
  FileName: string | null;
  Descripcion: string | null;
  Extension: string | null;
}

export interface PendingPractica {
  Id: number;
  Practicas_Attachs: PendingPracticaAttachment[];
}

export interface PacienteResponse {
  Nombre: string;
  Apellido: string;
  NroDocumento: string;
  FechaNacimiento: Date;
  Direccion: string;
  Genero: string;
  Barrio?: string;
  Id_Localidad?: number;
  Telefono?: string;
  Celular1?: string;
  Email?: string;
  firma?: string | null;
  firmaUrl?: string;
  Nacionalidad?: string;
  CUIL?: string;
}

export interface PendingDataItem {
  Id?: number;
  // Minimal set of DDJJ fields if needed, mostly we need Pacientes and Attachments
  Pacientes: PacienteResponse;
  Practicas?: PendingPractica | null;
  Fecha?: Date | null;
}

export const getPendingData = async (): Promise<PendingDataItem[]> => {
  const { data } = await api.get<PendingDataItem[]>(
    "/medicina-laboral/declaracion-jurada/datos-pendientes",
  );
  return data;
};

export const sendPendingDataEmail = async (
  patients: { Email: string; Nombre: string; Apellido: string }[],
): Promise<any[]> => {
  const { data } = await api.post<any[]>(
    "/medicina-laboral/declaracion-jurada/datos-pendientes-send",
    { patients },
  );
  return data;
};
