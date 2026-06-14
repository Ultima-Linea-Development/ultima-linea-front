import type { Product } from "@/lib/api";
import { escapeRegex } from "@/lib/utils";

export const ADMIN_CATEGORY_FILTER_OPTIONS: Array<{
  value: NonNullable<Product["category"]>;
  label: string;
}> = [
  { value: "club", label: "Club" },
  { value: "national", label: "Selección" },
  { value: "retro", label: "Retro" },
];

export function parseIsActiveFilterParam(value: string | null): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

export function buildAdminCatalogMongoFilter(
  searchParams: URLSearchParams
): Record<string, unknown> {
  const filter: Record<string, unknown> = {};

  const team = searchParams.get("team");
  const league = searchParams.get("league");
  const category = searchParams.get("category");
  const size = searchParams.get("size");
  const isActive = parseIsActiveFilterParam(searchParams.get("is_active"));

  if (team) filter.team = { $regex: escapeRegex(team), $options: "i" };
  if (league) filter.league = league;
  if (category) filter.category = category;
  if (size) Object.assign(filter, buildProductSizeFilter(size));
  if (isActive !== undefined) filter.is_active = isActive;

  return filter;
}

export function buildAdminSearchTextMatch(query: string): Record<string, unknown> {
  const pattern = escapeRegex(query);
  return {
    $or: [
      { name: { $regex: pattern, $options: "i" } },
      { description: { $regex: pattern, $options: "i" } },
      { team: { $regex: pattern, $options: "i" } },
      { category: { $regex: pattern, $options: "i" } },
      { league: { $regex: pattern, $options: "i" } },
      { season: { $regex: pattern, $options: "i" } },
    ],
  };
}

export function buildProductSizeFilter(size: string): Record<string, unknown> {
  const trimmed = size.trim();
  if (!trimmed) return {};

  return {
    $or: [
      { [`stock_by_sizes.${trimmed}`]: { $gt: 0 } },
      { size: trimmed, stock: { $gt: 0 } },
    ],
  };
}
