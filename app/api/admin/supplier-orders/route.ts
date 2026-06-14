import { NextRequest, NextResponse } from "next/server";
import {
  ensureIndexes,
  getSupplierOrdersCollection,
  getSuppliersCollection,
} from "@/lib/server/db";
import {
  SupplierDocument,
  SupplierOrder,
  SupplierOrderDocument,
  generateULID,
  supplierOrderToDoc,
} from "@/lib/server/models";
import {
  isNextResponse,
  jsonError,
  requireStaff,
  requireAuth,
} from "@/lib/server/auth-middleware";
import { resolveSupplier } from "@/lib/server/suppliers";
import {
  normalizeSupplierOrderForResponse,
  parseSupplierOrderLineItems,
  parseSupplierOrderStatus,
  type SupplierOrderLineItemInput,
} from "@/lib/server/supplier-orders";

type CreateSupplierOrderBody = {
  name?: string;
  supplier_id?: string;
  supplier_name?: string;
  supplier_contact_name?: string;
  supplier_email?: string;
  supplier_phone?: string;
  supplier_notes?: string;
  supplier_link?: string;
  status?: string;
  notes?: string;
  items?: SupplierOrderLineItemInput[];
};

function trimOptional(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

export async function GET(request: NextRequest) {
  const auth = requireStaff(requireAuth(request));
  if (isNextResponse(auth)) return auth;

  try {
    await ensureIndexes();

    const { searchParams } = request.nextUrl;
    let page = parseInt(searchParams.get("page") || "1", 10);
    let perPage = parseInt(searchParams.get("per_page") || "10", 10);

    if (Number.isNaN(page) || page < 1) page = 1;
    if (Number.isNaN(perPage) || perPage < 1) perPage = 10;
    if (perPage > 50) perPage = 50;

    const collection = await getSupplierOrdersCollection<SupplierOrderDocument>();
    const total = await collection.countDocuments({});
    const skip = (page - 1) * perPage;
    const docs = await collection
      .find({})
      .sort({ created_at: -1, _id: -1 })
      .skip(skip)
      .limit(perPage)
      .toArray();

    return NextResponse.json({
      orders: docs.map(normalizeSupplierOrderForResponse),
      page,
      per_page: perPage,
      total,
      total_pages: Math.ceil(total / perPage),
    });
  } catch {
    return jsonError("Failed to fetch supplier orders", 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = requireStaff(requireAuth(request));
  if (isNextResponse(auth)) return auth;

  try {
    await ensureIndexes();

    const body = (await request.json()) as CreateSupplierOrderBody;
    const name = body.name?.trim();
    if (!name) {
      return jsonError("El nombre del pedido es obligatorio", 400);
    }

    const itemsResult = parseSupplierOrderLineItems(body.items);
    if ("error" in itemsResult) {
      return jsonError(itemsResult.error, 400);
    }

    const status = parseSupplierOrderStatus(body.status) ?? "draft";
    const suppliers = await getSuppliersCollection<SupplierDocument>();
    const supplier = await resolveSupplier(suppliers, {
      id: body.supplier_id,
      name: body.supplier_name,
      contact_name: body.supplier_contact_name,
      email: body.supplier_email,
      phone: body.supplier_phone,
      notes: body.supplier_notes,
      link: body.supplier_link,
    });

    const now = new Date();
    const order: SupplierOrder = {
      id: generateULID(),
      name,
      ...(supplier
        ? {
            supplier_id: supplier.id,
            supplier_name: supplier.name,
          }
        : {}),
      status,
      notes: trimOptional(body.notes),
      items: itemsResult.items,
      created_by: auth.user_id,
      created_at: now,
      updated_at: now,
    };

    const collection = await getSupplierOrdersCollection<SupplierOrderDocument>();
    await collection.insertOne(supplierOrderToDoc(order));

    return NextResponse.json(
      { order: normalizeSupplierOrderForResponse(order) },
      { status: 201 }
    );
  } catch {
    return jsonError("Failed to create supplier order", 500);
  }
}
