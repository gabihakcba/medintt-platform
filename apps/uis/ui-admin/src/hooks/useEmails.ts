import { useQuery } from "@tanstack/react-query";
import {
  fetchEmpresasEmails,
  fetchArtEmails,
  fetchPacientesEmails,
  PacienteFilters,
} from "../queries/emails";

export const useEmpresasEmails = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["emails", "empresas"],
    queryFn: fetchEmpresasEmails,
  });

  return {
    empresas: data,
    isLoading,
    isError,
    error,
  };
};

export const useArtEmails = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["emails", "art"],
    queryFn: fetchArtEmails,
  });

  return {
    art: data,
    isLoading,
    isError,
    error,
  };
};

export const usePacientesEmails = (filters?: PacienteFilters) => {
  // If fetchPacientesEmails is called without filters, it fetches all patients.
  // We can include filters in the queryKey to cache filtered results separately.
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["emails", "pacientes", filters],
    queryFn: () => fetchPacientesEmails(filters),
    // If you want to disable automatic fetching when filters are partial, you can use `enabled`.
    // But per requirements, it seems we might want all if no filters, or specific if filters exist.
  });

  return {
    pacientes: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
