/**
 * Format a date to dd/mm/yyyy in UTC-3 timezone
 */
export const formatDate = (date: Date | string | null): string => {
  if (!date) return "-";

  const d = new Date(date);

  // Adjust to UTC-3
  const offset = -3 * 60; // -3 hours in minutes
  const localTime = d.getTime();
  const localOffset = d.getTimezoneOffset() * 60000; // offset in milliseconds
  const utc = localTime + localOffset;
  const utcMinus3 = new Date(utc + offset * 60000);

  const day = String(utcMinus3.getUTCDate()).padStart(2, "0");
  const month = String(utcMinus3.getUTCMonth() + 1).padStart(2, "0");
  const year = utcMinus3.getUTCFullYear();

  return `${day}/${month}/${year}`;
};
