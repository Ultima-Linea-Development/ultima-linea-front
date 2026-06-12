import { NextRequest, NextResponse } from "next/server";
import { ensureIndexes, getExternalSellersCollection } from "@/lib/server/db";
import { ExternalSellerDocument } from "@/lib/server/models";
import {
  isNextResponse,
  jsonError,
  requireAuth,
  requireStaff,
} from "@/lib/server/auth-middleware";
import { listExternalSellers } from "@/lib/server/external-sellers";

export async function GET(request: NextRequest) {
  const auth = requireStaff(requireAuth(request));
  if (isNextResponse(auth)) return auth;

  try {
    await ensureIndexes();
    const collection = await getExternalSellersCollection<ExternalSellerDocument>();
    const sellers = await listExternalSellers(collection);

    return NextResponse.json({
      sellers: sellers.map((seller) => ({
        id: seller.id,
        name: seller.name,
        created_at: seller.created_at,
        updated_at: seller.updated_at,
      })),
    });
  } catch {
    return jsonError("Failed to fetch external sellers", 500);
  }
}
