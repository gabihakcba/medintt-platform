
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.0.0
 * Query Engine version: 5dbef10bdbfb579e07d35cc85fb1518d357cb99e
 */
Prisma.prismaVersion = {
  client: "6.0.0",
  engine: "5dbef10bdbfb579e07d35cc85fb1518d357cb99e"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable',
  Snapshot: 'Snapshot'
});

exports.Prisma.AbonosScalarFieldEnum = {
  Id: 'Id',
  Id_Prestataria: 'Id_Prestataria',
  FechaAlta: 'FechaAlta',
  Fecha_Inicio_Abono: 'Fecha_Inicio_Abono',
  ImporteConceptoMensual: 'ImporteConceptoMensual',
  ConceptoMensual: 'ConceptoMensual',
  CantidadMeses: 'CantidadMeses',
  Activo: 'Activo'
};

exports.Prisma.AbonosxMesesScalarFieldEnum = {
  Id: 'Id',
  Id_Abono: 'Id_Abono',
  Fecha: 'Fecha',
  IndiceInflacion: 'IndiceInflacion',
  Id_Factura: 'Id_Factura',
  Total_Mensual: 'Total_Mensual'
};

exports.Prisma.AbonosxMeses_ConceptosScalarFieldEnum = {
  Id: 'Id',
  Id_AbonoxMes: 'Id_AbonoxMes',
  Concepto: 'Concepto',
  Importe: 'Importe'
};

exports.Prisma.Afiliacion_PacientesScalarFieldEnum = {
  Id: 'Id',
  Id_Paciente: 'Id_Paciente',
  Numero_Afiliado: 'Numero_Afiliado',
  Id_PlanObraSocial: 'Id_PlanObraSocial',
  Id_Prestataria: 'Id_Prestataria',
  TipoAfiliado: 'TipoAfiliado'
};

exports.Prisma.AusentismosScalarFieldEnum = {
  Id: 'Id',
  Id_Prestataria: 'Id_Prestataria',
  Id_Paciente: 'Id_Paciente',
  Id_Categoria: 'Id_Categoria',
  Id_Usuario: 'Id_Usuario',
  Fecha_Notificacion: 'Fecha_Notificacion',
  Fecha_Desde: 'Fecha_Desde',
  Fecha_Hasta: 'Fecha_Hasta',
  Fecha_Reincoporacion: 'Fecha_Reincoporacion',
  Activo: 'Activo',
  Status: 'Status',
  Diagnostico: 'Diagnostico',
  Evolucion: 'Evolucion'
};

exports.Prisma.Ausentismos_AttachsScalarFieldEnum = {
  Id: 'Id',
  Id_Ausentismo: 'Id_Ausentismo',
  Descripcion: 'Descripcion',
  Observaciones: 'Observaciones',
  FileName: 'FileName',
  FileSize: 'FileSize',
  Extension: 'Extension',
  Archivo: 'Archivo'
};

exports.Prisma.Ausentismos_BitacoraScalarFieldEnum = {
  Id: 'Id',
  Id_Ausentismo: 'Id_Ausentismo',
  Id_Usuario: 'Id_Usuario',
  Observaciones: 'Observaciones',
  Fecha: 'Fecha',
  Status: 'Status'
};

exports.Prisma.Ausentismos_CategoriasScalarFieldEnum = {
  Id: 'Id',
  Categoria: 'Categoria',
  Pendiente: 'Pendiente',
  EnCurso: 'EnCurso',
  Terminado: 'Terminado'
};

exports.Prisma.Ausentismos_CertificadosScalarFieldEnum = {
  Id: 'Id',
  Id_Ausentismo: 'Id_Ausentismo',
  FileName: 'FileName',
  FileSize: 'FileSize',
  Extension: 'Extension',
  Archivo: 'Archivo',
  Medico: 'Medico',
  MP: 'MP',
  Email: 'Email',
  Celular: 'Celular',
  Diagnostico: 'Diagnostico',
  Observaciones: 'Observaciones',
  Notas_Medintt: 'Notas_Medintt',
  Fecha_Atencion_Medica: 'Fecha_Atencion_Medica',
  Dias_de_Reposo: 'Dias_de_Reposo'
};

exports.Prisma.Ausentismos_ControlesScalarFieldEnum = {
  Id: 'Id',
  Id_Ausentismo: 'Id_Ausentismo',
  Id_Tipo_Control: 'Id_Tipo_Control',
  Fecha_Programada: 'Fecha_Programada',
  Status: 'Status',
  Id_Usuario_Control: 'Id_Usuario_Control',
  Instrucciones: 'Instrucciones',
  Evolucion: 'Evolucion',
  Fecha_Control: 'Fecha_Control'
};

exports.Prisma.Ausentismos_InformesScalarFieldEnum = {
  Id: 'Id',
  Id_Ausentismo: 'Id_Ausentismo',
  Id_Usuario: 'Id_Usuario',
  Fecha: 'Fecha',
  Informe: 'Informe',
  Incluir_Bitacora: 'Incluir_Bitacora',
  Incluir_Certificados: 'Incluir_Certificados',
  Incluir_Adjuntos: 'Incluir_Adjuntos',
  Incluir_Controles: 'Incluir_Controles',
  Status: 'Status'
};

exports.Prisma.Ausentismos_Tipos_ControlesScalarFieldEnum = {
  Id: 'Id',
  Tipo: 'Tipo',
  Tiene_que_ser_Medico: 'Tiene_que_ser_Medico'
};

exports.Prisma.Ayudantes_HonorariosScalarFieldEnum = {
  Id: 'Id',
  Id_Cirugia_Honorarios: 'Id_Cirugia_Honorarios',
  Id_Profesional_Ayudante: 'Id_Profesional_Ayudante',
  Total: 'Total',
  Pagado: 'Pagado',
  Saldo: 'Saldo',
  Status: 'Status'
};

exports.Prisma.BancosScalarFieldEnum = {
  Id: 'Id',
  Banco: 'Banco'
};

exports.Prisma.Beneficiarios_Pagos_BancariosScalarFieldEnum = {
  Id: 'Id',
  Beneficiario: 'Beneficiario',
  Email: 'Email',
  Celular: 'Celular',
  Activo: 'Activo'
};

exports.Prisma.Categorias_Pagos_BancariosScalarFieldEnum = {
  Id: 'Id',
  Categoria: 'Categoria'
};

exports.Prisma.Cirugia_AttachsScalarFieldEnum = {
  Id: 'Id',
  Id_Cirugia: 'Id_Cirugia',
  Descripcion: 'Descripcion',
  Observaciones: 'Observaciones',
  FileName: 'FileName',
  FileSize: 'FileSize',
  Extension: 'Extension',
  Archivo: 'Archivo'
};

exports.Prisma.Cirugia_Equipo_ProfesionalScalarFieldEnum = {
  Id: 'Id',
  Nombre: 'Nombre',
  Celular: 'Celular',
  Telefono: 'Telefono',
  Email: 'Email',
  Id_Rol: 'Id_Rol'
};

exports.Prisma.Cirugia_EquipoHumanoScalarFieldEnum = {
  Id: 'Id',
  Id_Cirugia: 'Id_Cirugia',
  Id_Cirugia_Equipo_Profesional: 'Id_Cirugia_Equipo_Profesional',
  Avisado: 'Avisado',
  Confirmado: 'Confirmado'
};

exports.Prisma.Cirugia_MaterialesScalarFieldEnum = {
  Id: 'Id',
  Id_Cirugia: 'Id_Cirugia',
  Id_Material: 'Id_Material',
  Id_Proveedor: 'Id_Proveedor',
  Cantidad: 'Cantidad',
  Notas: 'Notas'
};

exports.Prisma.Cirugia_RolesScalarFieldEnum = {
  Id: 'Id',
  Rol: 'Rol'
};

exports.Prisma.CirugiasScalarFieldEnum = {
  Id: 'Id',
  Id_Paciente: 'Id_Paciente',
  Id_Profesional: 'Id_Profesional',
  Complejidad: 'Complejidad',
  Id_AfiliacionPaciente: 'Id_AfiliacionPaciente',
  Id_Proveedor_Quirofano: 'Id_Proveedor_Quirofano',
  FechaEstimada: 'FechaEstimada',
  Hora: 'Hora',
  Requiere_Material: 'Requiere_Material',
  Status: 'Status',
  Cirugia_a_Realizar: 'Cirugia_a_Realizar',
  Dignostico: 'Dignostico',
  Resumen_HC: 'Resumen_HC',
  Total: 'Total',
  Cobrado: 'Cobrado',
  Saldo: 'Saldo',
  Status_SolicitudQuirofano: 'Status_SolicitudQuirofano',
  Status_PedidoQuiurgico: 'Status_PedidoQuiurgico',
  Status_Autorizacion: 'Status_Autorizacion',
  Status_ProtocoloQuirurgico: 'Status_ProtocoloQuirurgico',
  Status_Honorarios: 'Status_Honorarios',
  Status_Gastos: 'Status_Gastos',
  Status_Materiales: 'Status_Materiales',
  Status_Turno_Pre_Quirurgico: 'Status_Turno_Pre_Quirurgico',
  Id_HC_From: 'Id_HC_From',
  Codigos: 'Codigos',
  Duracion: 'Duracion',
  Autorizacion_ObraSocial: 'Autorizacion_ObraSocial'
};

exports.Prisma.Cirugias_GastosScalarFieldEnum = {
  Id: 'Id',
  Id_Cirugia: 'Id_Cirugia',
  Id_Gasto: 'Id_Gasto',
  Total: 'Total'
};

exports.Prisma.Cirugias_HonorariosScalarFieldEnum = {
  Id: 'Id',
  Id_Cirugia: 'Id_Cirugia',
  Codigo: 'Codigo',
  Descripcion: 'Descripcion',
  Complejidad: 'Complejidad',
  UQ: 'UQ',
  NumAyudantes: 'NumAyudantes',
  TotalEspecialista: 'TotalEspecialista',
  TotalAyudantes: 'TotalAyudantes',
  TotalHonorarios: 'TotalHonorarios',
  Pagado_Especialista: 'Pagado_Especialista',
  Saldo_Especialista: 'Saldo_Especialista'
};

exports.Prisma.CM_EnviosScalarFieldEnum = {
  Id: 'Id',
  Id_Profesional: 'Id_Profesional',
  Id_Emisor: 'Id_Emisor',
  Id_Prestataria: 'Id_Prestataria',
  Id_Firmante: 'Id_Firmante',
  Fecha: 'Fecha',
  Total: 'Total',
  Cobrado: 'Cobrado',
  Saldo: 'Saldo',
  Status: 'Status',
  Clase: 'Clase'
};

exports.Prisma.CM_Envios_DetallesScalarFieldEnum = {
  Id: 'Id',
  Id_CM_Envios: 'Id_CM_Envios',
  Id_Historia_Clinica: 'Id_Historia_Clinica',
  Id_Cirugia: 'Id_Cirugia',
  Id_Practica: 'Id_Practica',
  Codigo: 'Codigo',
  Descripcion: 'Descripcion',
  Cantidad: 'Cantidad',
  ValorUnitario: 'ValorUnitario',
  Total: 'Total',
  Codigo_Autorizacion: 'Codigo_Autorizacion'
};

exports.Prisma.CobrosScalarFieldEnum = {
  Id: 'Id',
  Id_Factura: 'Id_Factura',
  Importe: 'Importe',
  Fecha: 'Fecha',
  Id_FormaDePago: 'Id_FormaDePago',
  Status: 'Status',
  Notas: 'Notas'
};

exports.Prisma.Cobros_CMScalarFieldEnum = {
  Id: 'Id',
  Id_CM_Envios: 'Id_CM_Envios',
  Importe: 'Importe',
  Fecha: 'Fecha',
  Id_FormaDePago: 'Id_FormaDePago',
  Status: 'Status',
  Notas: 'Notas'
};

exports.Prisma.Codigos_ValorizacionScalarFieldEnum = {
  Id: 'Id',
  Codigo: 'Codigo',
  Descripcion: 'Descripcion',
  Valor_Particular: 'Valor_Particular',
  Tipo: 'Tipo',
  Es_Practica: 'Es_Practica',
  InformeVerde: 'InformeVerde',
  InformeObligaAttach: 'InformeObligaAttach'
};

exports.Prisma.Conceptos_Pagos_BancariosScalarFieldEnum = {
  Id: 'Id',
  Concepto: 'Concepto'
};

exports.Prisma.Convenios_ProfesionalesScalarFieldEnum = {
  Id: 'Id',
  Id_Prestataria: 'Id_Prestataria',
  Id_Profesional: 'Id_Profesional'
};

exports.Prisma.Cuentas_BancariasScalarFieldEnum = {
  Id: 'Id',
  Id_Banco: 'Id_Banco',
  Cuenta: 'Cuenta',
  Activo: 'Activo'
};

exports.Prisma.Declaraciones_JuradasScalarFieldEnum = {
  Id: 'Id',
  Id_empresa: 'Id_empresa',
  Id_Paciente: 'Id_Paciente',
  Id_Practica: 'Id_Practica',
  Fecha: 'Fecha',
  Status: 'Status',
  Genero: 'Genero',
  Fuma: 'Fuma',
  Cantidad_Cigarros_diarios: 'Cantidad_Cigarros_diarios',
  Consume_Alcohol: 'Consume_Alcohol',
  Frecuencia: 'Frecuencia',
  Practica_Deportes: 'Practica_Deportes',
  Cuales_Deportes: 'Cuales_Deportes',
  Mano_Habil: 'Mano_Habil',
  Ultima_Tarea_Trabajo_Puesto: 'Ultima_Tarea_Trabajo_Puesto',
  Recibio_Indeminizacion_o_tiene_pendiente: 'Recibio_Indeminizacion_o_tiene_pendiente',
  Recibio_Indeminizacion_o_tiene_pendiente_Aclaraciones: 'Recibio_Indeminizacion_o_tiene_pendiente_Aclaraciones',
  Mareos_Desmayos: 'Mareos_Desmayos',
  Mareos_Desmayos_Aclaraciones: 'Mareos_Desmayos_Aclaraciones',
  Convulsiones: 'Convulsiones',
  Convulsiones_Aclaraciones: 'Convulsiones_Aclaraciones',
  Epilepsia: 'Epilepsia',
  Epilepsia_Aclaraciones: 'Epilepsia_Aclaraciones',
  Depresion: 'Depresion',
  Depresion_Aclaraciones: 'Depresion_Aclaraciones',
  Enfermedad_Neurologica: 'Enfermedad_Neurologica',
  Enfermedad_Neurologica_Aclaraciones: 'Enfermedad_Neurologica_Aclaraciones',
  Diabetes: 'Diabetes',
  Diabetes_Aclaraciones: 'Diabetes_Aclaraciones',
  Dolor_Frecuente_de_Cabeza: 'Dolor_Frecuente_de_Cabeza',
  Dolor_Frecuente_de_Cabeza_Aclaraciones: 'Dolor_Frecuente_de_Cabeza_Aclaraciones',
  Toma_Medicacion: 'Toma_Medicacion',
  Toma_Medicacion_Aclaraciones: 'Toma_Medicacion_Aclaraciones',
  Hipertension_Arterial: 'Hipertension_Arterial',
  Hipertension_Arterial_Aclaraciones: 'Hipertension_Arterial_Aclaraciones',
  Cardiopatias: 'Cardiopatias',
  Cardiopatias_Aclaraciones: 'Cardiopatias_Aclaraciones',
  Varices: 'Varices',
  Varices_Aclaraciones: 'Varices_Aclaraciones',
  Chagas: 'Chagas',
  Chagas_Aclaraciones: 'Chagas_Aclaraciones',
  Dentadura_Sana: 'Dentadura_Sana',
  Dentadura_Sana_Aclaraciones: 'Dentadura_Sana_Aclaraciones',
  Alergias: 'Alergias',
  Alergias_Aclaraciones: 'Alergias_Aclaraciones',
  Tumor_Cancer: 'Tumor_Cancer',
  Tumor_Cancer_Aclaraciones: 'Tumor_Cancer_Aclaraciones',
  Hepatitis: 'Hepatitis',
  Hepatitis_Aclaraciones: 'Hepatitis_Aclaraciones',
  Disminucion_Auditiva: 'Disminucion_Auditiva',
  Disminucion_Auditiva_Aclaraciones: 'Disminucion_Auditiva_Aclaraciones',
  Tratamiento_Tiroides: 'Tratamiento_Tiroides',
  Tratamiento_Tiroides_Aclaraciones: 'Tratamiento_Tiroides_Aclaraciones',
  Enfermedades_de_la_Piel: 'Enfermedades_de_la_Piel',
  Enfermedades_de_la_Piel_Aclaraciones: 'Enfermedades_de_la_Piel_Aclaraciones',
  Analisis_HIV: 'Analisis_HIV',
  Analisis_HIV_Aclaraciones: 'Analisis_HIV_Aclaraciones',
  Asma_Tos_Cronica: 'Asma_Tos_Cronica',
  Asma_Tos_Cronica_Aclaraciones: 'Asma_Tos_Cronica_Aclaraciones',
  Neumonia: 'Neumonia',
  Neumonia_Aclaraciones: 'Neumonia_Aclaraciones',
  Sangre_al_Escupir: 'Sangre_al_Escupir',
  Sangre_al_Escupir_Aclaraciones: 'Sangre_al_Escupir_Aclaraciones',
  Celiaquia: 'Celiaquia',
  Celiaquia_Aclaraciones: 'Celiaquia_Aclaraciones',
  Hernias: 'Hernias',
  Hernias_Aclaraciones: 'Hernias_Aclaraciones',
  Tratamiento_Psiquiatrico: 'Tratamiento_Psiquiatrico',
  Tratamiento_Psiquiatrico_Aclaraciones: 'Tratamiento_Psiquiatrico_Aclaraciones',
  Fracturas: 'Fracturas',
  Fracturas_Aclaraciones: 'Fracturas_Aclaraciones',
  Lumbalgia: 'Lumbalgia',
  Lumbalgia_Aclaraciones: 'Lumbalgia_Aclaraciones',
  Problema_Renal_Urinario: 'Problema_Renal_Urinario',
  Problema_Renal_Urinario_Aclaraciones: 'Problema_Renal_Urinario_Aclaraciones',
  Amputaciones: 'Amputaciones',
  Amputaciones_Aclaraciones: 'Amputaciones_Aclaraciones',
  Limitaciones_Funcionales: 'Limitaciones_Funcionales',
  Limitaciones_Funcionales_Aclaraciones: 'Limitaciones_Funcionales_Aclaraciones',
  Traumatismos_Lesiones: 'Traumatismos_Lesiones',
  Traumatismos_Lesiones_Aclaraciones: 'Traumatismos_Lesiones_Aclaraciones',
  Enfermedades_Oculares: 'Enfermedades_Oculares',
  Enfermedades_Oculares_Aclaraciones: 'Enfermedades_Oculares_Aclaraciones',
  Uso_de_Lentes: 'Uso_de_Lentes',
  Uso_de_Lentes_Aclaraciones: 'Uso_de_Lentes_Aclaraciones',
  Ulcera_Gastrica_Nauseas_Vomitos: 'Ulcera_Gastrica_Nauseas_Vomitos',
  Ulcera_Gastrica_Nauseas_Vomitos_Aclaraciones: 'Ulcera_Gastrica_Nauseas_Vomitos_Aclaraciones',
  Cirugias: 'Cirugias',
  Cirugias_Aclaraciones: 'Cirugias_Aclaraciones',
  Internaciones: 'Internaciones',
  Internaciones_Aclaraciones: 'Internaciones_Aclaraciones',
  Vacunas_COVID: 'Vacunas_COVID',
  Vacunas_COVID_Aclaraciones: 'Vacunas_COVID_Aclaraciones',
  Tuvo_Algun_Embarazo: 'Tuvo_Algun_Embarazo',
  Cuantos_Embarazos: 'Cuantos_Embarazos',
  Fecha_Ultima_Menstruacion: 'Fecha_Ultima_Menstruacion',
  Abortos_Espontaneos: 'Abortos_Espontaneos',
  Abortos_Espontaneos_Cuantos: 'Abortos_Espontaneos_Cuantos',
  Tratamientos_Hormonales: 'Tratamientos_Hormonales',
  Tratamientos_Hormonales_Aclaraciones: 'Tratamientos_Hormonales_Aclaraciones',
  Consume_Marihuana: 'Consume_Marihuana',
  Consume_Marihuana_Aclaraciones: 'Consume_Marihuana_Aclaraciones',
  Consume_Cocaina: 'Consume_Cocaina',
  Consume_Cocaina_Aclaraciones: 'Consume_Cocaina_Aclaraciones'
};

exports.Prisma.Dias_MuertosScalarFieldEnum = {
  Id: 'Id',
  Id_Profesional: 'Id_Profesional',
  Fecha: 'Fecha',
  Mensaje: 'Mensaje'
};

exports.Prisma.Emisores_FiscalesScalarFieldEnum = {
  Id: 'Id',
  Nombre: 'Nombre',
  Domicilio: 'Domicilio',
  Condicion_IVA: 'Condicion_IVA',
  CUIT: 'CUIT',
  IngresosBrutos: 'IngresosBrutos',
  FechaInicioActividades: 'FechaInicioActividades',
  PuntoDeVenta: 'PuntoDeVenta',
  api_afip_client_id: 'api_afip_client_id',
  api_afip_client_secret: 'api_afip_client_secret',
  certificate_secret: 'certificate_secret',
  certificate_token: 'certificate_token',
  Modo_Debug: 'Modo_Debug'
};

exports.Prisma.Evaluacion_FisicaScalarFieldEnum = {
  Id: 'Id',
  Id_Paciente: 'Id_Paciente',
  Fecha: 'Fecha',
  PresionArterialSistolica: 'PresionArterialSistolica',
  PresionArterialDiastolica: 'PresionArterialDiastolica',
  FrecuenciaCardiaca: 'FrecuenciaCardiaca',
  FrecuenciaRespiratoria: 'FrecuenciaRespiratoria',
  Temperatura: 'Temperatura',
  Peso: 'Peso',
  Talla: 'Talla',
  Sist_Cardiovascular: 'Sist_Cardiovascular',
  Sist_Respiratorio: 'Sist_Respiratorio',
  Sist_Nervioso: 'Sist_Nervioso',
  Sist_MusculoEsqueletico: 'Sist_MusculoEsqueletico',
  Sist_Abdomen: 'Sist_Abdomen',
  Sist_GenitoUrinario: 'Sist_GenitoUrinario',
  Fecha_Ultima_Menstruacion: 'Fecha_Ultima_Menstruacion',
  Status: 'Status',
  Semaforo: 'Semaforo',
  Notas: 'Notas',
  MovilidadOcular: 'MovilidadOcular',
  Cornea: 'Cornea',
  Conjuntivas: 'Conjuntivas',
  V1_OjoIzquierdo: 'V1_OjoIzquierdo',
  V2_OjoIzquierdo: 'V2_OjoIzquierdo',
  V1_OjoDerecho: 'V1_OjoDerecho',
  V2_OjoDerecho: 'V2_OjoDerecho',
  Resumen: 'Resumen'
};

exports.Prisma.ExamenesScalarFieldEnum = {
  Id: 'Id',
  Codigo: 'Codigo',
  Titulo: 'Titulo',
  SubTitulo: 'SubTitulo',
  Examen: 'Examen',
  Puesto: 'Puesto',
  Evaluacion_Fisica: 'Evaluacion_Fisica',
  Interrogatorio: 'Interrogatorio',
  ImporteFijoPorPaciente: 'ImporteFijoPorPaciente',
  Activo: 'Activo'
};

exports.Prisma.Examenes_Codigos_ValorizacionScalarFieldEnum = {
  Id: 'Id',
  Id_Examen: 'Id_Examen',
  Id_CodigoValorizacion: 'Id_CodigoValorizacion'
};

exports.Prisma.Examenes_LaboralesScalarFieldEnum = {
  Id: 'Id',
  Id_Examen: 'Id_Examen',
  Id_Prestataria: 'Id_Prestataria',
  Status: 'Status',
  Fecha_Alta: 'Fecha_Alta',
  ImportexExamen: 'ImportexExamen',
  Cantidad_Pacientes: 'Cantidad_Pacientes',
  Total: 'Total',
  Cobrado: 'Cobrado',
  Saldo: 'Saldo',
  Id_Factura: 'Id_Factura'
};

exports.Prisma.Examenes_Laborales_PacientesScalarFieldEnum = {
  Id: 'Id',
  Id_Examen_Laboral: 'Id_Examen_Laboral',
  Id_Paciente: 'Id_Paciente',
  Id_Profesional_Responsable: 'Id_Profesional_Responsable',
  Id_Profesional_Laboral: 'Id_Profesional_Laboral',
  Id_Interrogatorio: 'Id_Interrogatorio',
  Id_Evaluacion_Fisica: 'Id_Evaluacion_Fisica',
  Status_Interrogatorio_Evaluacion_Fisica: 'Status_Interrogatorio_Evaluacion_Fisica',
  Fecha_Turno_Profesional_Laboral: 'Fecha_Turno_Profesional_Laboral',
  Hora_Turno_Profesional_Laboral: 'Hora_Turno_Profesional_Laboral',
  Conclusion_Examen: 'Conclusion_Examen',
  Status: 'Status',
  NotasConclusion: 'NotasConclusion',
  Fecha_Conclusion: 'Fecha_Conclusion',
  Fecha_Alta: 'Fecha_Alta',
  Total: 'Total',
  Cobrado: 'Cobrado',
  Saldo: 'Saldo',
  NotasGenerales: 'NotasGenerales',
  Tipo: 'Tipo'
};

exports.Prisma.Examenes_Laborales_PacientesxPracticasScalarFieldEnum = {
  Id: 'Id',
  Id_Examen_Laboral_Paciente: 'Id_Examen_Laboral_Paciente',
  Id_Practica: 'Id_Practica',
  Total: 'Total',
  Cobrado: 'Cobrado',
  Saldo: 'Saldo'
};

exports.Prisma.Factura_DetallesScalarFieldEnum = {
  Id: 'Id',
  Id_Factura: 'Id_Factura',
  Id_Historia_Clinica: 'Id_Historia_Clinica',
  Id_Cirugia_Honorario: 'Id_Cirugia_Honorario',
  Id_Practica: 'Id_Practica',
  Id_Examen_Laboral: 'Id_Examen_Laboral',
  Codigo: 'Codigo',
  Descripcion: 'Descripcion',
  Cantidad: 'Cantidad',
  ValorUnitario: 'ValorUnitario',
  Porcentaje_Descuento: 'Porcentaje_Descuento',
  SubTotal: 'SubTotal',
  AlicuotaIVA: 'AlicuotaIVA',
  IVA: 'IVA',
  Total: 'Total'
};

exports.Prisma.FacturasScalarFieldEnum = {
  Id: 'Id',
  Id_Prestataria: 'Id_Prestataria',
  Id_Emisor: 'Id_Emisor',
  Fecha: 'Fecha',
  Tipo: 'Tipo',
  Serie: 'Serie',
  Numero: 'Numero',
  AlicuotaIVA: 'AlicuotaIVA',
  SubTotal: 'SubTotal',
  Descuento: 'Descuento',
  SubTotalFinal: 'SubTotalFinal',
  IVA: 'IVA',
  Total: 'Total',
  Cobrado: 'Cobrado',
  Saldo: 'Saldo',
  Status: 'Status',
  MotivoDescuento: 'MotivoDescuento',
  Retenciones: 'Retenciones',
  Clase: 'Clase',
  Comprobante_AFIP_Id: 'Comprobante_AFIP_Id',
  Numero_AFIP: 'Numero_AFIP',
  PuntoDeVenta: 'PuntoDeVenta',
  Codigo_Respuesta: 'Codigo_Respuesta',
  Mensaje_Respuesta: 'Mensaje_Respuesta',
  CAE: 'CAE',
  Vencimiento_CAE: 'Vencimiento_CAE',
  PDF_Base64: 'PDF_Base64'
};

exports.Prisma.Facturas_AttachsScalarFieldEnum = {
  Id: 'Id',
  Id_Factura: 'Id_Factura',
  Descripcion: 'Descripcion',
  Observaciones: 'Observaciones',
  FileName: 'FileName',
  FileSize: 'FileSize',
  Extension: 'Extension',
  Archivo: 'Archivo'
};

exports.Prisma.FormasDePagosScalarFieldEnum = {
  Id: 'Id',
  FormaDePago: 'FormaDePago'
};

exports.Prisma.Gastos_QuirurgicosScalarFieldEnum = {
  Id: 'Id',
  Codigo: 'Codigo',
  Descripcion: 'Descripcion'
};

exports.Prisma.Grupos_NomencladorScalarFieldEnum = {
  Id: 'Id',
  Grupo: 'Grupo'
};

exports.Prisma.HC_AuditadasScalarFieldEnum = {
  Id: 'Id',
  FechaAuditoria: 'FechaAuditoria',
  Id_HC: 'Id_HC',
  Codigo: 'Codigo',
  Descripci_n: 'Descripci_n',
  Valor: 'Valor',
  Cantidad: 'Cantidad',
  Total: 'Total',
  Id_Usuario: 'Id_Usuario',
  Id_Factura_Detalles: 'Id_Factura_Detalles',
  Id_CM_Envios_Detalles: 'Id_CM_Envios_Detalles',
  Id_ResumenDeCMxProfesional_Detalles: 'Id_ResumenDeCMxProfesional_Detalles'
};

exports.Prisma.HC_PracticasScalarFieldEnum = {
  Id: 'Id',
  Id_HC: 'Id_HC',
  Id_Practica: 'Id_Practica'
};

exports.Prisma.HistoriaClinica_AttachsScalarFieldEnum = {
  Id: 'Id',
  Id_HistoriaClinica: 'Id_HistoriaClinica',
  Descripcion: 'Descripcion',
  Observaciones: 'Observaciones',
  FileName: 'FileName',
  FileSize: 'FileSize',
  Extension: 'Extension',
  Archivo: 'Archivo'
};

exports.Prisma.HistoriasClinicasScalarFieldEnum = {
  id: 'id',
  Id_Paciente: 'Id_Paciente',
  Id_Profesional: 'Id_Profesional',
  Fecha: 'Fecha',
  Notas: 'Notas',
  Tipo: 'Tipo',
  Id_Afiliacion_Paciente: 'Id_Afiliacion_Paciente',
  Auditada: 'Auditada',
  Facturada: 'Facturada',
  Cant_Codigos: 'Cant_Codigos',
  Id_Cirugia_Solicitada: 'Id_Cirugia_Solicitada',
  Profesional_Pagado: 'Profesional_Pagado',
  Informe_de_Practica: 'Informe_de_Practica',
  Autorizacion_Obra_Social: 'Autorizacion_Obra_Social'
};

exports.Prisma.InformesScalarFieldEnum = {
  Id: 'Id',
  Id_Prestataria: 'Id_Prestataria',
  Id_Paciente: 'Id_Paciente',
  Id_Medico: 'Id_Medico',
  Fecha: 'Fecha',
  Observacion: 'Observacion',
  Resolucion: 'Resolucion',
  Tipo: 'Tipo',
  Status: 'Status',
  Orden_a_Recepcion: 'Orden_a_Recepcion',
  Status_Orden_a_Recepcion: 'Status_Orden_a_Recepcion',
  Id_Usuario_Recepcion: 'Id_Usuario_Recepcion'
};

exports.Prisma.Informes_AttachsScalarFieldEnum = {
  Id: 'Id',
  Id_Informe: 'Id_Informe',
  Descripcion: 'Descripcion',
  Observaciones: 'Observaciones',
  FileName: 'FileName',
  FileSize: 'FileSize',
  Extension: 'Extension',
  Archivo: 'Archivo'
};

exports.Prisma.InterlocutoresScalarFieldEnum = {
  Id: 'Id',
  Id_Prestataria: 'Id_Prestataria',
  Nombre: 'Nombre',
  Cargo: 'Cargo',
  Email: 'Email',
  Celular: 'Celular',
  Horarios: 'Horarios',
  Notas: 'Notas',
  Ausentismos: 'Ausentismos',
  Pagos: 'Pagos',
  Examenes: 'Examenes',
  CoordinadorSiniestros: 'CoordinadorSiniestros',
  UsuarioWeb: 'UsuarioWeb',
  PasswordWeb: 'PasswordWeb'
};

exports.Prisma.InterrogatorioScalarFieldEnum = {
  Id: 'Id',
  Id_Paciente: 'Id_Paciente',
  Fecha: 'Fecha',
  HTA: 'HTA',
  Diabetes: 'Diabetes',
  Dislipemia: 'Dislipemia',
  Asma: 'Asma',
  Varices: 'Varices',
  Tabaquismo: 'Tabaquismo',
  Consume_Marihuana: 'Consume_Marihuana',
  Consume_Cocaina: 'Consume_Cocaina',
  Cirugias: 'Cirugias',
  DosisCovid: 'DosisCovid',
  Status: 'Status',
  Semaforo: 'Semaforo',
  Notas: 'Notas',
  Notas2: 'Notas2'
};

exports.Prisma.LocalidadesScalarFieldEnum = {
  Id: 'Id',
  Id_Provincia: 'Id_Provincia',
  Localidad: 'Localidad',
  CP: 'CP'
};

exports.Prisma.LogScalarFieldEnum = {
  Id: 'Id',
  Fecha: 'Fecha',
  Id_Usuario: 'Id_Usuario',
  Usuario: 'Usuario',
  Evento: 'Evento',
  Datos: 'Datos',
  Detalles: 'Detalles'
};

exports.Prisma.Material_QuirurgicoScalarFieldEnum = {
  Id: 'Id',
  Material: 'Material'
};

exports.Prisma.Nomenclador_CirugiaScalarFieldEnum = {
  Id: 'Id',
  Codigo: 'Codigo',
  Descripcion: 'Descripcion',
  Complejidad: 'Complejidad',
  NumAyudantes: 'NumAyudantes'
};

exports.Prisma.PacientesScalarFieldEnum = {
  Id: 'Id',
  Codigo: 'Codigo',
  Apellido: 'Apellido',
  Nombre: 'Nombre',
  TipoDocumento: 'TipoDocumento',
  NroDocumento: 'NroDocumento',
  FechaNacimiento: 'FechaNacimiento',
  Direccion: 'Direccion',
  Barrio: 'Barrio',
  Id_Localidad: 'Id_Localidad',
  Telefono: 'Telefono',
  Celular1: 'Celular1',
  Celular2: 'Celular2',
  Email: 'Email',
  Observaciones: 'Observaciones',
  FechaAlta: 'FechaAlta',
  FamRespo_Nombre: 'FamRespo_Nombre',
  FamRespo_Relacion: 'FamRespo_Relacion',
  FamRespo_Telefono: 'FamRespo_Telefono',
  FamRespo_Celular: 'FamRespo_Celular',
  FamRespo_Email: 'FamRespo_Email',
  Id_Denuncia_ART_Activa: 'Id_Denuncia_ART_Activa',
  Genero: 'Genero',
  Cargo: 'Cargo',
  Puesto: 'Puesto',
  Funcion: 'Funcion',
  ImagenFirma: 'ImagenFirma',
  Activo: 'Activo',
  Nacionalidad: 'Nacionalidad',
  CUIL: 'CUIL'
};

exports.Prisma.PagosScalarFieldEnum = {
  Id: 'Id',
  Id_Pago_a_Profesionales: 'Id_Pago_a_Profesionales',
  Id_FormaDePago: 'Id_FormaDePago',
  Fecha: 'Fecha',
  Importe: 'Importe',
  Status: 'Status',
  Notas: 'Notas'
};

exports.Prisma.Pagos_a_ProfesionalesScalarFieldEnum = {
  Id: 'Id',
  Id_Profesional: 'Id_Profesional',
  Fecha: 'Fecha',
  Desde: 'Desde',
  Hasta: 'Hasta',
  Sub_Total: 'Sub_Total',
  Descuento: 'Descuento',
  MotivoDescuento: 'MotivoDescuento',
  SubTotalFinal: 'SubTotalFinal',
  IVA: 'IVA',
  Total: 'Total',
  Tipo_Factura: 'Tipo_Factura',
  Num_Factura: 'Num_Factura',
  Status: 'Status',
  Clase: 'Clase',
  TotalFijoPeriodico: 'TotalFijoPeriodico',
  TotalComisiones: 'TotalComisiones',
  TotalFijoPorCodigo: 'TotalFijoPorCodigo',
  FechaFactura: 'FechaFactura',
  Pagado: 'Pagado',
  Saldo: 'Saldo'
};

exports.Prisma.Pagos_a_Profesionales_DetallesScalarFieldEnum = {
  Id: 'Id',
  Id_Pagos_a_Profesionales: 'Id_Pagos_a_Profesionales',
  Id_HC: 'Id_HC',
  Id_HC_Auditada: 'Id_HC_Auditada',
  Id_Ayudantes_Honorarios: 'Id_Ayudantes_Honorarios',
  Id_Practica: 'Id_Practica',
  Descripcion: 'Descripcion',
  importe: 'importe'
};

exports.Prisma.Pagos_BancariosScalarFieldEnum = {
  Id: 'Id',
  Id_Beneficiario: 'Id_Beneficiario',
  Id_Concepto: 'Id_Concepto',
  Id_Cuenta: 'Id_Cuenta',
  Id_Tipo_Pago_Bancario: 'Id_Tipo_Pago_Bancario',
  Fecha_Obligacion: 'Fecha_Obligacion',
  Fecha_Vencimiento: 'Fecha_Vencimiento',
  Fecha_Pago: 'Fecha_Pago',
  Importe: 'Importe',
  Pagado: 'Pagado',
  Saldo: 'Saldo',
  Status: 'Status',
  Notas: 'Notas'
};

exports.Prisma.Pagos_Bancarios_AttachsScalarFieldEnum = {
  Id: 'Id',
  Id_Pago_Bancario_Realizado: 'Id_Pago_Bancario_Realizado',
  Descripcion: 'Descripcion',
  Observaciones: 'Observaciones',
  FileName: 'FileName',
  FileSize: 'FileSize',
  Extension: 'Extension',
  Archivo: 'Archivo'
};

exports.Prisma.Pagos_Bancarios_RealizadosScalarFieldEnum = {
  Id: 'Id',
  Id_Pago_Bancario: 'Id_Pago_Bancario',
  Fecha: 'Fecha',
  Monto: 'Monto',
  Id_Forma_de_Pago: 'Id_Forma_de_Pago',
  Status: 'Status'
};

exports.Prisma.Pedidos_PracticasScalarFieldEnum = {
  Id: 'Id',
  Id_Usuario: 'Id_Usuario',
  Id_Profesional: 'Id_Profesional',
  Id_Paciente: 'Id_Paciente',
  Id_Afiliacion_Paciente: 'Id_Afiliacion_Paciente',
  Id_Codigo: 'Id_Codigo',
  Cantidad: 'Cantidad',
  Diagnostico: 'Diagnostico',
  Fecha: 'Fecha',
  Autorizacion: 'Autorizacion',
  Id_Turno_Practica: 'Id_Turno_Practica'
};

exports.Prisma.Planes_ObrasSocialesScalarFieldEnum = {
  Id: 'Id',
  Codigo: 'Codigo',
  Id_ObraSocial: 'Id_ObraSocial',
  Plan: 'Plan'
};

exports.Prisma.Plus_Profesionales_PrestatariasScalarFieldEnum = {
  Id: 'Id',
  Id_Prestataria: 'Id_Prestataria',
  Id_Profesional: 'Id_Profesional',
  Plus: 'Plus'
};

exports.Prisma.PracticasScalarFieldEnum = {
  Id: 'Id',
  Id_Paciente: 'Id_Paciente',
  Id_Codigo_Valorizacion: 'Id_Codigo_Valorizacion',
  Cantidad: 'Cantidad',
  Id_Usuario_Responsable: 'Id_Usuario_Responsable',
  Status: 'Status',
  Fecha_Turno: 'Fecha_Turno',
  Hora_Turno: 'Hora_Turno',
  Fecha_Practica: 'Fecha_Practica',
  Id_Afiliacion: 'Id_Afiliacion',
  Autorizacion: 'Autorizacion',
  Es_Urgencia: 'Es_Urgencia',
  Es_ObraSocial: 'Es_ObraSocial',
  Practica_Interna: 'Practica_Interna',
  Id_Profesional_Informante: 'Id_Profesional_Informante',
  InformeProfesional: 'InformeProfesional',
  Honorarios_Profesional_Informante: 'Honorarios_Profesional_Informante',
  Pagado: 'Pagado',
  Saldo: 'Saldo',
  Recepcionado: 'Recepcionado',
  Semaforo: 'Semaforo',
  Notas: 'Notas',
  Id_Profesional_Firmante: 'Id_Profesional_Firmante'
};

exports.Prisma.Practicas_AttachsScalarFieldEnum = {
  Id: 'Id',
  Id_Practica: 'Id_Practica',
  Descripcion: 'Descripcion',
  Observaciones: 'Observaciones',
  FileName: 'FileName',
  FileSize: 'FileSize',
  Extension: 'Extension',
  Archivo: 'Archivo'
};

exports.Prisma.Praxis_UsuariosScalarFieldEnum = {
  Id: 'Id',
  Id_Usuario: 'Id_Usuario',
  Id_Codigo_Valorizacion: 'Id_Codigo_Valorizacion',
  Tambien_Informa: 'Tambien_Informa'
};

exports.Prisma.PrestatariasScalarFieldEnum = {
  Id: 'Id',
  Codigo: 'Codigo',
  Tipo: 'Tipo',
  Nombre: 'Nombre',
  Delegacion: 'Delegacion',
  Convenio_CM: 'Convenio_CM',
  Convenio_Directo: 'Convenio_Directo',
  Atendida: 'Atendida',
  Direccion: 'Direccion',
  Id_Locaildad: 'Id_Locaildad',
  Cuit: 'Cuit',
  SituacionIVA: 'SituacionIVA',
  Email_HistoriasClinicas: 'Email_HistoriasClinicas',
  Email_PedidosQuirurgicos: 'Email_PedidosQuirurgicos',
  Tel1: 'Tel1',
  Tel2: 'Tel2',
  PlusConsulta: 'PlusConsulta',
  Abreviacion: 'Abreviacion',
  RecibeMails: 'RecibeMails',
  MailCobranzas: 'MailCobranzas',
  CartaDeCobranza: 'CartaDeCobranza',
  Valor_UQ_Especialista: 'Valor_UQ_Especialista',
  Valor_UQ_Ayudante: 'Valor_UQ_Ayudante',
  Cant_UQ_Complejidad_1: 'Cant_UQ_Complejidad_1',
  Cant_UQ_Complejidad_2: 'Cant_UQ_Complejidad_2',
  Cant_UQ_Complejidad_3: 'Cant_UQ_Complejidad_3',
  Cant_UQ_Complejidad_4: 'Cant_UQ_Complejidad_4',
  Cant_UQ_Complejidad_5: 'Cant_UQ_Complejidad_5',
  Cant_UQ_Complejidad_6: 'Cant_UQ_Complejidad_6',
  Cant_UQ_Complejidad_7: 'Cant_UQ_Complejidad_7',
  Cant_UQ_Complejidad_8: 'Cant_UQ_Complejidad_8',
  Cant_UQ_Complejidad_9: 'Cant_UQ_Complejidad_9',
  Cant_UQ_Complejidad_10: 'Cant_UQ_Complejidad_10',
  Contacto_Pedidos_Quirurgicos: 'Contacto_Pedidos_Quirurgicos',
  Tel_Pedidos_Quirurgicos: 'Tel_Pedidos_Quirurgicos',
  Celular_Pedidos_Quirurgicos: 'Celular_Pedidos_Quirurgicos',
  CreditoDisponible: 'CreditoDisponible',
  EmailAlternativoParaExamenes: 'EmailAlternativoParaExamenes',
  Automatiza_Cobranzas: 'Automatiza_Cobranzas',
  ImportePlus: 'ImportePlus',
  Informes_de_Auditoria: 'Informes_de_Auditoria',
  Recibe_Facturas_Tipo: 'Recibe_Facturas_Tipo',
  Envios_de_Practicas_en_tiempo_real: 'Envios_de_Practicas_en_tiempo_real'
};

exports.Prisma.Prestatarias_ExamenesScalarFieldEnum = {
  Id: 'Id',
  Id_Prestataria: 'Id_Prestataria',
  Id_Examen: 'Id_Examen'
};

exports.Prisma.ProfesionalesScalarFieldEnum = {
  Id: 'Id',
  Codigo: 'Codigo',
  Apellido: 'Apellido',
  Nombre: 'Nombre',
  TipoDocumento: 'TipoDocumento',
  NumeroDocumento: 'NumeroDocumento',
  Cuit: 'Cuit',
  SituacionIVA: 'SituacionIVA',
  Direccion: 'Direccion',
  Barrio: 'Barrio',
  Id_Localidad: 'Id_Localidad',
  Telefono: 'Telefono',
  Celular: 'Celular',
  Email: 'Email',
  Activo: 'Activo',
  Colegiado: 'Colegiado',
  Instrucciones: 'Instrucciones',
  MandaMails: 'MandaMails',
  SoloRentaModulo: 'SoloRentaModulo',
  DecideCirugias: 'DecideCirugias',
  ImagenFirma: 'ImagenFirma',
  PrefijoFirma: 'PrefijoFirma',
  SueldoFijo: 'SueldoFijo',
  Es_Firmante: 'Es_Firmante',
  Es_Laboral: 'Es_Laboral',
  Requiere_Firmante: 'Requiere_Firmante',
  Factura_CM_por_su_Cuenta: 'Factura_CM_por_su_Cuenta',
  Selecciona_Emisor_para_CM: 'Selecciona_Emisor_para_CM',
  Lunes: 'Lunes',
  Martes: 'Martes',
  Miercoles: 'Miercoles',
  Jueves: 'Jueves',
  Viernes: 'Viernes'
};

exports.Prisma.ProfesionalesxCodigos_ImportesFijosScalarFieldEnum = {
  Id: 'Id',
  Id_Profesional: 'Id_Profesional',
  Id_CodigoValorizacion: 'Id_CodigoValorizacion',
  ImporteFijo: 'ImporteFijo'
};

exports.Prisma.ProfesionalesxCodigosValorizacionScalarFieldEnum = {
  Id: 'Id',
  Id_Profesional: 'Id_Profesional',
  Id_CodigoValorizacion: 'Id_CodigoValorizacion',
  Porcentaje: 'Porcentaje'
};

exports.Prisma.Proveedores_QuirofanosScalarFieldEnum = {
  Id: 'Id',
  Proveedor: 'Proveedor',
  Contacto: 'Contacto',
  Telefono: 'Telefono',
  Celular: 'Celular',
  Email: 'Email',
  Horarios: 'Horarios',
  Notas: 'Notas'
};

exports.Prisma.Proveedores_QuirurgicosScalarFieldEnum = {
  Id: 'Id',
  Proveedor: 'Proveedor',
  Medintt: 'Medintt'
};

exports.Prisma.ProvinciasScalarFieldEnum = {
  Id: 'Id',
  Provincia: 'Provincia'
};

exports.Prisma.ResumenDeCMxProfesionalScalarFieldEnum = {
  Id: 'Id',
  Id_Profesional: 'Id_Profesional',
  Id_Prestataria: 'Id_Prestataria',
  Fecha: 'Fecha',
  Total: 'Total',
  Clase: 'Clase'
};

exports.Prisma.ResumenDeCMxProfesional_DetallesScalarFieldEnum = {
  Id: 'Id',
  Id_ResumenDeCMxProfesional: 'Id_ResumenDeCMxProfesional',
  Id_HC: 'Id_HC',
  Id_Practica: 'Id_Practica',
  Id_Cirugia: 'Id_Cirugia',
  Id_Cirugia_Honorario: 'Id_Cirugia_Honorario',
  Codigo: 'Codigo',
  Descripcion: 'Descripcion',
  Cantidad: 'Cantidad',
  ValorUnitario: 'ValorUnitario',
  Total: 'Total',
  Codigo_Autorizacion: 'Codigo_Autorizacion'
};

exports.Prisma.Servicios_SMTPScalarFieldEnum = {
  Id: 'Id',
  Puerto: 'Puerto',
  Server: 'Server',
  Email_From: 'Email_From',
  Password: 'Password',
  Usa_SSL: 'Usa_SSL',
  Activo: 'Activo'
};

exports.Prisma.Sub_Categorias_Pagos_BancariosScalarFieldEnum = {
  Id: 'Id',
  Id_Categoria_Pago_Bancario: 'Id_Categoria_Pago_Bancario',
  Sub_Categoria: 'Sub_Categoria'
};

exports.Prisma.SysdiagramsScalarFieldEnum = {
  name: 'name',
  principal_id: 'principal_id',
  diagram_id: 'diagram_id',
  version: 'version',
  definition: 'definition'
};

exports.Prisma.Tipos_Pagos_BancariosScalarFieldEnum = {
  Id: 'Id',
  Id_Sub_Categoria_Pago_Bancario: 'Id_Sub_Categoria_Pago_Bancario',
  Tipo: 'Tipo'
};

exports.Prisma.TurnosScalarFieldEnum = {
  Id: 'Id',
  Id_Paciente: 'Id_Paciente',
  Id_Medico: 'Id_Medico',
  FechaTurno: 'FechaTurno',
  HoraTurno: 'HoraTurno',
  Id_Usuario: 'Id_Usuario',
  Tipo: 'Tipo',
  Notas: 'Notas',
  Status: 'Status',
  FechaAtencion: 'FechaAtencion',
  Id_AfiliacionPaciente: 'Id_AfiliacionPaciente',
  Id_Cirugia: 'Id_Cirugia',
  Recepcionado: 'Recepcionado',
  Plus_Cobrado: 'Plus_Cobrado',
  Plus_Pagado_al_Medico: 'Plus_Pagado_al_Medico',
  Plus_Saldo: 'Plus_Saldo',
  Autorizacion_Obra_Social: 'Autorizacion_Obra_Social',
  Plus_Transferencia: 'Plus_Transferencia'
};

exports.Prisma.UsuariosScalarFieldEnum = {
  Id: 'Id',
  NombreCompleto: 'NombreCompleto',
  Usuario: 'Usuario',
  Clave: 'Clave',
  Administracion: 'Administracion',
  Facturacion: 'Facturacion',
  Profesional: 'Profesional',
  Id_Medico: 'Id_Medico',
  Gerencia: 'Gerencia',
  Recepcion: 'Recepcion',
  Realiza_Practicas: 'Realiza_Practicas',
  Activo: 'Activo',
  CEO: 'CEO',
  Es_Kinesio: 'Es_Kinesio'
};

exports.Prisma.Valorizacion_PrestatariasScalarFieldEnum = {
  Id: 'Id',
  Id_Prestataria: 'Id_Prestataria',
  Id_Codigo_Valorizacion: 'Id_Codigo_Valorizacion',
  Valor: 'Valor',
  Valor_UnidadHonorario: 'Valor_UnidadHonorario',
  CantGalenosHonorarios: 'CantGalenosHonorarios',
  Valor_UnidadGasto: 'Valor_UnidadGasto',
  CanGalenosGastos: 'CanGalenosGastos'
};

exports.Prisma.VersionScalarFieldEnum = {
  Id: 'Id',
  Mayor: 'Mayor',
  Menor: 'Menor',
  Build: 'Build',
  Revision: 'Revision',
  Es_Opcional: 'Es_Opcional'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  Abonos: 'Abonos',
  AbonosxMeses: 'AbonosxMeses',
  AbonosxMeses_Conceptos: 'AbonosxMeses_Conceptos',
  Afiliacion_Pacientes: 'Afiliacion_Pacientes',
  Ausentismos: 'Ausentismos',
  Ausentismos_Attachs: 'Ausentismos_Attachs',
  Ausentismos_Bitacora: 'Ausentismos_Bitacora',
  Ausentismos_Categorias: 'Ausentismos_Categorias',
  Ausentismos_Certificados: 'Ausentismos_Certificados',
  Ausentismos_Controles: 'Ausentismos_Controles',
  Ausentismos_Informes: 'Ausentismos_Informes',
  Ausentismos_Tipos_Controles: 'Ausentismos_Tipos_Controles',
  Ayudantes_Honorarios: 'Ayudantes_Honorarios',
  Bancos: 'Bancos',
  Beneficiarios_Pagos_Bancarios: 'Beneficiarios_Pagos_Bancarios',
  Categorias_Pagos_Bancarios: 'Categorias_Pagos_Bancarios',
  Cirugia_Attachs: 'Cirugia_Attachs',
  Cirugia_Equipo_Profesional: 'Cirugia_Equipo_Profesional',
  Cirugia_EquipoHumano: 'Cirugia_EquipoHumano',
  Cirugia_Materiales: 'Cirugia_Materiales',
  Cirugia_Roles: 'Cirugia_Roles',
  Cirugias: 'Cirugias',
  Cirugias_Gastos: 'Cirugias_Gastos',
  Cirugias_Honorarios: 'Cirugias_Honorarios',
  CM_Envios: 'CM_Envios',
  CM_Envios_Detalles: 'CM_Envios_Detalles',
  Cobros: 'Cobros',
  Cobros_CM: 'Cobros_CM',
  Codigos_Valorizacion: 'Codigos_Valorizacion',
  Conceptos_Pagos_Bancarios: 'Conceptos_Pagos_Bancarios',
  Convenios_Profesionales: 'Convenios_Profesionales',
  Cuentas_Bancarias: 'Cuentas_Bancarias',
  Declaraciones_Juradas: 'Declaraciones_Juradas',
  Dias_Muertos: 'Dias_Muertos',
  Emisores_Fiscales: 'Emisores_Fiscales',
  Evaluacion_Fisica: 'Evaluacion_Fisica',
  Examenes: 'Examenes',
  Examenes_Codigos_Valorizacion: 'Examenes_Codigos_Valorizacion',
  Examenes_Laborales: 'Examenes_Laborales',
  Examenes_Laborales_Pacientes: 'Examenes_Laborales_Pacientes',
  Examenes_Laborales_PacientesxPracticas: 'Examenes_Laborales_PacientesxPracticas',
  Factura_Detalles: 'Factura_Detalles',
  Facturas: 'Facturas',
  Facturas_Attachs: 'Facturas_Attachs',
  FormasDePagos: 'FormasDePagos',
  Gastos_Quirurgicos: 'Gastos_Quirurgicos',
  Grupos_Nomenclador: 'Grupos_Nomenclador',
  HC_Auditadas: 'HC_Auditadas',
  HC_Practicas: 'HC_Practicas',
  HistoriaClinica_Attachs: 'HistoriaClinica_Attachs',
  HistoriasClinicas: 'HistoriasClinicas',
  Informes: 'Informes',
  Informes_Attachs: 'Informes_Attachs',
  Interlocutores: 'Interlocutores',
  Interrogatorio: 'Interrogatorio',
  Localidades: 'Localidades',
  Log: 'Log',
  Material_Quirurgico: 'Material_Quirurgico',
  Nomenclador_Cirugia: 'Nomenclador_Cirugia',
  Pacientes: 'Pacientes',
  Pagos: 'Pagos',
  Pagos_a_Profesionales: 'Pagos_a_Profesionales',
  Pagos_a_Profesionales_Detalles: 'Pagos_a_Profesionales_Detalles',
  Pagos_Bancarios: 'Pagos_Bancarios',
  Pagos_Bancarios_Attachs: 'Pagos_Bancarios_Attachs',
  Pagos_Bancarios_Realizados: 'Pagos_Bancarios_Realizados',
  Pedidos_Practicas: 'Pedidos_Practicas',
  Planes_ObrasSociales: 'Planes_ObrasSociales',
  Plus_Profesionales_Prestatarias: 'Plus_Profesionales_Prestatarias',
  Practicas: 'Practicas',
  Practicas_Attachs: 'Practicas_Attachs',
  Praxis_Usuarios: 'Praxis_Usuarios',
  Prestatarias: 'Prestatarias',
  Prestatarias_Examenes: 'Prestatarias_Examenes',
  Profesionales: 'Profesionales',
  ProfesionalesxCodigos_ImportesFijos: 'ProfesionalesxCodigos_ImportesFijos',
  ProfesionalesxCodigosValorizacion: 'ProfesionalesxCodigosValorizacion',
  Proveedores_Quirofanos: 'Proveedores_Quirofanos',
  Proveedores_Quirurgicos: 'Proveedores_Quirurgicos',
  Provincias: 'Provincias',
  ResumenDeCMxProfesional: 'ResumenDeCMxProfesional',
  ResumenDeCMxProfesional_Detalles: 'ResumenDeCMxProfesional_Detalles',
  Servicios_SMTP: 'Servicios_SMTP',
  Sub_Categorias_Pagos_Bancarios: 'Sub_Categorias_Pagos_Bancarios',
  sysdiagrams: 'sysdiagrams',
  Tipos_Pagos_Bancarios: 'Tipos_Pagos_Bancarios',
  Turnos: 'Turnos',
  Usuarios: 'Usuarios',
  Valorizacion_Prestatarias: 'Valorizacion_Prestatarias',
  Version: 'Version'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
