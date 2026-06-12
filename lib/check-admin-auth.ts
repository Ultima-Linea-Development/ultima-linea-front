import {
  clearAuth,
  getUserFromToken,
  isAdmin,
  isStaff,
  mustCompleteSetup,
  ONBOARDING_PATH,
} from "@/lib/auth";

export type AdminAuthStatus = "ready" | "unauthenticated" | "forbidden" | "setup_required";

export function checkAdminAuth(pathname: string): AdminAuthStatus {
  const user = getUserFromToken();

  if (!user || !isStaff()) {
    return "unauthenticated";
  }

  if (mustCompleteSetup()) {
    return pathname === ONBOARDING_PATH ? "ready" : "setup_required";
  }

  if (pathname === ONBOARDING_PATH) {
    return "ready";
  }

  if (pathname.startsWith("/admin/users") && !isAdmin()) {
    return "forbidden";
  }

  return "ready";
}

export function redirectForAdminAuth(pathname: string, status: AdminAuthStatus): string | null {
  if (status === "unauthenticated") {
    clearAuth();
    return `/login?redirect=${encodeURIComponent(pathname)}`;
  }

  if (status === "setup_required") {
    return ONBOARDING_PATH;
  }

  if (status === "forbidden") {
    return "/admin/products";
  }

  if (pathname === ONBOARDING_PATH && !mustCompleteSetup()) {
    return "/admin";
  }

  return null;
}
