import { NextRequest, NextResponse } from "next/server";
import { ensureIndexes, getUsersCollection } from "@/lib/server/db";
import { UserDocument, userFromDoc } from "@/lib/server/models";
import { generateToken } from "@/lib/server/jwt";
import { hashPassword } from "@/lib/server/password";
import {
  isNextResponse,
  jsonError,
  requireAuth,
  requireStaff,
} from "@/lib/server/auth-middleware";

const MIN_PASSWORD_LENGTH = 8;

type CompleteSetupBody = {
  password?: string;
  phone?: string;
};

export async function POST(request: NextRequest) {
  const auth = requireStaff(requireAuth(request), { skipSetupCheck: true });
  if (isNextResponse(auth)) return auth;

  try {
    await ensureIndexes();

    const body = (await request.json()) as CompleteSetupBody;
    const password = body.password ?? "";
    const phone = body.phone?.trim() ?? "";

    if (password.length < MIN_PASSWORD_LENGTH) {
      return jsonError(
        `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
        400
      );
    }

    const collection = await getUsersCollection<UserDocument>();
    const doc = await collection.findOne({ _id: auth.user_id });

    if (!doc) {
      return jsonError("User not found", 404);
    }

    if (!doc.must_change_password) {
      return jsonError("La configuración inicial ya fue completada", 400);
    }

    const hashedPassword = await hashPassword(password);
    const now = new Date();
    const updateFields: Record<string, unknown> = {
      password: hashedPassword,
      must_change_password: false,
      updated_at: now,
    };

    if (phone) {
      updateFields.phone = phone;
    }

    await collection.updateOne({ _id: auth.user_id }, { $set: updateFields });

    const updatedDoc = await collection.findOne({ _id: auth.user_id });
    if (!updatedDoc) {
      return jsonError("Failed to fetch updated user", 500);
    }

    const user = userFromDoc(updatedDoc);
    const token = generateToken(user.id, user.email, user.role, false);
    const { password: _, ...safeUser } = user;

    return NextResponse.json({ token, user: safeUser });
  } catch {
    return jsonError("Failed to complete setup", 500);
  }
}
