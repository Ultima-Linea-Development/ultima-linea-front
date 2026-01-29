type TokenPayload = {
  user_id: string;
  email: string;
  role: string;
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
  } catch (error) {
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
  const user = getUserFromToken();
  return user?.role === "admin";
}

export function clearAuth(): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
