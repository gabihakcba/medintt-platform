import { useMutation, useQuery } from "@tanstack/react-query";
import {
  verifyUser,
  getData,
  saveFirma,
  VerifyFirmaResponse,
  GetFirmaResponse,
} from "../queries/firma";

// Hook for verifying user identity for firma
export const useVerifyFirma = () => {
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

// Hook for getting firma data
export const useFirmaData = (proof?: string) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["firma", proof],
    queryFn: () => getData(proof!),
    enabled: !!proof,
  });

  return {
    firmaData: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// Hook for saving firma
export const useSaveFirma = () => {
  return useMutation({
    mutationFn: ({ proof, firma }: { proof: string; firma: string }) =>
      saveFirma(proof, firma),
  });
};
