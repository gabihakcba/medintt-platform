import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchPacientes,
  PacientesFilters,
  updatePaciente,
  updatePacienteSignature,
  Paciente,
} from "../queries/pacientes";

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

export const useUpdatePaciente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Paciente> }) =>
      updatePaciente(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pacientes"] });
    },
  });
};

export const useUpdatePacienteSignature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { firma: string } }) =>
      updatePacienteSignature(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pacientes"] });
    },
  });
};

export const useSendSignatureInvite = () => {
  return useMutation({
    mutationFn: (pacienteId: number) =>
      import("../queries/pacientes").then((m) =>
        m.sendSignatureInvite(pacienteId),
      ),
  });
};
