import { api } from "@/lib/axios";

export interface DeclaracionJurada {
  Id?: number;
  Id_empresa?: number | null;
  Id_Paciente?: number | null;
  Id_Practica?: number | null;
  Fecha?: Date | null;
  Genero?: string | null;
  Status?: string | null;
  // Health conditions
  Mareos_Desmayos?: number | null;
  Mareos_Desmayos_Aclaraciones?: string | null;
  Analisis_HIV?: number | null;
  Analisis_HIV_Aclaraciones?: string | null;
  Convulsiones?: number | null;
  Convulsiones_Aclaraciones?: string | null;
  Asma_Tos_Cronica?: number | null;
  Asma_Tos_Cronica_Aclaraciones?: string | null;
  Epilepsia?: number | null;
  Epilepsia_Aclaraciones?: string | null;
  Neumonia?: number | null;
  Neumonia_Aclaraciones?: string | null;
  Depresion?: number | null;
  Depresion_Aclaraciones?: string | null;
  Sangre_al_Escupir?: number | null;
  Sangre_al_Escupir_Aclaraciones?: string | null;
  Enfermedad_Neurologica?: number | null;
  Enfermedad_Neurologica_Aclaraciones?: string | null;
  Celiaquia?: number | null;
  Celiaquia_Aclaraciones?: string | null;
  Diabetes?: number | null;
  Diabetes_Aclaraciones?: string | null;
  Hernias?: number | null;
  Hernias_Aclaraciones?: string | null;
  Dolor_Frecuente_de_Cabeza?: number | null;
  Dolor_Frecuente_de_Cabeza_Aclaraciones?: string | null;
  Tratamiento_Psiquiatrico?: number | null;
  Tratamiento_Psiquiatrico_Aclaraciones?: string | null;
  Toma_Medicacion?: number | null;
  Toma_Medicacion_Aclaraciones?: string | null;
  Fracturas?: number | null;
  Fracturas_Aclaraciones?: string | null;
  Hipertension_Arterial?: number | null;
  Hipertension_Arterial_Aclaraciones?: string | null;
  Lumbalgia?: number | null;
  Lumbalgia_Aclaraciones?: string | null;
  Cardiopatias?: number | null;
  Cardiopatias_Aclaraciones?: string | null;
  Problema_Renal_Urinario?: number | null;
  Problema_Renal_Urinario_Aclaraciones?: string | null;
  Varices?: number | null;
  Varices_Aclaraciones?: string | null;
  Amputaciones?: number | null;
  Amputaciones_Aclaraciones?: string | null;
  Chagas?: number | null;
  Chagas_Aclaraciones?: string | null;
  Limitaciones_Funcionales?: number | null;
  Limitaciones_Funcionales_Aclaraciones?: string | null;
  Dentadura_Sana?: number | null;
  Dentadura_Sana_Aclaraciones?: string | null;
  Traumatismos_Lesiones?: number | null;
  Traumatismos_Lesiones_Aclaraciones?: string | null;
  Alergias?: number | null;
  Alergias_Aclaraciones?: string | null;
  Enfermedades_Oculares?: number | null;
  Enfermedades_Oculares_Aclaraciones?: string | null;
  Tumor_Cancer?: number | null;
  Tumor_Cancer_Aclaraciones?: string | null;
  Uso_de_Lentes?: number | null;
  Uso_de_Lentes_Aclaraciones?: string | null;
  Hepatitis?: number | null;
  Hepatitis_Aclaraciones?: string | null;
  Ulcera_Gastrica_Nauseas_Vomitos?: number | null;
  Ulcera_Gastrica_Nauseas_Vomitos_Aclaraciones?: string | null;
  Disminucion_Auditiva?: number | null;
  Disminucion_Auditiva_Aclaraciones?: string | null;
  Cirugias?: number | null;
  Cirugias_Aclaraciones?: string | null;
  Tratamiento_Tiroides?: number | null;
  Tratamiento_Tiroides_Aclaraciones?: string | null;
  Internaciones?: number | null;
  Internaciones_Aclaraciones?: string | null;
  Enfermedades_de_la_Piel?: number | null;
  Enfermedades_de_la_Piel_Aclaraciones?: string | null;
  Vacunas_COVID?: number | null;
  Vacunas_COVID_Aclaraciones?: string | null;
  // Lifestyle
  Fuma?: number | null;
  Cantidad_Cigarros_diarios?: string | null;
  Consume_Marihuana?: number | null;
  Consume_Marihuana_Aclaraciones?: string | null;
  Consume_Cocaina?: number | null;
  Consume_Cocaina_Aclaraciones?: string | null;
  Consume_Alcohol?: number | null;
  Frecuencia?: string | null;
  Practica_Deportes?: number | null;
  Cuales_Deportes?: string | null;
  Mano_Habil?: string | null;
  Ultima_Tarea_Trabajo_Puesto?: string | null;
  Recibio_Indeminizacion_o_tiene_pendiente?: number | null;
  Recibio_Indeminizacion_o_tiene_pendiente_Aclaraciones?: string | null;
  // Women's health
  Tuvo_Algun_Embarazo?: number | null;
  Cuantos_Embarazos?: string | null;
  Abortos_Espontaneos?: number | null;
  Abortos_Espontaneos_Cuantos?: string | null;
  Fecha_Ultima_Menstruacion?: Date | null;
  Tratamientos_Hormonales?: number | null;
  Tratamientos_Hormonales_Aclaraciones?: string | null;
}

export interface EmpresaResponse {
  Nombre: string | null;
  Direccion: string | null;
}

export interface PacienteResponse {
  Nombre: string;
  Apellido: string;
  NroDocumento: string;
  FechaNacimiento: Date;
  Direccion: string;
  Genero: string;
  Barrio?: string;
  Id_Localidad?: number;
  Telefono?: string;
  Celular1?: string;
  Email?: string;
  firma?: string | null;
  firmaUrl?: string;
  Nacionalidad?: string;
  CUIL?: string;
  Cargo?: string;
  Puesto?: string;
  Funcion?: string;
}

export interface GetDeclaracionResponse {
  declaracion: DeclaracionJurada;
  paciente: PacienteResponse;
  empresa: EmpresaResponse | null;
}

export interface VerifyResponseDto {
  proof: string;
  proofExpiresAt: number;
  ddjj: GetDeclaracionResponse;
}

export const verifyUser = async (
  inviteToken: string,
  dni: string,
  fechaNacimiento?: string,
): Promise<VerifyResponseDto> => {
  const { data } = await api.post<VerifyResponseDto>(
    "/medicina-laboral/declaracion-jurada/verify",
    {
      inviteToken,
      dni,
      fechaNacimiento,
    },
  );
  return data;
};

export const verifyPersonalData = async (
  inviteToken: string,
  dni: string,
  fechaNacimiento?: string,
): Promise<VerifyResponseDto> => {
  const { data } = await api.post<VerifyResponseDto>(
    "/medicina-laboral/declaracion-jurada/datos-personales/verify",
    {
      inviteToken,
      dni,
      fechaNacimiento,
    },
  );
  return data;
};

export const getData = async (
  proof: string,
): Promise<GetDeclaracionResponse> => {
  const { data } = await api.post<GetDeclaracionResponse>(
    "/medicina-laboral/declaracion-jurada/get",
    {
      proof,
    },
  );
  return data;
};

export const updateData = async (
  proof: string,
  declaracionData: Omit<
    DeclaracionJurada,
    "Id" | "Id_empresa" | "Id_Paciente" | "Id_Practica"
  >,
): Promise<DeclaracionJurada> => {
  const { data } = await api.put<DeclaracionJurada>(
    "/medicina-laboral/declaracion-jurada",
    {
      proof,
      data: declaracionData,
    },
  );
  return data;
};
