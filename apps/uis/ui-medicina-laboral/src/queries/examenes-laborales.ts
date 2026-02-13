import { api } from "@/lib/axios";

export interface PracticaAttach {
  Id: number;
  FileName: string | null;
  Extension: string | null;
  Descripcion: string | null;
}

export interface Practica {
  Id: number;
  Id_Codigo_Valorizacion: number | null;
  Descripcion: string | null;
  Fecha_Practica: string | null;
  Status: string | null;
  Semaforo: string | null;
  Autorizacion: string | null;
  Practicas_Attachs: PracticaAttach[];
}

export interface ExamenLaboral {
  Id: number;
  Id_Examen_Laboral: number | null;
  Id_Paciente: number | null;
  Fecha_Alta: string | null;
  Status: string | null;
  Examenes_Laborales: {
    Id: number;
    Status: string | null;
    Fecha_Alta: string | null;
    Prestatarias: {
      Nombre: string | null;
    } | null;
    Examenes: {
      Titulo: string | null;
      Examen: string | null;
      Codigo: string | null;
    } | null;
  } | null;
  Practicas: Practica[];
  Paciente?: {
    Id: number;
    Nombre: string | null;
    Apellido: string | null;
    NroDocumento: string | null;
  } | null;
}

export const fetchExamenesLaborales = async (
  pacienteId?: number,
): Promise<ExamenLaboral[]> => {
  const params = new URLSearchParams();
  if (pacienteId) params.append("pacienteId", pacienteId.toString());

  const query = params.toString();
  const url = `/medicina-laboral/examenes-laborales${query ? `?${query}` : ""}`;

  const { data } = await api.get<ExamenLaboral[]>(url);
  return data;
};
