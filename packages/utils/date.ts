import moment from "moment";

/**
 * Convierte cualquier entrada de fecha (Date, string, Moment) a string ISO 8601.
 * ESTÁNDAR PARA: Enviar datos al Backend / Guardar en DB.
 * Output ejemplo: "2025-12-08T14:30:00.000Z"
 */
export const toIsoString = (
  date: Date | string | moment.Moment | null | undefined
): string | null => {
  if (!date) return null;

  const m = moment(date);
  // Validamos para no enviar "Invalid date"
  return m.isValid() ? m.toISOString() : null;
};

/**
 * Parsea un string ISO (o cualquier fecha válida) a un objeto Date nativo de JS.
 * ESTÁNDAR PARA: Pasar el valor a componentes de UI (como PrimeReact) que esperan Date nativo.
 */
export const parseToJsDate = (
  date: string | Date | null | undefined
): Date | null => {
  if (!date) return null;

  const m = moment(date);
  return m.isValid() ? m.toDate() : null;
};

/**
 * Formatea una fecha para mostrarla visualmente (solo texto).
 * Útil para tablas o labels, no para inputs.
 */
export const formatDate = (
  date: string | Date,
  format: string = "DD/MM/YYYY"
): string => {
  if (!date) return "-";
  return moment(date).format(format);
};

/**
 * Convierte un string manual local (ej: "12-01-25" o "31/12/1999") a ISO string seguro.
 * Útil para `defaultValues` en formularios.
 * * Resuelve la ambigüedad: "01-02-23" será interpretado como 1 de Febrero, NO 2 de Enero.
 */
export const parseLocalDateToISO = (dateString: string): string | null => {
  if (!dateString) return null; // Mejor null que una fecha actual por defecto, para no ensuciar el form

  const formats = ["DD-MM-YYYY", "DD/MM/YYYY", "DD-MM-YY", "DD/MM/YY"];
  const m = moment(dateString, formats, true);

  return m.isValid() ? m.toISOString() : null;
};
