import { NextRequest, NextResponse } from "next/server";
import { ensureIndexes, getSuppliersCollection } from "@/lib/server/db";
import { SupplierDocument } from "@/lib/server/models";
import {
  isNextResponse,
  jsonError,
  requireStaff,
  requireAuth,
} from "@/lib/server/auth-middleware";
import { listSuppliers, resolveSupplier } from "@/lib/server/suppliers";

type CreateSupplierBody = {
  name?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  notes?: string;
  link?: string;
};

export async function GET(request: NextRequest) {
  const auth = requireStaff(requireAuth(request));
  if (isNextResponse(auth)) return auth;

  try {
    await ensureIndexes();
    const collection = await getSuppliersCollection<SupplierDocument>();
    const suppliers = await listSuppliers(collection);
    return NextResponse.json({ suppliers });
  } catch {
    return jsonError("Failed to fetch suppliers", 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = requireStaff(requireAuth(request));
  if (isNextResponse(auth)) return auth;

  try {
    await ensureIndexes();
    const body = (await request.json()) as CreateSupplierBody;
    const collection = await getSuppliersCollection<SupplierDocument>();
    const supplier = await resolveSupplier(collection, body);

    if (!supplier) {
      return jsonError("El nombre del proveedor es obligatorio", 400);
    }

    return NextResponse.json({ supplier }, { status: 201 });
  } catch {
    return jsonError("Failed to create supplier", 500);
  }
}
