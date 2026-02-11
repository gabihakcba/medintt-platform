import { useQuery } from "@tanstack/react-query";
import { fetchPacientes } from "../queries/pacientes";

export const usePacientes = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["pacientes"],
    queryFn: fetchPacientes,
  });

  return {
    pacientes: data,
    isLoading,
    isError,
    error,
  };
};
