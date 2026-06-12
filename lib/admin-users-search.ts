import type { AdminUser } from "@/lib/api";
import { formatUserRole } from "@/lib/roles";
import { escapeRegex } from "@/lib/utils";

export function buildAdminUsersSearchTextMatch(query: string): Record<string, unknown> {
  const pattern = escapeRegex(query);
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
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return [];

  const matches = users.filter((user) => {
    const values = [
      user.email,
      user.first_name,
      user.last_name,
      user.phone,
      formatUserRole(user.role),
      user.role,
    ];
    return values.some((value) => value?.toLocaleLowerCase().includes(normalized));
  });

  return matches.slice(0, limit);
}
