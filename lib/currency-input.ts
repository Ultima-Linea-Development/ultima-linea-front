const ARGENTINE_CURRENCY_FORMATTER = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function getDecimalSeparatorIndex(value: string): number {
  const commaIndex = value.lastIndexOf(",");
  const dotIndex = value.lastIndexOf(".");

  if (commaIndex >= 0 && dotIndex >= 0) return Math.max(commaIndex, dotIndex);

  const separatorIndex = Math.max(commaIndex, dotIndex);
  if (separatorIndex < 0) return -1;

  const decimalDigits = value.slice(separatorIndex + 1).replace(/\D/g, "").length;
  return decimalDigits > 0 && decimalDigits <= 2 ? separatorIndex : -1;
}

export function parseCurrencyInputValue(value: string): string {
  const sanitized = value.replace(/[^\d,.-]/g, "");
  if (!sanitized) return "";

  const decimalSeparatorIndex = getDecimalSeparatorIndex(sanitized);
  const integerPart =
    decimalSeparatorIndex >= 0 ? sanitized.slice(0, decimalSeparatorIndex) : sanitized;
  const decimalPart =
    decimalSeparatorIndex >= 0 ? sanitized.slice(decimalSeparatorIndex + 1) : "";

  const integerDigits = integerPart.replace(/\D/g, "");
  const decimalDigits = decimalPart.replace(/\D/g, "").slice(0, 2);
  const normalized = decimalDigits ? `${integerDigits || "0"}.${decimalDigits}` : integerDigits;
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) return "";
  return String(Math.max(0, parsed));
}

export function formatCurrencyInputValue(value: string | number): string {
  if (value === "") return "";

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "";

  return ARGENTINE_CURRENCY_FORMATTER.format(Math.max(0, parsed));
}
