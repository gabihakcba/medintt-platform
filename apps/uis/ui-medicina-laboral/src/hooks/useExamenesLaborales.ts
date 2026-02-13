import { useQuery } from "@tanstack/react-query";
import {
  fetchExamenesLaborales,
  ExamenLaboral,
} from "../queries/examenes-laborales";

export const useExamenesLaborales = (pacienteId?: number) => {
  return useQuery({
    queryKey: ["examenes-laborales", pacienteId],
    queryFn: () => fetchExamenesLaborales(pacienteId),
  });
};
