import { NextRequest, NextResponse } from "next/server";
import {
  ensureIndexes,
  getCommissionsCollection,
  getProductsCollection,
  getSupplierOrdersCollection,
} from "@/lib/server/db";
import {
  CommissionDocument,
  ProductDocument,
  SupplierOrderDocument,
  supplierOrderFromDoc,
} from "@/lib/server/models";
import {
  isNextResponse,
  jsonError,
  requireStaff,
  requireAuth,
} from "@/lib/server/auth-middleware";
import {
  appendCommissionToSupplierOrder,
  normalizeCommissionForResponse,
} from "@/lib/server/commissions";
import { normalizeSupplierOrderForResponse } from "@/lib/server/supplier-orders";
import { syncProductReservationsFromItems } from "@/lib/server/product-reservation";

type RouteContext = { params: Promise<{ id: string }> };

type ExportCommissionBody = {
  supplier_order_id?: string;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const auth = requireStaff(requireAuth(request));
  if (isNextResponse(auth)) return auth;

  try {
    await ensureIndexes();
    const { id } = await context.params;
    const body = (await request.json()) as ExportCommissionBody;
    const supplierOrderId = body.supplier_order_id?.trim();

    if (!supplierOrderId) {
      return jsonError("Seleccioná un pedido", 400);
    }

    const commissions = await getCommissionsCollection<CommissionDocument>();
    const commissionDoc = await commissions.findOne({ _id: id });

    if (!commissionDoc) {
      return jsonError("Encargo no encontrado", 404);
    }

    const commission = normalizeCommissionForResponse(commissionDoc);

    if (commission.status === "exported") {
      return jsonError("Este encargo ya fue exportado", 400);
    }

    if (commission.status === "cancelled") {
      return jsonError("No se puede exportar un encargo cancelado", 400);
    }

    const orders = await getSupplierOrdersCollection<SupplierOrderDocument>();
    const orderDoc = await orders.findOne({ _id: supplierOrderId });

    if (!orderDoc) {
      return jsonError("Pedido no encontrado", 404);
    }

    const order = supplierOrderFromDoc(orderDoc);
    const updatedOrder = appendCommissionToSupplierOrder(order, commission);

    await orders.updateOne(
      { _id: supplierOrderId },
      {
        $set: {
          items: updatedOrder.items,
          notes: updatedOrder.notes,
          updated_at: updatedOrder.updated_at,
        },
      }
    );

    const products = await getProductsCollection<ProductDocument>();
    await syncProductReservationsFromItems(products, updatedOrder.items);

    const now = new Date();
    const updatedCommissionDoc = await commissions.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          status: "exported",
          supplier_order_id: supplierOrderId,
          supplier_order_name: order.name,
          updated_at: now,
        },
      },
      { returnDocument: "after" }
    );

    if (!updatedCommissionDoc) {
      return jsonError("Encargo no encontrado", 404);
    }

    return NextResponse.json({
      commission: normalizeCommissionForResponse(updatedCommissionDoc),
      order: normalizeSupplierOrderForResponse(updatedOrder),
    });
  } catch {
    return jsonError("Failed to export commission", 500);
  }
}
