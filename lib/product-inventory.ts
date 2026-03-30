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

export function orderedSizeEntries(product: Product): [string, number][] {
  const by = product.stock_by_sizes;
  if (by && Object.keys(by).length > 0) {
    const order = product.sizes?.length ? product.sizes : Object.keys(by).sort((a, b) => a.localeCompare(b));
    return order.map((s) => [s, by[s] ?? 0]);
  }
  if (product.size?.trim() && product.stock != null) {
    return [[product.size.trim(), product.stock]];
  }
  return [];
}

export function productToRows(product: Product): SizeStockRow[] {
  const by = product.stock_by_sizes;
  if (by && Object.keys(by).length > 0) {
    const order = product.sizes?.length ? product.sizes : Object.keys(by);
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
  rows: SizeStockRow[]
): { sizes: string[]; stock_by_sizes: Record<string, number> } | null {
  const filtered = rows.filter((r) => r.size.trim());
  if (filtered.length === 0) return null;
  const sizes: string[] = [];
  const stock_by_sizes: Record<string, number> = {};
  for (const r of filtered) {
    const size = r.size.trim();
    const n = Number(r.stock);
    if (Number.isNaN(n) || n < 0) return null;
    sizes.push(size);
    stock_by_sizes[size] = n;
  }
  return { sizes, stock_by_sizes };
}
