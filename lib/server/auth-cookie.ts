import { cookies } from "next/headers";
import { decodeToken, isTokenExpired } from "@/lib/auth";

export async function getRoleFromAuthCookie(): Promise<string | null> {
  const token = (await cookies()).get("token")?.value;

  if (!token || isTokenExpired(token)) {
    return null;
  }

  return decodeToken(token)?.role ?? null;
}
