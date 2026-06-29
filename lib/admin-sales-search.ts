import type { Sale } from "@/lib/api";
import { normalizeSaleSearchQuery, saleMatchesQuery } from "@/lib/sale-items";
import { buildFlexibleSearchRegexPattern } from "@/lib/search-normalization";

export function buildAdminSalesSearchTextMatch(query: string): Record<string, unknown> {
  const pattern = buildFlexibleSearchRegexPattern(normalizeSaleSearchQuery(query));
  return {
    $or: [
      { product_name: { $regex: pattern, $options: "i" } },
      { product_sku: { $regex: pattern, $options: "i" } },
      { size: { $regex: pattern, $options: "i" } },
      { "items.product_name": { $regex: pattern, $options: "i" } },
      { "items.product_sku": { $regex: pattern, $options: "i" } },
      { "items.size": { $regex: pattern, $options: "i" } },
      { external_seller_name: { $regex: pattern, $options: "i" } },
      { transfer_alias: { $regex: pattern, $options: "i" } },
      { description: { $regex: pattern, $options: "i" } },
    ],
  };
}

export function filterSalesByQuery(sales: Sale[], query: string, limit = 8): Sale[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  return sales.filter((sale) => saleMatchesQuery(sale, trimmed)).slice(0, limit);
}
