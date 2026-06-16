import type { Commission } from "@/lib/api";

export function buildAdminCommissionsSearchTextMatch(query: string): Record<string, unknown> {
  const pattern = query.trim();
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
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return [];

  const matches = commissions.filter((commission) => {
    const haystack = [
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
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();

    return haystack.includes(normalized);
  });

  return matches.slice(0, limit);
}
