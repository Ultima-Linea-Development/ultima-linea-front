import type { Sale, SaleLineItem } from "@/lib/server/models";
import type { SaleDocument } from "@/lib/server/models";
import { saleFromDoc } from "@/lib/server/models";

export function getSaleLineItemsFromDoc(doc: SaleDocument): SaleLineItem[] {
  const sale = saleFromDoc(doc);

  if (sale.items && sale.items.length > 0) {
    return sale.items;
  }

  if (!sale.product_id || !sale.product_name) {
    return [];
  }

  const quantity = sale.quantity ?? 0;
  const unitPrice = sale.unit_price ?? 0;

  return [
    {
      product_id: sale.product_id,
      product_name: sale.product_name,
      product_sku: sale.product_sku,
      size: sale.size ?? "",
      quantity,
      unit_price: unitPrice,
      total: sale.total ?? unitPrice * quantity,
    },
  ];
}

export function normalizeSaleForResponse(doc: SaleDocument): Sale {
  const sale = saleFromDoc(doc);
  const items = getSaleLineItemsFromDoc(doc);
  const total = items.reduce((sum, item) => sum + item.total, 0);

  return {
    id: sale.id,
    items,
    total,
    created_by: sale.created_by,
    external_seller_id: sale.external_seller_id,
    external_seller_name: sale.external_seller_name,
    transfer_alias: sale.transfer_alias,
    description: sale.description,
    created_at: sale.created_at,
    updated_at: sale.updated_at,
  };
}
