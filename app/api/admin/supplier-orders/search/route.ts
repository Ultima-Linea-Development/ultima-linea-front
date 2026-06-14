import { NextRequest, NextResponse } from "next/server";
import { ensureIndexes, getSupplierOrdersCollection } from "@/lib/server/db";
import { SupplierOrderDocument } from "@/lib/server/models";
import {
  isNextResponse,
  jsonError,
  requireStaff,
  requireAuth,
} from "@/lib/server/auth-middleware";
import { buildAdminSupplierOrdersSearchTextMatch } from "@/lib/admin-supplier-orders-search";
import { normalizeSupplierOrderForResponse } from "@/lib/server/supplier-orders";

const MAX_SEARCH_RESULTS = 500;

export async function GET(request: NextRequest) {
  const auth = requireStaff(requireAuth(request));
  if (isNextResponse(auth)) return auth;

  try {
    await ensureIndexes();

    const q = request.nextUrl.searchParams.get("q")?.trim();
    if (!q) {
      return jsonError("Search query parameter 'q' is required", 400);
    }

    const collection = await getSupplierOrdersCollection<SupplierOrderDocument>();
    const searchFilter = buildAdminSupplierOrdersSearchTextMatch(q);
    const total = await collection.countDocuments(searchFilter);
    const docs = await collection
      .find(searchFilter)
      .sort({ created_at: -1, _id: -1 })
      .limit(MAX_SEARCH_RESULTS)
      .toArray();

    return NextResponse.json({
      query: q,
      total,
      results: docs.map(normalizeSupplierOrderForResponse),
    });
  } catch {
    return jsonError("Failed to search supplier orders", 500);
  }
}
