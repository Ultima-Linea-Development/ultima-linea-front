import type { Product } from "@/lib/api";
import type { SizeStockRow } from "@/lib/product-inventory";
import { getProductReservedSizeEntries } from "@/lib/product-reservation";
import {
  reservationSellerFieldsFromFormValue,
  sellerFormValueFromReservationFields,
} from "@/lib/reservation-seller";
import { validateSaleSellerValue } from "@/lib/sale-seller";
import {
  draftHasSizeReservations,
  getMaxReservationQuantityForRow,
  reservationEntriesFromRows,
  type SupplierOrderSizeQuantityRow,
  type SupplierOrderSizeReservationRow,
  validateReservationRowsSellerConsistency,
  emptySizeReservationRow,
} from "@/lib/supplier-order-sizes";

export function stockRowsToOrderSizeRows(rows: SizeStockRow[]): SupplierOrderSizeQuantityRow[] {
  return rows
    .map((row) => {
      const size = row.size.trim();
      const stock = Number(row.stock);
      if (!size || Number.isNaN(stock) || stock <= 0) return null;

      return {
        id: row.id,
        size,
        quantity: String(Math.floor(stock)),
      };
    })
    .filter((row): row is SupplierOrderSizeQuantityRow => row !== null);
}

export function productHasCatalogReservations(product: Product): boolean {
  return getProductReservedSizeEntries(product).length > 0;
}

export function reservationRowsFromProduct(
  product: Product,
  currentUserId: string | null
): SupplierOrderSizeReservationRow[] {
  const stockBySizes = product.stock_by_sizes ?? {};

  return getProductReservedSizeEntries(product).map(({ size, reservation }) => ({
    ...emptySizeReservationRow(currentUserId),
    size,
    quantity: String(Math.max(1, stockBySizes[size] ?? 1)),
    reservationSellerValue: sellerFormValueFromReservationFields(reservation, currentUserId),
  }));
}

export function reservedBySizesFromCatalogReservationRows(
  reservationRows: SupplierOrderSizeReservationRow[],
  stockRows: SizeStockRow[],
  canAssignUser: boolean
): Record<
  string,
  {
    reserved_for_user_id?: string;
    reserved_for_external_seller_id?: string;
    reserved_for_external_seller_name?: string;
  }
> {
  const orderSizeRows = stockRowsToOrderSizeRows(stockRows);
  const entries = reservationEntriesFromRows(reservationRows, orderSizeRows, (row) =>
    reservationSellerFieldsFromFormValue(row.reservationSellerValue, canAssignUser)
  );

  const reservedBySizes: Record<
    string,
    {
      reserved_for_user_id?: string;
      reserved_for_external_seller_id?: string;
      reserved_for_external_seller_name?: string;
    }
  > = {};

  for (const entry of entries) {
    reservedBySizes[entry.size] = {
      ...(entry.reserved_for_user_id
        ? { reserved_for_user_id: entry.reserved_for_user_id }
        : {}),
      ...(entry.reserved_for_external_seller_id
        ? { reserved_for_external_seller_id: entry.reserved_for_external_seller_id }
        : {}),
      ...(entry.reserved_for_external_seller_name
        ? { reserved_for_external_seller_name: entry.reserved_for_external_seller_name }
        : {}),
    };
  }

  return reservedBySizes;
}

export function validateProductCatalogReservations(
  reserveEnabled: boolean,
  reservationRows: SupplierOrderSizeReservationRow[],
  stockRows: SizeStockRow[],
  canAssignUser: boolean
): string | null {
  if (!reserveEnabled) return null;

  const orderSizeRows = stockRowsToOrderSizeRows(stockRows);
  if (orderSizeRows.length === 0) {
    return "Cargá stock por talle para definir reservas.";
  }

  const sellerConsistencyError = validateReservationRowsSellerConsistency(reservationRows);
  if (sellerConsistencyError) return sellerConsistencyError;

  if (!draftHasSizeReservations(true, reservationRows, orderSizeRows)) {
    return "Agregá al menos un talle para reservar.";
  }

  for (const row of reservationRows) {
    const size = row.size.trim();
    const quantity = Number(row.quantity);
    if (!size || !Number.isInteger(quantity) || quantity <= 0) continue;

    const maxQuantity = getMaxReservationQuantityForRow(row, reservationRows, orderSizeRows);
    if (maxQuantity <= 0) {
      return `El talle ${size} no tiene stock disponible para reservar.`;
    }

    const sellerError = validateSaleSellerValue(row.reservationSellerValue, canAssignUser);
    if (sellerError) {
      return `Reserva (${size}): ${sellerError}`;
    }
  }

  return null;
}
