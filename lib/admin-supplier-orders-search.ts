import type { SupplierOrder } from "@/lib/api";
import { parseSupplierOrderDisplayLabel, supplierOrderMatchesQuery } from "@/lib/supplier-order-display";
import { buildFlexibleSearchRegexPattern } from "@/lib/search-normalization";

export function buildAdminSupplierOrdersSearchTextMatch(query: string): Record<string, unknown> {
  const parsedLabel = parseSupplierOrderDisplayLabel(query);
  if (parsedLabel) {
    return {
      $and: [
        { name: { $regex: buildFlexibleSearchRegexPattern(parsedLabel.name), $options: "i" } },
        {
          supplier_name: {
            $regex: buildFlexibleSearchRegexPattern(parsedLabel.supplier),
            $options: "i",
          },
        },
      ],
    };
  }

  const pattern = buildFlexibleSearchRegexPattern(query);
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
  const trimmed = query.trim();
  if (!trimmed) return [];

  return orders
    .filter((order) => supplierOrderMatchesQuery(order, trimmed))
    .slice(0, limit);
}
