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
  page?: number;
  limit?: number;
  prestatariaId?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export const fetchAusentismos = async (
  filters?: AusentismosFilters,
): Promise<PaginatedResponse<Ausentismo>> => {
  const params = new URLSearchParams();
  if (filters?.desde) params.append("desde", filters.desde);
  if (filters?.hasta) params.append("hasta", filters.hasta);
  if (filters?.mesReferencia)
    params.append("mesReferencia", filters.mesReferencia);
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());
  if (filters?.prestatariaId)
    params.append("prestatariaId", filters.prestatariaId.toString());

  const query = params.toString();
  const url = `/medicina-laboral/ausentismos${query ? `?${query}` : ""}`;

  const { data } = await api.get<PaginatedResponse<Ausentismo>>(url);
  return data;
};

export const fetchAusentismoById = async (id: number): Promise<Ausentismo> => {
  const { data } = await api.get<Ausentismo>(
    `/medicina-laboral/ausentismos/${id}`,
  );
  return data;
};

export const fetchPrestatarias = async () => {
  const { data } = await api.get<{ Id: number; Nombre: string }[]>(
    "/medicina-laboral/prestatarias",
  );
  return data;
};

export const exportAusentismosExcel = async (
  filters?: AusentismosFilters,
): Promise<void> => {
  const params = new URLSearchParams();
  if (filters?.desde) params.append("desde", filters.desde);
  if (filters?.hasta) params.append("hasta", filters.hasta);
  if (filters?.mesReferencia)
    params.append("mesReferencia", filters.mesReferencia);
  if (filters?.search) params.append("search", filters.search);
  if (filters?.prestatariaId)
    params.append("prestatariaId", filters.prestatariaId.toString());

  const query = params.toString();
  const url = `/medicina-laboral/ausentismos/export/excel${
    query ? `?${query}` : ""
  }`;

  const response = await api.get(url, {
    responseType: "blob",
  });

  const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.setAttribute("download", "ausentismos.xlsx");
  document.body.appendChild(link);
  link.click();
  link.remove();
};
