import type { Product } from "@/lib/api";

export const DEFAULT_SALE_UNIT_DISCOUNT = "5000";

type DiscountableSaleItem = {
  product: Pick<Product, "price">;
  quantity: string;
};

export function getSaleDraftTotalQuantity(items: Pick<DiscountableSaleItem, "quantity">[]): number {
  return items.reduce((sum, item) => {
    const quantity = Number(item.quantity);
    return Number.isFinite(quantity) && quantity > 0 ? sum + quantity : sum;
  }, 0);
}

export function applySaleUnitDiscount<T extends Pick<DiscountableSaleItem, "product">>(
  items: T[],
  discountValue: string
): (T & { unitPrice: string })[] {
  const discount = Math.max(0, Number(discountValue) || 0);

  return items.map((item) => ({
    ...item,
    unitPrice: String(Math.max(0, item.product.price - discount)),
  }));
}

export function restoreSaleCatalogPrices<T extends Pick<DiscountableSaleItem, "product">>(
  items: T[]
): (T & { unitPrice: string })[] {
  return items.map((item) => ({
    ...item,
    unitPrice: String(Math.max(0, item.product.price)),
  }));
}
