import type { AdminUser } from "@/lib/api";
import { formatUserRole } from "@/lib/roles";
import { buildFlexibleSearchRegexPattern, matchesNormalizedSearch } from "@/lib/search-normalization";

export function buildAdminUsersSearchTextMatch(query: string): Record<string, unknown> {
  const pattern = buildFlexibleSearchRegexPattern(query);
  return {
    $or: [
      { email: { $regex: pattern, $options: "i" } },
      { first_name: { $regex: pattern, $options: "i" } },
      { last_name: { $regex: pattern, $options: "i" } },
      { phone: { $regex: pattern, $options: "i" } },
      { role: { $regex: pattern, $options: "i" } },
    ],
  };
}

export function filterUsersByQuery(users: AdminUser[], query: string, limit = 8): AdminUser[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const matches = users.filter((user) =>
    matchesNormalizedSearch(
      [
        user.email,
        user.first_name,
        user.last_name,
        user.phone,
        formatUserRole(user.role),
        user.role,
      ],
      trimmed
    )
  );

  return matches.slice(0, limit);
}
