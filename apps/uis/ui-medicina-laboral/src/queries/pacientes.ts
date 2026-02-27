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
  examenesCount?: number;
}

// Shared interface (move to a shared types file preferably, but keeping here for now)
export interface PacientesFilters {
  page?: number;
  limit?: number;
  search?: string;
  prestatariaId?: number;
  includeExamsCount?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export const fetchPacientes = async (
  filters?: PacientesFilters,
): Promise<PaginatedResponse<Paciente>> => {
  const params = new URLSearchParams();
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());
  if (filters?.search) params.append("search", filters.search);
  if (filters?.prestatariaId)
    params.append("prestatariaId", filters.prestatariaId.toString());
  if (filters?.includeExamsCount) params.append("includeExamsCount", "true");

  const query = params.toString();
  const url = `/medicina-laboral/pacientes${query ? `?${query}` : ""}`;

  const { data } = await api.get<PaginatedResponse<Paciente>>(url);
  return data;
};

export const updatePaciente = async (
  id: number,
  payload: Partial<Paciente>,
): Promise<Paciente> => {
  const { data } = await api.patch<Paciente>(
    `/medicina-laboral/pacientes/${id}`,
    payload,
  );
  return data;
};

export const exportPacientesExcel = async (filters: PacientesFilters) => {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.prestatariaId)
    params.append("prestatariaId", filters.prestatariaId.toString());
  if (filters.includeExamsCount)
    params.append("includeExamsCount", filters.includeExamsCount.toString());

  const query = params.toString();
  const url = `/medicina-laboral/pacientes/export/excel${
    query ? `?${query}` : ""
  }`;

  const response = await api.get(url, {
    responseType: "blob",
  });

  const contentDisposition = response.headers["content-disposition"];
  let filename = "pacientes.xlsx";
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
    if (filenameMatch && filenameMatch.length === 2) {
      filename = filenameMatch[1];
    }
  }

  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
};
