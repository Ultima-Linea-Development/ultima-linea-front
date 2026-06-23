import type { Product } from "@/lib/api";

function newRowId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `r-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export type SizeStockRow = { id: string; size: string; stock: string };

export function emptySizeStockRow(): SizeStockRow {
  return { id: newRowId(), size: "", stock: "" };
}

export function getProductTotalStock(
  product: Pick<Product, "stock" | "stock_by_sizes">
): number {
  const by = product.stock_by_sizes;
  if (by && Object.keys(by).length > 0) {
    return Object.values(by).reduce((a, b) => a + b, 0);
  }
  return product.stock ?? 0;
}

const SIZE_SORT_RANK: Record<string, number> = {
  XXS: 0,
  XS: 10,
  S: 20,
  M: 30,
  L: 40,
  XL: 50,
  XXL: 60,
  "2XL": 60,
  XXXL: 70,
  "3XL": 70,
  "4XL": 80,
  "5XL": 90,
};

export function compareSizeLabels(a: string, b: string): number {
  const normalize = (value: string) => value.trim().toUpperCase();
  const normalizedA = normalize(a);
  const normalizedB = normalize(b);
  const rankA = SIZE_SORT_RANK[normalizedA];
  const rankB = SIZE_SORT_RANK[normalizedB];

  if (rankA != null && rankB != null && rankA !== rankB) return rankA - rankB;
  if (rankA != null && rankB == null) return -1;
  if (rankA == null && rankB != null) return 1;

  return a.localeCompare(b, "es", { numeric: true, sensitivity: "base" });
}

export function sortSizeLabels<T extends string>(sizes: T[]): T[] {
  return [...sizes].sort(compareSizeLabels);
}

export function sortSizeEntries<TValue>(entries: [string, TValue][]): [string, TValue][] {
  return [...entries].sort(([a], [b]) => compareSizeLabels(a, b));
}

export function sortSizeLabelText(value: string): string {
  const sizes = value
    .split(",")
    .map((size) => size.trim())
    .filter(Boolean);

  if (sizes.length <= 1) return value.trim();

  return sortSizeLabels(sizes).join(", ");
}

export function orderedSizeEntries(product: Product): [string, number][] {
  const by = product.stock_by_sizes;
  if (by && Object.keys(by).length > 0) {
    const order = sortSizeLabels(product.sizes?.length ? product.sizes : Object.keys(by));
    return order.map((s) => [s, by[s] ?? 0]);
  }
  if (product.size?.trim() && product.stock != null) {
    return [[product.size.trim(), product.stock]];
  }
  return [];
}

export function getProductStockEntries(product: Product): [string, number][] {
  return sortSizeEntries(orderedSizeEntries(product).filter(([, stock]) => stock > 0));
}

export function formatProductSizeStockDisplay(stock: number | null | undefined): string {
  if (stock == null || stock === 0) return "";
  return String(stock);
}

export function productToRows(product: Product): SizeStockRow[] {
  const by = product.stock_by_sizes;
  if (by && Object.keys(by).length > 0) {
    const order = sortSizeLabels(product.sizes?.length ? product.sizes : Object.keys(by));
    return order.map((s) => ({
      id: newRowId(),
      size: s,
      stock: String(by[s] ?? 0),
    }));
  }
  if (product.size?.trim()) {
    return [{ id: newRowId(), size: product.size.trim(), stock: String(product.stock ?? 0) }];
  }
  if (product.stock != null) {
    return [{ id: newRowId(), size: "", stock: String(product.stock) }];
  }
  return [emptySizeStockRow()];
}

export function rowsToPayload(
  rows: SizeStockRow[],
  options?: { allowEmpty?: boolean }
): { sizes: string[]; stock_by_sizes: Record<string, number> } | null {
  const filtered = rows.filter((r) => r.size.trim());
  if (filtered.length === 0) {
    return options?.allowEmpty ? { sizes: [], stock_by_sizes: {} } : null;
  }
  const bySize = new Map<string, number>();

  for (const r of filtered) {
    const size = r.size.trim();
    const n = Number(r.stock);
    if (Number.isNaN(n) || n < 0) return null;
    bySize.set(size, n);
  }

  const sizes = sortSizeLabels([...bySize.keys()]);
  const stock_by_sizes: Record<string, number> = {};
  for (const size of sizes) {
    stock_by_sizes[size] = bySize.get(size) ?? 0;
  }

  return { sizes, stock_by_sizes };
}
