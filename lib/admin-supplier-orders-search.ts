import type { SupplierOrder } from "@/lib/api";
import { supplierOrderMatchesQuery } from "@/lib/supplier-order-display";
import { escapeRegex } from "@/lib/utils";

export function buildAdminSupplierOrdersSearchTextMatch(query: string): Record<string, unknown> {
  const pattern = escapeRegex(query.trim());
  return {
    $or: [
      { name: { $regex: pattern, $options: "i" } },
      { supplier_name: { $regex: pattern, $options: "i" } },
      { notes: { $regex: pattern, $options: "i" } },
      { "items.shirt_name": { $regex: pattern, $options: "i" } },
      { "items.sizes": { $regex: pattern, $options: "i" } },
      { "items.dorsal": { $regex: pattern, $options: "i" } },
      { "items.description": { $regex: pattern, $options: "i" } },
      { "items.link": { $regex: pattern, $options: "i" } },
    ],
  };
}

export function filterSupplierOrdersByQuery(
  orders: SupplierOrder[],
  query: string,
  limit = 8
): SupplierOrder[] {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return [];

  return orders.filter((order) => supplierOrderMatchesQuery(order, normalized)).slice(0, limit);
}
