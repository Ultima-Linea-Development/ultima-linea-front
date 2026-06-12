import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { ensureIndexes, getUsersCollection } from "@/lib/server/db";
import { UserDocument, userFromDoc } from "@/lib/server/models";
import { hashPassword } from "@/lib/server/password";
import { getPrimaryAdminId } from "@/lib/server/users";
import {
  isNextResponse,
  jsonError,
  requireAdmin,
  requireAuth,
} from "@/lib/server/auth-middleware";

type CreateUserBody = {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  password?: string;
  role?: string;
};

const ALLOWED_ROLES = new Set(["admin", "vendedor"]);

export async function GET(request: NextRequest) {
  const auth = requireAdmin(requireAuth(request));
  if (isNextResponse(auth)) return auth;

  try {
    await ensureIndexes();

    const { searchParams } = request.nextUrl;
    let page = parseInt(searchParams.get("page") || "1", 10);
    let perPage = parseInt(searchParams.get("per_page") || "10", 10);

    if (Number.isNaN(page) || page < 1) page = 1;
    if (Number.isNaN(perPage) || perPage < 1) perPage = 10;
    if (perPage > 50) perPage = 50;

    const collection = await getUsersCollection<UserDocument>();
    const total = await collection.countDocuments({});
    const skip = (page - 1) * perPage;

    const docs = await collection
      .find({})
      .sort({ created_at: 1, _id: 1 })
      .skip(skip)
      .limit(perPage)
      .toArray();

    const primaryAdminId = await getPrimaryAdminId();
    const users = docs.map((doc) => {
      const { password: _, ...safeUser } = userFromDoc(doc);
      return {
        ...safeUser,
        is_primary_admin: primaryAdminId !== null && doc._id === primaryAdminId,
      };
    });

    return NextResponse.json({
      users,
      page,
      per_page: perPage,
      total,
      total_pages: Math.ceil(total / perPage),
    });
  } catch {
    return jsonError("Failed to fetch users", 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAdmin(requireAuth(request));
  if (isNextResponse(auth)) return auth;

  try {
    await ensureIndexes();

    const body = (await request.json()) as CreateUserBody;
    const email = body.email?.trim().toLowerCase();
    const firstName = body.first_name?.trim();
    const lastName = body.last_name?.trim();
    const phone = body.phone?.trim() ?? "";
    const password = body.password ?? "";
    const role = body.role?.trim().toLowerCase() || "admin";

    if (!email) return jsonError("El email es obligatorio", 400);
    if (!firstName) return jsonError("El nombre es obligatorio", 400);
    if (!lastName) return jsonError("El apellido es obligatorio", 400);
    if (password.length < 6) {
      return jsonError("La contraseña debe tener al menos 6 caracteres", 400);
    }
    if (!ALLOWED_ROLES.has(role)) {
      return jsonError("Rol inválido", 400);
    }

    const collection = await getUsersCollection<UserDocument>();
    const existing = await collection.findOne({ email });
    if (existing) {
      return jsonError("Un usuario con este email ya existe", 409);
    }

    const now = new Date();
    const hashedPassword = await hashPassword(password);

    const doc: UserDocument = {
      _id: randomUUID(),
      email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      phone,
      role,
      must_change_password: true,
      created_at: now,
      updated_at: now,
    };

    await collection.insertOne(doc);

    const { password: _, ...safeUser } = userFromDoc(doc);
    return NextResponse.json(safeUser, { status: 201 });
  } catch {
    return jsonError("Failed to create user", 500);
  }
}
