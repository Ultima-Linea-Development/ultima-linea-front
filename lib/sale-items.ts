import type { Sale, SaleLineItem } from "@/lib/api";

type LegacySaleFields = {
  product_id?: string;
  product_name?: string;
  product_sku?: string;
  size?: string;
  quantity?: number;
  unit_price?: number;
  total?: number;
  items?: SaleLineItem[];
};

export function getSaleLineItems(sale: LegacySaleFields): SaleLineItem[] {
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

export function getSaleTotal(sale: LegacySaleFields): number {
  if (typeof sale.total === "number" && sale.total > 0) {
    return sale.total;
  }

  return getSaleLineItems(sale).reduce((sum, item) => sum + item.total, 0);
}

export function getSalePrimaryLineItem(sale: LegacySaleFields): SaleLineItem | null {
  return getSaleLineItems(sale)[0] ?? null;
}

export function formatSaleProductsLabel(sale: LegacySaleFields): string {
  const items = getSaleLineItems(sale);
  if (items.length === 0) return "—";
  if (items.length === 1) return items[0].product_name;

  return `${items[0].product_name} (+${items.length - 1})`;
}

export function formatSaleSizesLabel(sale: LegacySaleFields): string {
  const items = getSaleLineItems(sale);
  if (items.length === 0) return "—";

  const sizes = [...new Set(items.map((item) => item.size).filter(Boolean))];
  if (sizes.length === 0) return "—";
  if (sizes.length === 1) return sizes[0];

  return sizes.join(", ");
}

export function getSaleQuantityTotal(sale: LegacySaleFields): number {
  return getSaleLineItems(sale).reduce((sum, item) => sum + item.quantity, 0);
}

export function saleMatchesQuery(sale: Sale, query: string): boolean {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return false;

  const saleValues = [sale.external_seller_name, sale.transfer_alias, sale.description];
  if (saleValues.some((value) => value?.toLocaleLowerCase().includes(normalized))) {
    return true;
  }

  return getSaleLineItems(sale).some((item) => {
    const values = [item.product_name, item.product_sku, item.size];
    return values.some((value) => value?.toLocaleLowerCase().includes(normalized));
  });
}