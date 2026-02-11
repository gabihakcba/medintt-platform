import { api } from "@/lib/axios";

export interface VerifyFirmaResponse {
  proof: string;
  proofExpiresAt: number;
  firma: boolean;
}

export interface GetFirmaResponse {
  firma: string;
}

export const verifyUser = async (
  inviteToken: string,
  dni: string,
  fechaNacimiento?: string,
): Promise<VerifyFirmaResponse> => {
  const { data } = await api.post<VerifyFirmaResponse>(
    "/medicina-laboral/firma-paciente/verify",
    {
      inviteToken,
      dni,
      fechaNacimiento,
    },
  );
  return data;
};

export const getData = async (proof: string): Promise<GetFirmaResponse> => {
  const { data } = await api.post<GetFirmaResponse>(
    "/medicina-laboral/firma-paciente/get",
    {
      proof,
    },
  );
  return data;
};

export const saveFirma = async (
  proof: string,
  firma: string,
): Promise<void> => {
  await api.put("/medicina-laboral/firma-paciente", {
    proof,
    firma,
  });
};
