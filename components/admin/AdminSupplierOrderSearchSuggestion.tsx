"use client";

import Typography from "@/components/ui/Typography";
import AdminSearchSuggestionRow from "@/components/admin/AdminSearchSuggestionRow";
import AdminSupplierOrderStatusBadge from "@/components/admin/AdminSupplierOrderStatusBadge";
import type { Product, SupplierOrder } from "@/lib/api";
import { getProductImageUrlById, getProductPrimaryImageUrl } from "@/lib/admin-product-image";
import { getSupplierOrderLabel } from "@/lib/supplier-order-display";

type AdminSupplierOrderSearchSuggestionProps = {
  order: SupplierOrder;
  products?: Product[];
};

function getSupplierOrderPreviewImageUrl(
  order: SupplierOrder,
  products: Product[]
): string | undefined {
  for (const item of order.items) {
    const imageById = getProductImageUrlById(products, item.product_id);
    if (imageById) return imageById;

    const matchedByName = products.find(
      (product) => product.name.toLocaleLowerCase() === item.shirt_name.toLocaleLowerCase()
    );
    const imageByName = getProductPrimaryImageUrl(matchedByName);
    if (imageByName) return imageByName;
  }

  return undefined;
}

export default function AdminSupplierOrderSearchSuggestion({
  order,
  products = [],
}: AdminSupplierOrderSearchSuggestionProps) {
  const itemCount = order.items.length;
  const quantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AdminSearchSuggestionRow
      imageUrl={getSupplierOrderPreviewImageUrl(order, products)}
      trailing={`${itemCount} ${itemCount === 1 ? "ítem" : "ítems"} · ${quantity} uds.`}
    >
      <Typography variant="body2" as="span" className="block truncate">
        {getSupplierOrderLabel(order)}
      </Typography>
      <Typography variant="caption" color="muted" as="span" className="block truncate">
        <AdminSupplierOrderStatusBadge status={order.status} size="sm" />
      </Typography>
    </AdminSearchSuggestionRow>
  );
}
