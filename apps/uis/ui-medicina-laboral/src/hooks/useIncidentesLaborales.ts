import { useQuery } from "@tanstack/react-query";
import { api as axios } from "@/lib/axios";

export interface IncidenteLaboral {
  Id: number;
  Fecha: string;
  Clase: string;
  Paciente: string;
  DNI: string;
  Profesional: string;
  Notas: string;
  Id_Prestataria: number | null;
  Prestataria?: {
    Id: number;
    Nombre: string;
    // Add other fields if necessary
  } | null;
}

const fetchIncidentesLaborales = async (): Promise<IncidenteLaboral[]> => {
  const { data } = await axios.get("/medicina-laboral/incidentes-laborales");
  return data;
};

export const useIncidentesLaborales = () => {
  return useQuery({
    queryKey: ["incidentes-laborales"],
    queryFn: fetchIncidentesLaborales,
  });
};
