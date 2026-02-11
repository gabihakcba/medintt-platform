import { useQuery } from "@tanstack/react-query";
import { fetchPrestatarias } from "../queries/prestatarias";

export const usePrestatarias = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["prestatarias"],
    queryFn: fetchPrestatarias,
  });

  return {
    prestatarias: data,
    isLoading,
    isError,
    error,
  };
};
