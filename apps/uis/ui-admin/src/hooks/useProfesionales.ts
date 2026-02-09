import { useQuery } from "@tanstack/react-query";
import { fetchProfesionales } from "../queries/profesionales";

export const useProfesionales = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profesionales"],
    queryFn: fetchProfesionales,
  });

  return {
    profesionales: data,
    isLoading,
    isError,
    error,
  };
};
