"use client";

import Typography from "@/components/ui/Typography";
import AdminSearchSuggestionRow from "@/components/admin/AdminSearchSuggestionRow";
import AdminCommissionStatusBadge from "@/components/admin/AdminCommissionStatusBadge";
import type { Commission, Product, SaleAssignableUser } from "@/lib/api";
import { getProductImageUrlById } from "@/lib/admin-product-image";
import {
  getCommissionLabel,
  getCommissionSellerLabel,
} from "@/lib/commission-display";

type AdminCommissionSearchSuggestionProps = {
  commission: Commission;
  products?: Product[];
  assignableUsers?: SaleAssignableUser[];
};

function getCommissionPreviewImageUrl(
  commission: Commission,
  products: Product[]
): string | undefined {
  for (const item of commission.items) {
    const imageById = getProductImageUrlById(products, item.product_id);
    if (imageById) return imageById;
  }

  return undefined;
}

export default function AdminCommissionSearchSuggestion({
  commission,
  products = [],
  assignableUsers = [],
}: AdminCommissionSearchSuggestionProps) {
  const itemCount = commission.items.length;

  return (
    <AdminSearchSuggestionRow
      imageUrl={getCommissionPreviewImageUrl(commission, products)}
      trailing={
        <span className="inline-flex items-center gap-2">
          <AdminCommissionStatusBadge status={commission.status} size="sm" />
          <span>
            {itemCount} {itemCount === 1 ? "producto" : "productos"}
          </span>
        </span>
      }
    >
      <Typography variant="body2" as="span" className="block truncate">
        {getCommissionLabel(commission)}
      </Typography>
      <Typography variant="caption" color="muted" as="span" className="block truncate">
        {getCommissionSellerLabel(commission, assignableUsers)}
      </Typography>
    </AdminSearchSuggestionRow>
  );
}
