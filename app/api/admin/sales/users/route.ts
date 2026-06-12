import { NextRequest, NextResponse } from "next/server";
import { ensureIndexes } from "@/lib/server/db";
import {
  isNextResponse,
  jsonError,
  requireAuth,
  requireStaff,
} from "@/lib/server/auth-middleware";
import { getAssignableStaffUsers } from "@/lib/server/users";

export async function GET(request: NextRequest) {
  const auth = requireStaff(requireAuth(request));
  if (isNextResponse(auth)) return auth;

  try {
    await ensureIndexes();
    const users = await getAssignableStaffUsers();
    return NextResponse.json({ users });
  } catch {
    return jsonError("Failed to fetch users", 500);
  }
}
