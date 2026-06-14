import type { SupplierOrder, SupplierOrderItemType, SupplierOrderStatus } from "@/lib/api";

export const SUPPLIER_ORDER_STATUS_OPTIONS: {
  value: SupplierOrderStatus;
  label: string;
}[] = [
  { value: "draft", label: "Borrador" },
  { value: "sent", label: "Enviado" },
  { value: "partial", label: "Parcial" },
  { value: "completed", label: "Completado" },
  { value: "cancelled", label: "Cancelado" },
];

export const SUPPLIER_ORDER_ITEM_TYPE_OPTIONS: {
  value: SupplierOrderItemType;
  label: string;
}[] = [
  { value: "FAN", label: "Fan" },
  { value: "PLAYER", label: "Player" },
  { value: "RETRO", label: "Retro" },
];

export function getSupplierOrderStatusLabel(status: SupplierOrderStatus): string {
  return SUPPLIER_ORDER_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

export function getSupplierOrderItemTypeLabel(type: SupplierOrderItemType): string {
  return SUPPLIER_ORDER_ITEM_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type;
}

export function getSupplierOrderLabel(order: SupplierOrder): string {
  return order.supplier_name ? `${order.name} (${order.supplier_name})` : order.name;
}

export function supplierOrderMatchesQuery(order: SupplierOrder, query: string): boolean {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return true;

  const haystack = [
    order.name,
    order.supplier_name,
    order.notes,
    ...order.items.flatMap((item) => [
      item.shirt_name,
      item.sizes,
      item.dorsal,
      item.description,
      item.link,
      item.type,
    ]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();

  return haystack.includes(normalized);
}
