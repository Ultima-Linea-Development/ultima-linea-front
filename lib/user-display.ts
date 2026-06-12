import type { SaleAssignableUser } from "@/lib/api";

export function formatPersonName(
  firstName?: string | null,
  lastName?: string | null,
  fallback = "—"
): string {
  const name = `${firstName ?? ""} ${lastName ?? ""}`.trim();
  return name || fallback;
}

export function formatAssignableUserLabel(user: SaleAssignableUser): string {
  const name = formatPersonName(user.first_name, user.last_name, "");
  return name || user.email;
}

export function getAssignableUserLabel(
  users: SaleAssignableUser[],
  userId?: string | null
): string {
  if (!userId) return "—";
  const user = users.find((item) => item.id === userId);
  if (!user) return "—";
  return formatAssignableUserLabel(user);
}
