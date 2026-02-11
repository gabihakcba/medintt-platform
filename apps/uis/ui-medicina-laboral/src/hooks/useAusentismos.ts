import { useQuery } from "@tanstack/react-query";
import { fetchAusentismos, AusentismosFilters } from "../queries/ausentismos";

export const useAusentismos = (filters?: AusentismosFilters) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["ausentismos", filters],
    queryFn: () => fetchAusentismos(filters),
  });

  return {
    ausentismos: data,
    isLoading,
    isError,
    error,
  };
};
