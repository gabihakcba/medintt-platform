import moment from "moment-timezone";
import "moment/locale/es";

// Configure default timezone and locale
const TIMEZONE = "America/Argentina/Buenos_Aires";
const LOCALE = "es";

moment.tz.setDefault(TIMEZONE);
moment.locale(LOCALE);

/**
 * Convierte cualquier entrada de fecha (Date, string, Moment) a string ISO 8601.
 * ESTÁNDAR PARA: Enviar datos al Backend / Guardar en DB.
 * Output ejemplo: "2025-12-08T14:30:00.000Z"
 */
export const toIsoString = (
  date: Date | string | moment.Moment | null | undefined,
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
  date: string | Date | null | undefined,
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
  format: string = "DD/MM/YYYY",
): string => {
  if (!date) return "-";
  return moment(date).format(format);
};

/**
 * Convierte un string manual local (ej: "12-01-25" o "31/12/1999") a ISO string seguro.
 * Útil para `defaultValues` en formularios.
 * Resuelve la ambigüedad: "01-02-23" será interpretado como 1 de Febrero, NO 2 de Enero.
 */
export const parseLocalDateToISO = (dateString: string): string | null => {
  if (!dateString) return null;

  const formats = ["DD-MM-YYYY", "DD/MM/YYYY", "DD-MM-YY", "DD/MM/YY"];
  const m = moment(dateString, formats, true);

  return m.isValid() ? m.toISOString() : null;
};

// ===== TIMEZONE-AWARE UTILITIES =====

/**
 * Obtiene la fecha/hora actual en Argentina
 */
export const now = (): moment.Moment => {
  return moment().tz(TIMEZONE);
};

/**
 * Obtiene la fecha/hora actual en Argentina como Date nativo
 */
export const nowAsDate = (): Date => {
  return moment().tz(TIMEZONE).toDate();
};

/**
 * Convierte una fecha a la zona horaria de Argentina
 */
export const toArgentinaTime = (date: Date | string): moment.Moment => {
  return moment(date).tz(TIMEZONE);
};

/**
 * Convierte una fecha a Date nativo en zona horaria de Argentina
 */
export const toArgentinaDate = (
  value: Date | string | null | undefined,
): Date => {
  if (!value) return now().toDate();

  const m = moment(value);
  if (m.isValid()) {
    return m.tz(TIMEZONE).toDate();
  }

  return now().toDate();
};

/**
 * Valida si una fecha es válida
 */
export const isValid = (date: string): boolean => {
  return moment(date, true).isValid();
};

/**
 * Suma días/horas/meses a una fecha
 */
export const add = (
  date: Date | string,
  amount: number,
  unit: moment.unitOfTime.DurationConstructor,
): moment.Moment => {
  return moment(date).tz(TIMEZONE).add(amount, unit);
};

// ===== DATE RANGES =====

/**
 * Crea un rango de fechas para consultas (manteniendo horas originales)
 */
export const createDateRange = (
  date: string | Date,
): {
  start: moment.Moment;
  end: moment.Moment;
} => {
  const start = moment.utc(date).startOf("day");
  const end = moment.utc(date).endOf("day");
  return { start, end };
};

/**
 * Inicio del día para una fecha
 */
export const startOfDay = (date: string | Date): Date => {
  return moment(date).startOf("day").toDate();
};

/**
 * Fin del día para una fecha
 */
export const endOfDay = (date: string | Date): Date => {
  return moment(date).endOf("day").toDate();
};

/**
 * Inicio del mes para una fecha
 */
export const startOfMonth = (date: string | Date): Date => {
  return moment(date).startOf("month").toDate();
};

/**
 * Fin del mes para una fecha
 */
export const endOfMonth = (date: string | Date): Date => {
  return moment(date).endOf("month").toDate();
};

/**
 * Calcula la cantidad de días entre dos fechas (inclusive)
 */
export const amountOfDays = (
  date1: string | Date,
  date2: string | Date,
): number => {
  const start = moment(date1).startOf("day");
  const end = moment(date2).endOf("day");
  return end.diff(start, "days") + 1;
};

/**
 * Crea un rango de fechas para un mes completo
 */
export const createMonthDateRange = (
  date: string | Date,
): {
  start: moment.Moment;
  end: moment.Moment;
} => {
  const mDate = moment.utc(date);
  const start = mDate.clone().startOf("month");
  const end = mDate.clone().endOf("month");
  return { start, end };
};

// ===== COMPARISON UTILITIES =====

/**
 * Compara solo la parte de fecha (ignorando horas)
 */
export const isSameDate = (
  date1: Date | string,
  date2: Date | string,
): boolean => {
  return moment(date1).tz(TIMEZONE).isSame(moment(date2).tz(TIMEZONE), "day");
};

/**
 * Convierte una fecha a string en formato YYYY-MM-DD (para comparaciones)
 */
export const toDateString = (date: Date | string): string => {
  return moment(date).tz(TIMEZONE).format("YYYY-MM-DD");
};

/**
 * Verifica si una fecha es anterior a hoy
 */
export const isBeforeToday = (date: Date | string): boolean => {
  const inputDate = moment(date).tz(TIMEZONE).startOf("day");
  const today = moment().tz(TIMEZONE).startOf("day");
  return inputDate.isBefore(today);
};
