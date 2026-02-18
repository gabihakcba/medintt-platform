import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api as axios } from "@/lib/axios";

export interface IncidenteLaboral {
  Id: number;
  Fecha: string;
  Clase: string;
  Paciente: string;
  DNI: string;
  Profesional: string;
  Notas: string;
  Id_Prestataria: number | null;
  Prestataria?: {
    Id: number;
    Nombre: string;
    // Add other fields if necessary
  } | null;
}

export interface IncidentesFilters {
  page?: number;
  limit?: number;
  search?: string;
  prestatariaId?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

const fetchIncidentesLaborales = async (
  filters?: IncidentesFilters,
): Promise<PaginatedResponse<IncidenteLaboral>> => {
  const params = new URLSearchParams();
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());
  if (filters?.search) params.append("search", filters.search);
  if (filters?.prestatariaId)
    params.append("prestatariaId", filters.prestatariaId.toString());

  const query = params.toString();
  const url = `/medicina-laboral/incidentes-laborales${
    query ? `?${query}` : ""
  }`;

  const { data } = await axios.get<PaginatedResponse<IncidenteLaboral>>(url);
  return data;
};

export const useIncidentesLaborales = (filters?: IncidentesFilters) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["incidentes-laborales", filters],
    queryFn: () => fetchIncidentesLaborales(filters),
    placeholderData: keepPreviousData,
  });

  return {
    incidentes: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isError,
    error,
  };
};
