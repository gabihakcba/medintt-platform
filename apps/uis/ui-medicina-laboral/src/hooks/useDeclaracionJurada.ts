import { useMutation, useQuery } from "@tanstack/react-query";
import {
  verifyUser,
  getData,
  updateData,
  VerifyResponseDto,
  GetDeclaracionResponse,
  DeclaracionJurada,
} from "../queries/declaracion-jurada";

// Hook for verifying user identity
export const useVerifyDeclaracionJurada = () => {
  return useMutation({
    mutationFn: ({
      inviteToken,
      dni,
      fechaNacimiento,
    }: {
      inviteToken: string;
      dni: string;
      fechaNacimiento?: string;
    }) => verifyUser(inviteToken, dni, fechaNacimiento),
  });
};

// Hook for getting declaracion jurada data
export const useDeclaracionJuradaData = (proof?: string) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["declaracion-jurada", proof],
    queryFn: () => getData(proof!),
    enabled: !!proof,
  });

  return {
    declaracionData: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// Hook for updating declaracion jurada
export const useUpdateDeclaracionJurada = () => {
  return useMutation({
    mutationFn: ({
      proof,
      data,
    }: {
      proof: string;
      data: Omit<
        DeclaracionJurada,
        "Id" | "Id_empresa" | "Id_Paciente" | "Id_Practica"
      >;
    }) => updateData(proof, data),
  });
};
