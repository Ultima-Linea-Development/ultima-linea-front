import { NextRequest, NextResponse } from "next/server";
import { ensureIndexes, getUsersCollection } from "@/lib/server/db";
import { UserDocument, userFromDoc } from "@/lib/server/models";
import {
  isNextResponse,
  jsonError,
  requireAdmin,
  requireAuth,
} from "@/lib/server/auth-middleware";
import { getPrimaryAdminId } from "@/lib/server/users";
import { buildAdminUsersSearchTextMatch } from "@/lib/admin-users-search";

const MAX_SEARCH_RESULTS = 500;

export async function GET(request: NextRequest) {
  const auth = requireAdmin(requireAuth(request));
  if (isNextResponse(auth)) return auth;

  try {
    await ensureIndexes();

    const q = request.nextUrl.searchParams.get("q")?.trim();
    if (!q) {
      return jsonError("Search query parameter 'q' is required", 400);
    }

    const collection = await getUsersCollection<UserDocument>();
    const searchFilter = buildAdminUsersSearchTextMatch(q);
    const total = await collection.countDocuments(searchFilter);
    const docs = await collection
      .find(searchFilter)
      .sort({ created_at: 1, _id: 1 })
      .limit(MAX_SEARCH_RESULTS)
      .toArray();

    const primaryAdminId = await getPrimaryAdminId();
    const results = docs.map((doc) => {
      const { password: _, ...safeUser } = userFromDoc(doc);
      return {
        ...safeUser,
        is_primary_admin: primaryAdminId !== null && doc._id === primaryAdminId,
      };
    });

    return NextResponse.json({
      query: q,
      total,
      results,
    });
  } catch {
    return jsonError("Failed to search users", 500);
  }
}
