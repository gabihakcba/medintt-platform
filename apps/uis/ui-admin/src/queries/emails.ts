import { api } from "@/lib/axios";

export interface EmpresaEmail {
  Id: number;
  Tipo: string;
  Nombre: string;
  emails: string[];
}

export interface ArtEmail {
  Id: number;
  Tipo: string;
  Nombre: string;
  emails: string[];
}

export interface PacienteEmail {
  Id: number;
  Nombre: string;
  Apellido: string;
  NroDocumento: string;
  emails: string[];
}

export interface PacienteFilters {
  desde?: string;
  hasta?: string;
  profesionalId?: number;
}

export const fetchEmpresasEmails = async (): Promise<EmpresaEmail[]> => {
  const { data } = await api.get<EmpresaEmail[]>("/medintt4/emails/empresas");
  return data;
};

export const fetchArtEmails = async (): Promise<ArtEmail[]> => {
  const { data } = await api.get<ArtEmail[]>("/medintt4/emails/art");
  return data;
};

export const fetchPacientesEmails = async (
  filters?: PacienteFilters,
): Promise<PacienteEmail[]> => {
  const { data } = await api.get<PacienteEmail[]>(
    "/medintt4/emails/pacientes",
    {
      params: filters,
    },
  );
  return data;
};
