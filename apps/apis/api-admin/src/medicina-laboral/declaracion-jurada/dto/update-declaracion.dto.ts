import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateDeclaracionDto {
  @IsOptional()
  @IsNumber()
  Fuma?: number;

  @IsOptional()
  @IsNumber()
  Cantidad_Cigarros_diarios?: number;

  @IsOptional()
  @IsNumber()
  Consume_Alcohol?: number;

  @IsOptional()
  @IsString()
  Frecuencia?: string;

  @IsOptional()
  @IsNumber()
  Practica_Deportes?: number;

  @IsOptional()
  @IsString()
  Cuales_Deportes?: string;

  @IsOptional()
  @IsString()
  Mano_Habil?: string;

  @IsOptional()
  @IsString()
  Ultima_Tarea_Trabajo_Puesto?: string;

  @IsOptional()
  @IsNumber()
  Recibio_Indeminizacion_o_tiene_pendiente?: number;

  @IsOptional()
  @IsString()
  Recibio_Indeminizacion_o_tiene_pendiente_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Mareos_Desmayos?: number;

  @IsOptional()
  @IsString()
  Mareos_Desmayos_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Convulsiones?: number;

  @IsOptional()
  @IsString()
  Convulsiones_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Epilepsia?: number;

  @IsOptional()
  @IsString()
  Epilepsia_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Depresion?: number;

  @IsOptional()
  @IsString()
  Depresion_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Enfermedad_Neurologica?: number;

  @IsOptional()
  @IsString()
  Enfermedad_Neurologica_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Diabetes?: number;

  @IsOptional()
  @IsString()
  Diabetes_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Dolor_Frecuente_de_Cabeza?: number;

  @IsOptional()
  @IsString()
  Dolor_Frecuente_de_Cabeza_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Toma_Medicacion?: number;

  @IsOptional()
  @IsString()
  Toma_Medicacion_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Hipertension_Arterial?: number;

  @IsOptional()
  @IsString()
  Hipertension_Arterial_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Cardiopatias?: number;

  @IsOptional()
  @IsString()
  Cardiopatias_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Varices?: number;

  @IsOptional()
  @IsString()
  Varices_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Chagas?: number;

  @IsOptional()
  @IsString()
  Chagas_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Dentadura_Sana?: number;

  @IsOptional()
  @IsString()
  Dentadura_Sana_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Alergias?: number;

  @IsOptional()
  @IsString()
  Alergias_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Tumor_Cancer?: number;

  @IsOptional()
  @IsString()
  Tumor_Cancer_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Hepatitis?: number;

  @IsOptional()
  @IsString()
  Hepatitis_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Disminucion_Auditiva?: number;

  @IsOptional()
  @IsString()
  Disminucion_Auditiva_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Tratamiento_Tiroides?: number;

  @IsOptional()
  @IsString()
  Tratamiento_Tiroides_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Enfermedades_de_la_Piel?: number;

  @IsOptional()
  @IsString()
  Enfermedades_de_la_Piel_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Analisis_HIV?: number;

  @IsOptional()
  @IsString()
  Analisis_HIV_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Asma_Tos_Cronica?: number;

  @IsOptional()
  @IsString()
  Asma_Tos_Cronica_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Neumonia?: number;

  @IsOptional()
  @IsString()
  Neumonia_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Sangre_al_Escupir?: number;

  @IsOptional()
  @IsString()
  Sangre_al_Escupir_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Celiaquia?: number;

  @IsOptional()
  @IsString()
  Celiaquia_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Hernias?: number;

  @IsOptional()
  @IsString()
  Hernias_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Tratamiento_Psiquiatrico?: number;

  @IsOptional()
  @IsString()
  Tratamiento_Psiquiatrico_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Fracturas?: number;

  @IsOptional()
  @IsString()
  Fracturas_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Lumbalgia?: number;

  @IsOptional()
  @IsString()
  Lumbalgia_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Problema_Renal_Urinario?: number;

  @IsOptional()
  @IsString()
  Problema_Renal_Urinario_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Amputaciones?: number;

  @IsOptional()
  @IsString()
  Amputaciones_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Limitaciones_Funcionales?: number;

  @IsOptional()
  @IsString()
  Limitaciones_Funcionales_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Traumatismos_Lesiones?: number;

  @IsOptional()
  @IsString()
  Traumatismos_Lesiones_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Enfermedades_Oculares?: number;

  @IsOptional()
  @IsString()
  Enfermedades_Oculares_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Uso_de_Lentes?: number;

  @IsOptional()
  @IsString()
  Uso_de_Lentes_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Ulcera_Gastrica_Nauseas_Vomitos?: number;

  @IsOptional()
  @IsString()
  Ulcera_Gastrica_Nauseas_Vomitos_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Cirugias?: number;

  @IsOptional()
  @IsString()
  Cirugias_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Internaciones?: number;

  @IsOptional()
  @IsString()
  Internaciones_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Vacunas_COVID?: number;

  @IsOptional()
  @IsString()
  Vacunas_COVID_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Tuvo_Algun_Embarazo?: number;

  @IsOptional()
  @IsString()
  Cuantos_Embarazos?: string;

  @IsOptional()
  Fecha_Ultima_Menstruacion?: Date;

  @IsOptional()
  @IsNumber()
  Abortos_Espontaneos?: number;

  @IsOptional()
  @IsNumber()
  Abortos_Espontaneos_Cuantos?: number;

  @IsOptional()
  @IsNumber()
  Tratamientos_Hormonales?: number;

  @IsOptional()
  @IsString()
  Tratamientos_Hormonales_Aclaraciones?: string;

  @IsOptional()
  @IsString()
  Consume_Marihuana_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Consume_Cocaina?: number;

  @IsOptional()
  @IsString()
  Consume_Cocaina_Aclaraciones?: string;

  @IsOptional()
  @IsNumber()
  Consume_Marihuana?: number;
}
