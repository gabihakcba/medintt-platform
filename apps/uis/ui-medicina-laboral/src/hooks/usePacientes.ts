import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPacientes, PacientesFilters } from "../queries/pacientes";

export const usePacientes = (filters?: PacientesFilters) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["pacientes", filters],
    queryFn: () => fetchPacientes(filters),
    placeholderData: keepPreviousData,
  });

  return {
    pacientes: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isError,
    error,
  };
};
