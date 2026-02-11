import { api } from "@/lib/axios";

export interface Ausentismo {
  Id_Paciente: number | null;
  Fecha_Desde: Date | null;
  Fecha_Hasta: Date | null;
  Fecha_Reincoporacion: Date | null;
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
  } | null;
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
