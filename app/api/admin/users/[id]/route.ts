import { NextRequest, NextResponse } from "next/server";
import { ensureIndexes, getUsersCollection } from "@/lib/server/db";
import { UserDocument, userFromDoc } from "@/lib/server/models";
import { getPrimaryAdminId, isPrimaryAdmin } from "@/lib/server/users";
import {
  isNextResponse,
  jsonError,
  requireAdmin,
  requireAuth,
} from "@/lib/server/auth-middleware";

type RouteContext = { params: Promise<{ id: string }> };

type UpdateUserBody = {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: string;
};

const ALLOWED_ROLES = new Set(["admin", "vendedor"]);

function toSafeUser(doc: UserDocument, primaryAdminId: string | null) {
  const { password: _, ...safeUser } = userFromDoc(doc);
  return {
    ...safeUser,
    is_primary_admin: primaryAdminId !== null && doc._id === primaryAdminId,
  };
}

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = requireAdmin(requireAuth(request));
  if (isNextResponse(auth)) return auth;

  try {
    await ensureIndexes();

    const { id } = await context.params;
    const collection = await getUsersCollection<UserDocument>();
    const doc = await collection.findOne({ _id: id });

    if (!doc) {
      return jsonError("User not found", 404);
    }

    const primaryAdminId = await getPrimaryAdminId();
    return NextResponse.json(toSafeUser(doc, primaryAdminId));
  } catch {
    return jsonError("Failed to fetch user", 500);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const auth = requireAdmin(requireAuth(request));
  if (isNextResponse(auth)) return auth;

  try {
    await ensureIndexes();

    const { id } = await context.params;
    const body = (await request.json()) as UpdateUserBody;
    const email = body.email?.trim().toLowerCase();
    const firstName = body.first_name?.trim();
    const lastName = body.last_name?.trim();
    const phone = body.phone?.trim() ?? "";
    const role = body.role?.trim().toLowerCase() || "admin";

    if (!email) return jsonError("El email es obligatorio", 400);
    if (!firstName) return jsonError("El nombre es obligatorio", 400);
    if (!lastName) return jsonError("El apellido es obligatorio", 400);
    if (!ALLOWED_ROLES.has(role)) {
      return jsonError("Rol inválido", 400);
    }

    const collection = await getUsersCollection<UserDocument>();
    const current = await collection.findOne({ _id: id });
    if (!current) {
      return jsonError("User not found", 404);
    }

    const duplicate = await collection.findOne({ email, _id: { $ne: id } });
    if (duplicate) {
      return jsonError("Un usuario con este email ya existe", 409);
    }

    const setFields: Record<string, unknown> = {
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
      role,
      updated_at: new Date(),
    };

    const result = await collection.updateOne({ _id: id }, { $set: setFields });
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
    return jsonError("Failed to update user", 500);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const auth = requireAdmin(requireAuth(_request));
  if (isNextResponse(auth)) return auth;

  try {
    await ensureIndexes();

    const { id } = await context.params;
    if (await isPrimaryAdmin(id)) {
      return jsonError("No se puede eliminar al administrador original", 403);
    }

    const collection = await getUsersCollection<UserDocument>();
    const result = await collection.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return jsonError("User not found", 404);
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch {
    return jsonError("Failed to delete user", 500);
  }
}
