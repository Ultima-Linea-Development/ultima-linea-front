import { NextRequest, NextResponse } from "next/server";
import { ensureIndexes, getSuppliersCollection } from "@/lib/server/db";
import { SupplierDocument } from "@/lib/server/models";
import {
  isNextResponse,
  jsonError,
  requireStaff,
  requireAuth,
} from "@/lib/server/auth-middleware";
import { updateSupplier } from "@/lib/server/suppliers";

type RouteContext = { params: Promise<{ id: string }> };

type UpdateSupplierBody = {
  name?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  notes?: string;
  link?: string;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  const auth = requireStaff(requireAuth(request));
  if (isNextResponse(auth)) return auth;

  try {
    await ensureIndexes();
    const { id } = await context.params;
    const body = (await request.json()) as UpdateSupplierBody;
    const collection = await getSuppliersCollection<SupplierDocument>();
    const supplier = await updateSupplier(collection, id, body);

    if (!supplier) {
      return jsonError("Proveedor no encontrado o nombre inválido", 404);
    }

    return NextResponse.json({ supplier });
  } catch {
    return jsonError("Failed to update supplier", 500);
  }
}
