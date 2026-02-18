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
