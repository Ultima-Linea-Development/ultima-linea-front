import type { Commission } from "@/lib/api";
import { buildFlexibleSearchRegexPattern, matchesNormalizedSearch } from "@/lib/search-normalization";

export function buildAdminCommissionsSearchTextMatch(query: string): Record<string, unknown> {
  const pattern = buildFlexibleSearchRegexPattern(query);
  if (!pattern) return {};

  return {
    $or: [
      { name: { $regex: pattern, $options: "i" } },
      { customer_name: { $regex: pattern, $options: "i" } },
      { customer_contact: { $regex: pattern, $options: "i" } },
      { external_seller_name: { $regex: pattern, $options: "i" } },
      { supplier_order_name: { $regex: pattern, $options: "i" } },
      { notes: { $regex: pattern, $options: "i" } },
      { "items.shirt_name": { $regex: pattern, $options: "i" } },
      { "items.dorsal": { $regex: pattern, $options: "i" } },
      { "items.description": { $regex: pattern, $options: "i" } },
    ],
  };
}

export function filterCommissionsByQuery(
  commissions: Commission[],
  query: string,
  limit = 8
): Commission[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const matches = commissions.filter((commission) =>
    matchesNormalizedSearch(
      [
        commission.name,
        commission.customer_name,
        commission.customer_contact,
        commission.external_seller_name,
        commission.supplier_order_name,
        commission.notes,
        ...commission.items.flatMap((item) => [
          item.shirt_name,
          item.sizes,
          item.dorsal,
          item.description,
        ]),
      ],
      trimmed
    )
  );

  return matches.slice(0, limit);
}
