import { Collection } from "mongodb";
import { ExternalSellerDocument, ProductDocument } from "@/lib/server/models";
import { resolveExternalSeller } from "@/lib/server/external-sellers";
import { isAssignableStaffUser } from "@/lib/server/users";
import type { ResolvedSaleSeller } from "@/lib/server/sale-seller";
import { nonDeletedProductFilter } from "@/lib/server/products";
import { getSupplierOrderSizeQuantityEntries } from "@/lib/supplier-order-sizes";

export type ProductReservationFields = {
  reserved_for_user_id?: string;
  reserved_for_external_seller_id?: string;
  reserved_for_external_seller_name?: string;
};

export type ProductSizeReservationKey = {
  productId: string;
  size: string;
};

export type LineItemReservationEntry = {
  size: string;
  quantity: number;
  reserved_seller_type?: "internal" | "external";
  reserved_for_user_id?: string;
  reserved_for_external_seller_id?: string;
  reserved_for_external_seller_name?: string;
};

export type LineItemReservationInput = {
  product_id?: string;
  reserved?: boolean;
  reserved_sizes?: string[];
  reserved_quantity_by_sizes?: Record<string, number>;
  reservation_entries?: LineItemReservationEntry[];
  sizes?: string;
  quantity?: number;
  quantity_by_sizes?: Record<string, number>;
  reserved_seller_type?: "internal" | "external";
  reserved_for_user_id?: string;
  reserved_for_external_seller_id?: string;
  reserved_for_external_seller_name?: string;
};

export const PRODUCT_RESERVATION_UNSET_FIELDS = {
  reserved_for_user_id: "",
  reserved_for_external_seller_id: "",
  reserved_for_external_seller_name: "",
} as const;

function trimOptional(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function reservationFieldsAreActive(reservation: ProductReservationFields): boolean {
  return Boolean(
    trimOptional(reservation.reserved_for_user_id) ||
      trimOptional(reservation.reserved_for_external_seller_id) ||
      trimOptional(reservation.reserved_for_external_seller_name)
  );
}

function sizeReservationKey(productId: string, size: string): string {
  return `${productId}\0${size.toLocaleLowerCase()}`;
}

function getLineItemReservationEntries(
  item: LineItemReservationInput
): LineItemReservationEntry[] {
  if (item.reservation_entries && item.reservation_entries.length > 0) {
    return item.reservation_entries.filter(
      (entry) =>
        entry.size.trim() &&
        Number.isInteger(entry.quantity) &&
        entry.quantity > 0
    );
  }

  const reservation = getLineItemReservationFields(item);
  if (!reservation) return [];

  return getLineItemReservedSizes(item).map((size) => ({
    size,
    quantity:
      item.reserved_quantity_by_sizes?.[size] ??
      Object.entries(item.reserved_quantity_by_sizes ?? {}).find(
        ([existingSize]) => existingSize.trim().toLocaleLowerCase() === size.toLocaleLowerCase()
      )?.[1] ??
      1,
    ...reservation,
  }));
}

export function getLineItemReservedSizes(
  item: Pick<
    LineItemReservationInput,
    | "sizes"
    | "quantity_by_sizes"
    | "quantity"
    | "reserved_sizes"
    | "reserved_quantity_by_sizes"
    | "reserved"
  >
): string[] {
  const entries = getLineItemReservationEntries(item);
  if (entries.length > 0) {
    return entries.map((entry) => entry.size.trim()).filter(Boolean);
  }

  if (item.reserved_quantity_by_sizes && Object.keys(item.reserved_quantity_by_sizes).length > 0) {
    return Object.entries(item.reserved_quantity_by_sizes)
      .filter(([, quantity]) => Number.isInteger(quantity) && quantity > 0)
      .map(([size]) => size.trim())
      .filter(Boolean);
  }

  if (item.reserved_sizes && item.reserved_sizes.length > 0) {
    return item.reserved_sizes.map((size) => size.trim()).filter(Boolean);
  }

  if (item.reserved) {
    return getSupplierOrderSizeQuantityEntries({
      quantity: item.quantity ?? 0,
      sizes: item.sizes ?? "",
      quantity_by_sizes: item.quantity_by_sizes,
    }).map(([size]) => size);
  }

  return [];
}

export function lineItemHasReservation(
  item: Pick<
    LineItemReservationInput,
    | "reserved"
    | "product_id"
    | "reserved_sizes"
    | "reserved_quantity_by_sizes"
    | "reservation_entries"
  >
): boolean {
  if (!item.product_id?.trim()) return false;
  if (item.reservation_entries && item.reservation_entries.length > 0) return true;
  if (
    item.reserved_quantity_by_sizes &&
    Object.values(item.reserved_quantity_by_sizes).some(
      (quantity) => Number.isInteger(quantity) && quantity > 0
    )
  ) {
    return true;
  }
  if (item.reserved_sizes && item.reserved_sizes.length > 0) return true;
  return Boolean(item.reserved);
}

export function getReservedProductSizeKeys(
  items: Array<LineItemReservationInput & { product_id?: string }>
): ProductSizeReservationKey[] {
  const keys: ProductSizeReservationKey[] = [];

  for (const item of items) {
    if (!lineItemHasReservation(item)) continue;

    const productId = item.product_id!.trim();
    for (const entry of getLineItemReservationEntries(item)) {
      keys.push({ productId, size: entry.size.trim() });
    }
  }

  return keys;
}

function reservationFieldsFromEntry(
  entry: LineItemReservationEntry
): ProductReservationFields | null {
  const fields = {
    reserved_for_user_id: trimOptional(entry.reserved_for_user_id),
    reserved_for_external_seller_id: trimOptional(entry.reserved_for_external_seller_id),
    reserved_for_external_seller_name: trimOptional(entry.reserved_for_external_seller_name),
  };

  return reservationFieldsAreActive(fields) ? fields : null;
}

export function getLineItemReservationFields(
  item: Pick<
    LineItemReservationInput,
    | "reserved"
    | "reserved_for_user_id"
    | "reserved_for_external_seller_id"
    | "reserved_for_external_seller_name"
  >
): ProductReservationFields | null {
  if (!item.reserved) return null;

  return {
    reserved_for_user_id: trimOptional(item.reserved_for_user_id),
    reserved_for_external_seller_id: trimOptional(item.reserved_for_external_seller_id),
    reserved_for_external_seller_name: trimOptional(item.reserved_for_external_seller_name),
  };
}

function findSizeReservation(
  reservedBySizes: Record<string, ProductReservationFields> | undefined,
  size: string
): ProductReservationFields | null {
  if (!reservedBySizes || !size.trim()) return null;

  const direct = reservedBySizes[size];
  if (direct && reservationFieldsAreActive(direct)) return direct;

  const normalized = size.trim().toLocaleLowerCase();
  for (const [reservedSize, reservation] of Object.entries(reservedBySizes)) {
    if (
      reservedSize.trim().toLocaleLowerCase() === normalized &&
      reservationFieldsAreActive(reservation)
    ) {
      return reservation;
    }
  }

  return null;
}

type DefaultReservationSeller = {
  seller_user_id?: string;
  external_seller_id?: string;
  external_seller_name?: string;
};

async function resolveReservationSeller(
  externalSellers: Collection<ExternalSellerDocument>,
  input: LineItemReservationInput,
  defaultSeller?: DefaultReservationSeller
): Promise<ProductReservationFields | { error: string }> {
  const isExternal =
    input.reserved_seller_type === "external" ||
    Boolean(
      trimOptional(input.reserved_for_external_seller_id) ||
        trimOptional(input.reserved_for_external_seller_name)
    ) ||
    Boolean(
      !trimOptional(input.reserved_for_user_id) &&
        (trimOptional(defaultSeller?.external_seller_id) ||
          trimOptional(defaultSeller?.external_seller_name))
    );

  if (isExternal) {
    const externalSeller = await resolveExternalSeller(externalSellers, {
      id: trimOptional(input.reserved_for_external_seller_id) ?? defaultSeller?.external_seller_id,
      name:
        trimOptional(input.reserved_for_external_seller_name) ??
        defaultSeller?.external_seller_name,
    });

    if (!externalSeller) {
      return { error: "Vendedor externo de reserva inválido" };
    }

    return {
      reserved_for_external_seller_id: externalSeller.id,
      reserved_for_external_seller_name: externalSeller.name,
    };
  }

  const userId =
    trimOptional(input.reserved_for_user_id) ?? trimOptional(defaultSeller?.seller_user_id);

  if (!userId) {
    return { error: "Seleccioná un vendedor para la reserva" };
  }

  if (!(await isAssignableStaffUser(userId))) {
    return { error: "Vendedor de reserva inválido" };
  }

  return { reserved_for_user_id: userId };
}

export async function applyLineItemReservations<
  T extends LineItemReservationInput & { product_id?: string; shirt_name: string },
>(
  externalSellers: Collection<ExternalSellerDocument>,
  items: T[],
  defaultSeller?: DefaultReservationSeller
): Promise<{ items: T[] } | { error: string }> {
  const resolvedItems: T[] = [];

  for (const item of items) {
    if (!lineItemHasReservation(item)) {
      resolvedItems.push({
        ...item,
        reserved: false,
        reserved_sizes: [],
        reservation_entries: [],
        reserved_for_user_id: undefined,
        reserved_for_external_seller_id: undefined,
        reserved_for_external_seller_name: undefined,
      });
      continue;
    }

    const entries = getLineItemReservationEntries(item);
    if (entries.length === 0) {
      return { error: `Indicá cuántas unidades reservar por talle (${item.shirt_name})` };
    }

    const resolvedEntries: LineItemReservationEntry[] = [];

    for (const entry of entries) {
      const reservation = await resolveReservationSeller(
        externalSellers,
        {
          reserved: true,
          reserved_seller_type: entry.reserved_seller_type,
          reserved_for_user_id: entry.reserved_for_user_id,
          reserved_for_external_seller_id: entry.reserved_for_external_seller_id,
          reserved_for_external_seller_name: entry.reserved_for_external_seller_name,
        },
        defaultSeller
      );

      if ("error" in reservation) {
        return { error: `${reservation.error} (${item.shirt_name}, talle ${entry.size})` };
      }

      resolvedEntries.push({
        size: entry.size.trim(),
        quantity: entry.quantity,
        ...reservation,
      });
    }

    const reservedQuantityBySizes = resolvedEntries.reduce<Record<string, number>>((acc, entry) => {
      const size = entry.size.trim();
      acc[size] = (acc[size] ?? 0) + entry.quantity;
      return acc;
    }, {});

    const primaryReservation = reservationFieldsFromEntry(resolvedEntries[0]);

    resolvedItems.push({
      ...item,
      reserved: true,
      reserved_sizes: Object.keys(reservedQuantityBySizes),
      reserved_quantity_by_sizes: reservedQuantityBySizes,
      reservation_entries: resolvedEntries,
      ...(primaryReservation ?? {}),
      reserved_seller_type: undefined,
    });
  }

  return { items: resolvedItems };
}

export async function syncProductReservationsFromItems(
  products: Collection<ProductDocument>,
  items: Array<LineItemReservationInput & { product_id?: string }>
): Promise<void> {
  const reservedByProduct = new Map<
    string,
    Array<{ size: string; reservation: ProductReservationFields }>
  >();

  for (const item of items) {
    if (!lineItemHasReservation(item)) continue;

    const productId = item.product_id!.trim();
    const entries = getLineItemReservationEntries(item);
    if (entries.length === 0) continue;

    const sizeEntries = entries
      .map((entry) => {
        const reservation = reservationFieldsFromEntry(entry);
        if (!reservation) return null;
        return { size: entry.size.trim(), reservation };
      })
      .filter((entry): entry is { size: string; reservation: ProductReservationFields } =>
        Boolean(entry)
      );

    if (sizeEntries.length === 0) continue;

    const existing = reservedByProduct.get(productId) ?? [];
    reservedByProduct.set(productId, [...existing, ...sizeEntries]);
  }

  const now = new Date();

  for (const [productId, sizeReservations] of reservedByProduct) {
    const setFields: Record<string, unknown> = { updated_at: now };

    for (const { size, reservation } of sizeReservations) {
      setFields[`reserved_by_sizes.${size}`] = reservation;
    }

    await products.updateOne(
      { _id: productId, ...nonDeletedProductFilter },
      {
        $set: setFields,
        $unset: PRODUCT_RESERVATION_UNSET_FIELDS,
      }
    );
  }
}

export async function clearProductSizeReservations(
  products: Collection<ProductDocument>,
  keys: ProductSizeReservationKey[]
): Promise<void> {
  const byProduct = new Map<string, string[]>();

  for (const { productId, size } of keys) {
    const trimmedProductId = productId.trim();
    const trimmedSize = size.trim();
    if (!trimmedProductId || !trimmedSize) continue;

    const sizes = byProduct.get(trimmedProductId) ?? [];
    sizes.push(trimmedSize);
    byProduct.set(trimmedProductId, sizes);
  }

  const now = new Date();

  for (const [productId, sizes] of byProduct) {
    const unsetFields: Record<string, string> = {};
    for (const size of sizes) {
      unsetFields[`reserved_by_sizes.${size}`] = "";
    }

    await products.updateOne(
      { _id: productId, ...nonDeletedProductFilter },
      {
        $unset: unsetFields as Record<string, "">,
        $set: { updated_at: now },
      }
    );
  }
}

export async function reconcileProductReservations(
  products: Collection<ProductDocument>,
  previousItems: Array<LineItemReservationInput & { product_id?: string }>,
  nextItems: Array<LineItemReservationInput & { product_id?: string }>
): Promise<void> {
  const previousKeys = new Set(
    getReservedProductSizeKeys(previousItems).map(({ productId, size }) =>
      sizeReservationKey(productId, size)
    )
  );
  const nextKeys = new Set(
    getReservedProductSizeKeys(nextItems).map(({ productId, size }) =>
      sizeReservationKey(productId, size)
    )
  );

  const toClear = getReservedProductSizeKeys(previousItems).filter(
    ({ productId, size }) => !nextKeys.has(sizeReservationKey(productId, size))
  );

  await clearProductSizeReservations(products, toClear);
  await syncProductReservationsFromItems(products, nextItems);
}

function validateReservationForSeller(
  reservation: ProductReservationFields,
  seller: ResolvedSaleSeller,
  productName: string,
  sizeLabel?: string
): string | null {
  const reservedForUser = trimOptional(reservation.reserved_for_user_id);
  const reservedForExternalId = trimOptional(reservation.reserved_for_external_seller_id);
  const reservedForExternalName = trimOptional(reservation.reserved_for_external_seller_name);

  if (!reservedForUser && !reservedForExternalId && !reservedForExternalName) {
    return null;
  }

  const saleExternalId = trimOptional(seller.external_seller_id);
  const saleExternalName = trimOptional(seller.external_seller_name);
  const subject = sizeLabel
    ? `El talle ${sizeLabel} de ${productName}`
    : productName;

  if (reservedForExternalId || reservedForExternalName) {
    if (saleExternalId && reservedForExternalId && saleExternalId === reservedForExternalId) {
      return null;
    }

    if (
      saleExternalName &&
      reservedForExternalName &&
      saleExternalName.toLocaleLowerCase() === reservedForExternalName.toLocaleLowerCase()
    ) {
      return null;
    }

    const reservedLabel = reservedForExternalName ?? "otro vendedor externo";
    return `${subject} está reservado para ${reservedLabel}.`;
  }

  if (reservedForUser && seller.created_by === reservedForUser) {
    return null;
  }

  return `${subject} está reservado para otro vendedor del sistema.`;
}

function findStockForSize(
  stockBySizes: Record<string, number>,
  size: string
): number {
  const trimmed = size.trim();
  if (!trimmed) return 0;

  if (stockBySizes[trimmed] != null) {
    return Math.max(0, stockBySizes[trimmed]);
  }

  const normalized = trimmed.toLocaleLowerCase();
  for (const [stockSize, stock] of Object.entries(stockBySizes)) {
    if (stockSize.trim().toLocaleLowerCase() === normalized) {
      return Math.max(0, stock);
    }
  }

  return 0;
}

export async function resolveProductReservedBySizes(
  externalSellers: Collection<ExternalSellerDocument>,
  stockBySizes: Record<string, number>,
  input: unknown
): Promise<
  { reserved_by_sizes: Record<string, ProductReservationFields> } | { error: string }
> {
  if (input == null) {
    return { reserved_by_sizes: {} };
  }

  if (typeof input !== "object" || Array.isArray(input)) {
    return { error: "Reservas inválidas" };
  }

  const reservedBySizes: Record<string, ProductReservationFields> = {};

  for (const [sizeKey, value] of Object.entries(input as Record<string, unknown>)) {
    const size = sizeKey.trim();
    if (!size) continue;

    if (findStockForSize(stockBySizes, size) <= 0) {
      return { error: `No hay stock para reservar el talle ${size}` };
    }

    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return { error: `Reserva inválida para el talle ${size}` };
    }

    const reservationInput = value as Record<string, unknown>;
    const reservation = await resolveReservationSeller(externalSellers, {
      reserved: true,
      reserved_for_user_id:
        typeof reservationInput.reserved_for_user_id === "string"
          ? reservationInput.reserved_for_user_id
          : undefined,
      reserved_for_external_seller_id:
        typeof reservationInput.reserved_for_external_seller_id === "string"
          ? reservationInput.reserved_for_external_seller_id
          : undefined,
      reserved_for_external_seller_name:
        typeof reservationInput.reserved_for_external_seller_name === "string"
          ? reservationInput.reserved_for_external_seller_name
          : undefined,
    });

    if ("error" in reservation) {
      return { error: `${reservation.error} (talle ${size})` };
    }

    reservedBySizes[size] = reservation;
  }

  return { reserved_by_sizes: reservedBySizes };
}

export function validateProductReservationForSale(
  product: ProductReservationFields & {
    name?: string;
    reserved_by_sizes?: Record<string, ProductReservationFields>;
  },
  seller: ResolvedSaleSeller,
  saleSize?: string
): string | null {
  const productName = product.name ?? "Este producto";
  const size = saleSize?.trim();

  if (size) {
    const sizeReservation = findSizeReservation(product.reserved_by_sizes, size);
    if (sizeReservation) {
      return validateReservationForSeller(sizeReservation, seller, productName, size);
    }
  }

  const hasSizeReservations = Boolean(
    product.reserved_by_sizes &&
      Object.values(product.reserved_by_sizes).some((reservation) =>
        reservationFieldsAreActive(reservation)
      )
  );

  if (hasSizeReservations) {
    return null;
  }

  return validateReservationForSeller(product, seller, productName);
}
