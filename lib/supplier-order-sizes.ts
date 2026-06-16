import type { SupplierOrderLineItem } from "@/lib/api";
import { compareSizeLabels } from "@/lib/product-inventory";

function newRowId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `r-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export type SupplierOrderSizeQuantityRow = {
  id: string;
  size: string;
  quantity: string;
};

export function emptySupplierOrderSizeRow(): SupplierOrderSizeQuantityRow {
  return { id: newRowId(), size: "", quantity: "1" };
}

export function formatSupplierOrderSizesDisplay(
  quantityBySizes?: Record<string, number>,
  sizesFallback?: string
): string {
  if (quantityBySizes && Object.keys(quantityBySizes).length > 0) {
    return Object.entries(quantityBySizes)
      .sort(([a], [b]) => compareSizeLabels(a, b))
      .map(([size, quantity]) => (quantity === 1 ? size : `${size} (${quantity})`))
      .join(", ");
  }

  return sizesFallback?.trim() || "—";
}

export function getSupplierOrderLineItemQuantity(
  quantityBySizes?: Record<string, number>,
  quantityFallback = 0
): number {
  if (quantityBySizes && Object.keys(quantityBySizes).length > 0) {
    return Object.values(quantityBySizes).reduce((sum, value) => sum + value, 0);
  }

  return quantityFallback;
}

export function getSupplierOrderSizeQuantityEntries(
  item: Pick<SupplierOrderLineItem, "quantity" | "sizes" | "quantity_by_sizes">
): [string, number][] {
  if (item.quantity_by_sizes && Object.keys(item.quantity_by_sizes).length > 0) {
    return Object.entries(item.quantity_by_sizes)
      .sort(([a], [b]) => compareSizeLabels(a, b))
      .map(([size, quantity]) => [size, quantity] as [string, number]);
  }

  if (item.sizes?.trim()) {
    return [[item.sizes.trim(), item.quantity]];
  }

  return [];
}

export function sizeRowsFromLineItem(
  item: Pick<SupplierOrderLineItem, "quantity" | "sizes" | "quantity_by_sizes">
): SupplierOrderSizeQuantityRow[] {
  if (item.quantity_by_sizes && Object.keys(item.quantity_by_sizes).length > 0) {
    return Object.entries(item.quantity_by_sizes)
      .sort(([a], [b]) => compareSizeLabels(a, b))
      .map(([size, quantity]) => ({
        id: newRowId(),
        size,
        quantity: String(quantity),
      }));
  }

  if (item.sizes?.trim()) {
    return [
      {
        id: newRowId(),
        size: item.sizes.trim(),
        quantity: String(item.quantity),
      },
    ];
  }

  return [emptySupplierOrderSizeRow()];
}

export function sizeRowsToPayload(
  rows: SupplierOrderSizeQuantityRow[]
): { quantity_by_sizes: Record<string, number>; quantity: number; sizes: string } | null {
  const quantityBySizes: Record<string, number> = {};

  for (const row of rows) {
    const size = row.size.trim();
    const quantity = Number(row.quantity);

    if (!size) continue;
    if (!Number.isInteger(quantity) || quantity <= 0) return null;

    const key = size.toLocaleLowerCase();
    const existing = Object.entries(quantityBySizes).find(
      ([existingSize]) => existingSize.toLocaleLowerCase() === key
    );

    if (existing) {
      quantityBySizes[existing[0]] += quantity;
    } else {
      quantityBySizes[size] = quantity;
    }
  }

  if (Object.keys(quantityBySizes).length === 0) return null;

  const quantity = Object.values(quantityBySizes).reduce((sum, value) => sum + value, 0);

  return {
    quantity_by_sizes: quantityBySizes,
    quantity,
    sizes: formatSupplierOrderSizesDisplay(quantityBySizes),
  };
}
