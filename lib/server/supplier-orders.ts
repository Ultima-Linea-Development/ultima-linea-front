import {
  SupplierOrder,
  SupplierOrderDocument,
  SupplierOrderItemType,
  SupplierOrderLineItem,
  SupplierOrderStatus,
  generateULID,
  supplierOrderFromDoc,
} from "@/lib/server/models";

const VALID_TYPES: SupplierOrderItemType[] = ["FAN", "PLAYER", "RETRO"];
const VALID_STATUSES: SupplierOrderStatus[] = [
  "draft",
  "sent",
  "partial",
  "completed",
  "cancelled",
];

export type SupplierOrderLineItemInput = {
  id?: string;
  shirt_name?: string;
  quantity?: number;
  type?: string;
  sizes?: string;
  dorsal?: string;
  description?: string;
  link?: string;
  downloaded?: boolean;
  cleaned?: boolean;
  price?: number;
  ordered?: boolean;
};

function trimOptional(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function parseItemType(value?: string): SupplierOrderItemType | null {
  const normalized = value?.trim().toUpperCase();
  if (normalized && VALID_TYPES.includes(normalized as SupplierOrderItemType)) {
    return normalized as SupplierOrderItemType;
  }
  return null;
}

export function parseSupplierOrderStatus(value?: string): SupplierOrderStatus | null {
  const normalized = value?.trim().toLowerCase();
  if (normalized && VALID_STATUSES.includes(normalized as SupplierOrderStatus)) {
    return normalized as SupplierOrderStatus;
  }
  return null;
}

export function parseSupplierOrderLineItems(
  items: SupplierOrderLineItemInput[] | undefined
): { items: SupplierOrderLineItem[] } | { error: string } {
  if (!Array.isArray(items) || items.length === 0) {
    return { error: "Agregá al menos un ítem" };
  }

  const parsed: SupplierOrderLineItem[] = [];

  for (const item of items) {
    const shirtName = item.shirt_name?.trim();
    if (!shirtName) {
      return { error: "Cada ítem necesita un nombre de camiseta" };
    }

    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return { error: `Cantidad inválida para ${shirtName}` };
    }

    const type = parseItemType(item.type);
    if (!type) {
      return { error: `Tipo inválido para ${shirtName}` };
    }

    const sizes = item.sizes?.trim();
    if (!sizes) {
      return { error: `Indicá el talle para ${shirtName}` };
    }

    const price = Number(item.price);
    if (!Number.isFinite(price) || price < 0) {
      return { error: `Precio inválido para ${shirtName}` };
    }

    parsed.push({
      id: item.id?.trim() || generateULID(),
      shirt_name: shirtName,
      quantity,
      type,
      sizes,
      dorsal: trimOptional(item.dorsal),
      description: trimOptional(item.description),
      link: trimOptional(item.link),
      downloaded: Boolean(item.downloaded),
      cleaned: Boolean(item.cleaned),
      price,
      ordered: Boolean(item.ordered),
    });
  }

  return { items: parsed };
}

export function normalizeSupplierOrderForResponse(
  doc: SupplierOrderDocument | SupplierOrder
): SupplierOrder {
  const order = "_id" in doc ? supplierOrderFromDoc(doc) : doc;
  return {
    ...order,
    items: Array.isArray(order.items) ? order.items : [],
  };
}

export function getSupplierOrderProgress(order: SupplierOrder): {
  totalItems: number;
  orderedItems: number;
  totalQuantity: number;
  totalPrice: number;
} {
  const items = order.items ?? [];
  return {
    totalItems: items.length,
    orderedItems: items.filter((item) => item.ordered).length,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
}
