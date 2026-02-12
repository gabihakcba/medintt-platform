import { useQuery } from "@tanstack/react-query";
import {
  fetchAusentismos,
  fetchAusentismoById,
  AusentismosFilters,
} from "../queries/ausentismos";

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

export const useAusentismo = (id: number) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["ausentismo", id],
    queryFn: () => fetchAusentismoById(id),
    enabled: !!id && !isNaN(id),
  });

  return {
    ausentismo: data,
    isLoading,
    isError,
    error,
  };
};
