import { NextRequest, NextResponse } from "next/server";
import { ensureIndexes, getUsersCollection } from "@/lib/server/db";
import { UserDocument, userFromDoc } from "@/lib/server/models";
import { getPrimaryAdminId } from "@/lib/server/users";
import {
  isNextResponse,
  jsonError,
  requireAdmin,
  requireAuth,
} from "@/lib/server/auth-middleware";

type RouteContext = { params: Promise<{ id: string }> };

function toSafeUser(doc: UserDocument, primaryAdminId: string | null) {
  const { password: _, ...safeUser } = userFromDoc(doc);
  return {
    ...safeUser,
    is_primary_admin: primaryAdminId !== null && doc._id === primaryAdminId,
  };
}

export async function POST(_request: NextRequest, context: RouteContext) {
  const auth = requireAdmin(requireAuth(_request));
  if (isNextResponse(auth)) return auth;

  try {
    await ensureIndexes();

    const { id } = await context.params;
    const collection = await getUsersCollection<UserDocument>();
    const current = await collection.findOne({ _id: id });

    if (!current) {
      return jsonError("User not found", 404);
    }

    if (current.must_change_password) {
      return jsonError("El usuario ya debe cambiar su contraseña", 400);
    }

    const now = new Date();
    const result = await collection.updateOne(
      { _id: id },
      {
        $set: {
          must_change_password: true,
          updated_at: now,
        },
      }
    );

    if (result.matchedCount === 0) {
      return jsonError("User not found", 404);
    }

    const updated = await collection.findOne({ _id: id });
    if (!updated) {
      return jsonError("Failed to fetch updated user", 500);
    }

    const primaryAdminId = await getPrimaryAdminId();
    return NextResponse.json(toSafeUser(updated, primaryAdminId));
  } catch {
    return jsonError("Failed to request password change", 500);
  }
}
