import { sizeRowsToPayload, type SupplierOrderSizeQuantityRow } from "@/lib/supplier-order-sizes";

export type SupplierOrderPriceAllocatableItem = {
  price: string;
  isCustomPrice: boolean;
  sizeRows: SupplierOrderSizeQuantityRow[];
};

export function normalizeSupplierOrderPriceValue(value: string): string {
  if (value === "") return "";
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return "0";
  return String(Math.max(0, parsed));
}

export function parseSupplierOrderTotalPaid(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function getSupplierOrderItemDraftQuantity(
  item: Pick<SupplierOrderPriceAllocatableItem, "sizeRows">
): number {
  return sizeRowsToPayload(item.sizeRows)?.quantity ?? 0;
}

function formatAllocatedPrice(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

export function allocateSupplierOrderPrices<T extends SupplierOrderPriceAllocatableItem>(
  items: T[],
  totalPaidValue: string
): T[] {
  const totalPaid = parseSupplierOrderTotalPaid(totalPaidValue);
  if (totalPaid === null) return items;

  const fixedSubtotal = items.reduce((sum, item) => {
    if (!item.isCustomPrice) return sum;

    return sum + getSupplierOrderItemDraftQuantity(item) * Math.max(0, Number(item.price) || 0);
  }, 0);

  const flexibleQuantity = items.reduce((sum, item) => {
    if (item.isCustomPrice) return sum;
    return sum + getSupplierOrderItemDraftQuantity(item);
  }, 0);

  const allocatedPrice =
    flexibleQuantity > 0 ? Math.max(0, totalPaid - fixedSubtotal) / flexibleQuantity : 0;

  return items.map((item) =>
    item.isCustomPrice ? item : { ...item, price: formatAllocatedPrice(allocatedPrice) }
  );
}

export function getSupplierOrderFixedPriceSubtotal<T extends SupplierOrderPriceAllocatableItem>(
  items: T[]
): number {
  return items.reduce((sum, item) => {
    if (!item.isCustomPrice) return sum;
    return sum + getSupplierOrderItemDraftQuantity(item) * Math.max(0, Number(item.price) || 0);
  }, 0);
}
