import type { SupplierOrder, SupplierOrderItemType, SupplierOrderStatus } from "@/lib/api";
import type { IconName } from "@/components/ui/Icons";

export type SupplierOrderStatusVisual = {
  label: string;
  icon: IconName;
  circleClassName: string;
};

export const SUPPLIER_ORDER_STATUS_VISUALS: Record<
  SupplierOrderStatus,
  SupplierOrderStatusVisual
> = {
  draft: {
    label: "Borrador",
    icon: "draft",
    circleClassName: "bg-zinc-400",
  },
  sent: {
    label: "En camino",
    icon: "orders",
    circleClassName: "bg-sky-500",
  },
  partial: {
    label: "Pagado",
    icon: "paid",
    circleClassName: "bg-emerald-500",
  },
  completed: {
    label: "Recibido",
    icon: "checkCircle",
    circleClassName: "bg-green-600",
  },
  cancelled: {
    label: "Cancelado",
    icon: "cancel",
    circleClassName: "bg-red-500",
  },
};

export const SUPPLIER_ORDER_STATUS_OPTIONS: {
  value: SupplierOrderStatus;
  label: string;
}[] = (
  Object.entries(SUPPLIER_ORDER_STATUS_VISUALS) as [
    SupplierOrderStatus,
    SupplierOrderStatusVisual,
  ][]
).map(([value, visual]) => ({ value, label: visual.label }));

export const SUPPLIER_ORDER_ITEM_TYPE_OPTIONS: {
  value: SupplierOrderItemType;
  label: string;
}[] = [
  { value: "FAN", label: "Fan" },
  { value: "PLAYER", label: "Player" },
  { value: "RETRO", label: "Retro" },
];

export function getSupplierOrderStatusLabel(status: SupplierOrderStatus): string {
  return SUPPLIER_ORDER_STATUS_VISUALS[status]?.label ?? status;
}

export function getSupplierOrderStatusVisual(
  status: SupplierOrderStatus
): SupplierOrderStatusVisual {
  return (
    SUPPLIER_ORDER_STATUS_VISUALS[status] ?? {
      label: status,
      icon: "draft",
      circleClassName: "bg-zinc-400",
    }
  );
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
    order.tracking_number,
    order.tracking_link,
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

export function normalizeSupplierOrderTrackingLink(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function validateSupplierOrderTrackingLink(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const normalized = normalizeSupplierOrderTrackingLink(trimmed);
  if (!normalized) return null;

  try {
    new URL(normalized);
    return null;
  } catch {
    return "Enlace de seguimiento inválido.";
  }
}
