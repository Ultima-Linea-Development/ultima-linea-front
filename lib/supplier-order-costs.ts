import type { SupplierOrder } from "@/lib/api";

export function parseSupplierOrderOptionalCost(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function getSupplierOrderItemsTotal(order: Pick<SupplierOrder, "items">): number {
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getSupplierOrderTotal(
  order: Pick<SupplierOrder, "items">
): number {
  return getSupplierOrderItemsTotal(order);
}
