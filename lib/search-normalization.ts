import { escapeRegex } from "@/lib/utils";

const DIACRITIC_MARKS = /[\u0300-\u036f]/g;
const NON_ALPHANUMERIC = /[^a-z0-9]+/g;
const FLEXIBLE_SEPARATOR = "[^A-Za-z0-9À-ÖØ-öø-ÿ]*";

const ACCENT_FOLDING_CLASSES: Record<string, string> = {
  a: "[aáàâäãå]",
  c: "[cç]",
  e: "[eéèêë]",
  i: "[iíìîï]",
  n: "[nñ]",
  o: "[oóòôöõ]",
  u: "[uúùûü]",
  y: "[yýÿ]",
};

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(DIACRITIC_MARKS, "")
    .toLocaleLowerCase()
    .replace(NON_ALPHANUMERIC, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function compactSearchText(value: string): string {
  return normalizeSearchText(value).replace(/\s+/g, "");
}

function foldSearchChar(char: string): string {
  const lower = char.toLocaleLowerCase();
  return ACCENT_FOLDING_CLASSES[lower] ?? escapeRegex(lower);
}

function isAlphanumericSearchChar(char: string): boolean {
  return /[a-zA-Z0-9]/.test(char.normalize("NFD").replace(DIACRITIC_MARKS, ""));
}

function isFlexibleSeparatorChar(char: string): boolean {
  return /\s/.test(char) || "-/._".includes(char);
}

export function matchesNormalizedSearch(values: Array<string | undefined>, query: string): boolean {
  const trimmed = query.trim();
  if (!trimmed) return false;

  const literalQuery = trimmed.toLocaleLowerCase();
  const normalizedQuery = normalizeSearchText(query);
  const compactQuery = compactSearchText(query);

  return values.some((value) => {
    if (!value) return false;

    if (value.toLocaleLowerCase().includes(literalQuery)) return true;

    if (!normalizedQuery && !compactQuery) return false;

    const normalizedValue = normalizeSearchText(value);
    if (normalizedQuery && normalizedValue.includes(normalizedQuery)) return true;

    return Boolean(compactQuery && compactSearchText(value).includes(compactQuery));
  });
}

export function buildFlexibleSearchRegexPattern(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) return escapeRegex(trimmed);

  const chars = [...trimmed.normalize("NFD").replace(DIACRITIC_MARKS, "")];
  const parts: string[] = [];
  let alnumRun = "";

  const flushAlnumRun = () => {
    if (!alnumRun) return;
    parts.push([...alnumRun.toLocaleLowerCase()].map(foldSearchChar).join(FLEXIBLE_SEPARATOR));
    alnumRun = "";
  };

  for (const char of chars) {
    if (isAlphanumericSearchChar(char)) {
      alnumRun += char;
      continue;
    }

    flushAlnumRun();
    if (isFlexibleSeparatorChar(char)) {
      parts.push(FLEXIBLE_SEPARATOR);
      continue;
    }

    parts.push(`(?:${escapeRegex(char)}|${FLEXIBLE_SEPARATOR})`);
  }

  flushAlnumRun();

  return parts.join("") || escapeRegex(trimmed);
}
