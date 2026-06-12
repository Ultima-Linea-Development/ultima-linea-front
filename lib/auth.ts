import { isAdminRole, isStaffRole } from "@/lib/roles";

import type { AuthUser } from "@/lib/api";

type TokenPayload = {
  user_id: string;
  email: string;
  role: string;
  must_change_password?: boolean;
  exp: number;
  iat: number;
};

export function decodeToken(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    
    const decoded = atob(base64);
    const parsed = JSON.parse(decoded);

    // Si user_id es un objeto o está mal formado, intentar convertirlo a string
    if (parsed.user_id && typeof parsed.user_id !== "string") {
      if (typeof parsed.user_id === "object" && parsed.user_id.$oid) {
        parsed.user_id = parsed.user_id.$oid;
      } else {
        parsed.user_id = String(parsed.user_id);
      }
    }

    return parsed as TokenPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return true;
  }

  const expirationTime = payload.exp * 1000;
  return Date.now() >= expirationTime;
}

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("token");
}

export function getUserFromToken(): TokenPayload | null {
  const token = getToken();
  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    return null;
  }

  return decodeToken(token);
}

export function isAdmin(): boolean {
  return isAdminRole(getUserFromToken()?.role);
}

export function isStaff(): boolean {
  return isStaffRole(getUserFromToken()?.role);
}

export function getCurrentUserId(): string | null {
  return getUserFromToken()?.user_id ?? null;
}

export function clearAuth(): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem("user");
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem("user", JSON.stringify(user));
}

export function setAuthSession(token: string, user: AuthUser): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem("token", token);
  setStoredUser(user);
  document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
}

export function mustCompleteSetup(): boolean {
  const tokenUser = getUserFromToken();
  if (tokenUser?.must_change_password) {
    return true;
  }

  return getStoredUser()?.must_change_password === true;
}

export const ONBOARDING_PATH = "/admin/onboarding";
