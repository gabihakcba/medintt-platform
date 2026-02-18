import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  fetchAusentismos,
  fetchAusentismoById,
  fetchPrestatarias,
  AusentismosFilters,
} from "../queries/ausentismos";

export const useAusentismos = (filters?: AusentismosFilters) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["ausentismos", filters],
    queryFn: () => fetchAusentismos(filters),
    placeholderData: keepPreviousData,
  });

  return {
    ausentismos: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isError,
    error,
  };
};

export const usePrestatarias = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["prestatarias"],
    queryFn: fetchPrestatarias,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return {
    prestatarias: data,
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
