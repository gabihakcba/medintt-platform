import { api } from "@/lib/axios";

export interface Ausentismo {
  Id: number;
  Id_Paciente: number | null;
  Id_Prestataria: number | null;
  Fecha_Desde: string | null;
  Fecha_Hasta: string | null;
  Fecha_Reincoporacion: string | null;
  Diagnostico: string | null;
  Evolucion: string | null;
  Ausentismos_Categorias: {
    Categoria: string | null;
  } | null;
  paciente: {
    Id: number;
    Nombre: string | null;
    Apellido: string | null;
    NroDocumento: string | null;
    Direccion?: string | null;
    Email?: string | null;
    Telefono?: string | null;
    Celular1?: string | null;
    FechaNacimiento?: string | null;
  } | null;
  prestataria: {
    Id: number;
    Nombre: string | null;
    Codigo?: string | null;
  } | null;
  Ausentismos_Attachs?: {
    Id: number;
    FileName: string | null;
    Extension: string | null;
  }[];
  Ausentismos_Certificados?: {
    Id: number;
    FileName: string | null;
    Extension: string | null;
  }[];
  Ausentismos_Bitacora?: {
    Id: number;
    Observaciones: string | null;
    Fecha: string | null;
  }[];
  Ausentismos_Controles?: {
    Id: number;
    Instrucciones: string | null;
    Evolucion: string | null;
    Fecha_Control: string | null;
  }[];
  Ausentismos_Informes?: {
    Id: number;
    Informe: string | null;
    Fecha: string | null;
  }[];
}

export interface AusentismosFilters {
  desde?: string;
  hasta?: string;
  mesReferencia?: string;
}

export const fetchAusentismos = async (
  filters?: AusentismosFilters,
): Promise<Ausentismo[]> => {
  const params = new URLSearchParams();
  if (filters?.desde) params.append("desde", filters.desde);
  if (filters?.hasta) params.append("hasta", filters.hasta);
  if (filters?.mesReferencia)
    params.append("mesReferencia", filters.mesReferencia);

  const query = params.toString();
  const url = `/medicina-laboral/ausentismos${query ? `?${query}` : ""}`;

  const { data } = await api.get<Ausentismo[]>(url);
  return data;
};

export const fetchAusentismoById = async (id: number): Promise<Ausentismo> => {
  const { data } = await api.get<Ausentismo>(
    `/medicina-laboral/ausentismos/${id}`,
  );
  return data;
};
