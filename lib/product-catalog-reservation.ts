import type { CatalogReservationEntry, Product } from "@/lib/api";
import type { SizeStockRow } from "@/lib/product-inventory";
import { getCatalogReservationEntries } from "@/lib/product-reservation";
import {
  reservationSellerFieldsFromFormValue,
  sellerFormValueFromReservationFields,
} from "@/lib/reservation-seller";
import { validateSaleSellerValue } from "@/lib/sale-seller";
import {
  draftHasSizeReservations,
  emptySizeReservationRow,
  getMaxReservationQuantityForRow,
  reservationEntriesFromRows,
  type SupplierOrderSizeQuantityRow,
  type SupplierOrderSizeReservationRow,
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
  return getCatalogReservationEntries(product).length > 0;
}

export function reservationRowsFromProduct(
  product: Product,
  currentUserId: string | null
): SupplierOrderSizeReservationRow[] {
  return getCatalogReservationEntries(product).map((entry) => ({
    ...emptySizeReservationRow(currentUserId),
    size: entry.size,
    quantity: String(entry.quantity),
    reservationSellerValue: sellerFormValueFromReservationFields(entry, currentUserId),
  }));
}

export function catalogReservationEntriesFromRows(
  reservationRows: SupplierOrderSizeReservationRow[],
  stockRows: SizeStockRow[],
  canAssignUser: boolean
): CatalogReservationEntry[] {
  const orderSizeRows = stockRowsToOrderSizeRows(stockRows);
  const entries = reservationEntriesFromRows(reservationRows, orderSizeRows, (row) =>
    reservationSellerFieldsFromFormValue(row.reservationSellerValue, canAssignUser)
  );

  return entries.map((entry) => ({
    size: entry.size,
    quantity: entry.quantity,
    ...(entry.reserved_for_user_id
      ? { reserved_for_user_id: entry.reserved_for_user_id }
      : {}),
    ...(entry.reserved_for_external_seller_id
      ? { reserved_for_external_seller_id: entry.reserved_for_external_seller_id }
      : {}),
    ...(entry.reserved_for_external_seller_name
      ? { reserved_for_external_seller_name: entry.reserved_for_external_seller_name }
      : {}),
  }));
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
