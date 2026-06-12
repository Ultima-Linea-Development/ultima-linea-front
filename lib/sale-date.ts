const SALE_DATE_API_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function buildLocalDate(year: number, month: number, day: number): Date | null {
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);
  if (Number.isNaN(date.getTime())) return null;
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function parseExcelSerialDate(value: string): Date | null {
  const serial = Number(value);
  if (!Number.isFinite(serial) || serial <= 0 || serial >= 1_000_000) {
    return null;
  }

  const wholeDays = Math.floor(serial);
  const excelEpoch = Date.UTC(1899, 11, 30);
  const utcMs = excelEpoch + wholeDays * 86_400_000;
  const utcDate = new Date(utcMs);

  return buildLocalDate(
    utcDate.getUTCFullYear(),
    utcDate.getUTCMonth() + 1,
    utcDate.getUTCDate()
  );
}

function parseSlashOrDashDate(value: string): Date | null {
  const match = value.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
  if (!match) return null;

  let first = Number(match[1]);
  let second = Number(match[2]);
  let year = Number(match[3]);

  if (year < 100) {
    year += year >= 70 ? 1900 : 2000;
  }

  let day: number;
  let month: number;

  if (first > 12) {
    day = first;
    month = second;
  } else if (second > 12) {
    month = first;
    day = second;
  } else {
    day = first;
    month = second;
  }

  return buildLocalDate(year, month, day);
}

function parseYearFirstDate(value: string): Date | null {
  const match = value.match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  return buildLocalDate(year, month, day);
}

export function getTodayDateInputValue(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatSaleDateInputDisplay(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function getTodaySaleDateDisplayValue(date = new Date()): string {
  return formatSaleDateInputDisplay(date);
}

export function parseSaleDateInput(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const normalized = trimmed.replace(/\u00a0/g, " ").split(/[ T]/)[0]?.trim() ?? "";
  if (!normalized) return null;

  if (SALE_DATE_API_PATTERN.test(normalized)) {
    const [year, month, day] = normalized.split("-").map(Number);
    return buildLocalDate(year, month, day);
  }

  if (/^\d+(\.\d+)?$/.test(normalized)) {
    return parseExcelSerialDate(normalized);
  }

  const yearFirst = parseYearFirstDate(normalized);
  if (yearFirst) return yearFirst;

  return parseSlashOrDashDate(normalized);
}

export function saleDateInputToApiValue(value: string): string | null {
  const parsed = parseSaleDateInput(value);
  if (!parsed) return null;
  return getTodayDateInputValue(parsed);
}

export function normalizeSaleDateInputDisplay(value: string): string | null {
  const parsed = parseSaleDateInput(value);
  if (!parsed) return null;
  return formatSaleDateInputDisplay(parsed);
}

export function saleDateToInputValue(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return getTodayDateInputValue();
  return getTodayDateInputValue(date);
}

export function saleDateIsoToDisplayValue(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return getTodaySaleDateDisplayValue();
  return formatSaleDateInputDisplay(date);
}

export function formatSaleDateDisplay(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
