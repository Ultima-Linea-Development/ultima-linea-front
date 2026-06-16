import type { Commission, CommissionStatus, SaleAssignableUser } from "@/lib/api";
import type { IconName } from "@/components/ui/Icons";
import { getAssignableUserLabel } from "@/lib/user-display";

export type CommissionStatusVisual = {
  label: string;
  icon: IconName;
  circleClassName: string;
};

export const COMMISSION_STATUS_VISUALS: Record<CommissionStatus, CommissionStatusVisual> = {
  pending: {
    label: "Pendiente",
    icon: "pending",
    circleClassName: "bg-amber-500",
  },
  exported: {
    label: "Exportado",
    icon: "commissions",
    circleClassName: "bg-violet-500",
  },
  cancelled: {
    label: "Cancelado",
    icon: "cancel",
    circleClassName: "bg-red-500",
  },
};

export const COMMISSION_STATUS_OPTIONS: {
  value: CommissionStatus;
  label: string;
}[] = (
  Object.entries(COMMISSION_STATUS_VISUALS) as [CommissionStatus, CommissionStatusVisual][]
).map(([value, visual]) => ({ value, label: visual.label }));

export function getCommissionStatusLabel(status: CommissionStatus): string {
  return COMMISSION_STATUS_VISUALS[status]?.label ?? status;
}

export function getCommissionStatusVisual(status: CommissionStatus): CommissionStatusVisual {
  return (
    COMMISSION_STATUS_VISUALS[status] ?? {
      label: status,
      icon: "pending",
      circleClassName: "bg-amber-500",
    }
  );
}

export function getCommissionSellerLabel(
  commission: Pick<Commission, "seller_user_id" | "external_seller_name">,
  assignableUsers: SaleAssignableUser[] = []
): string {
  if (commission.external_seller_name?.trim()) {
    return commission.external_seller_name;
  }

  return getAssignableUserLabel(assignableUsers, commission.seller_user_id);
}

export function getCommissionLabel(commission: Commission): string {
  return commission.customer_name;
}

export function commissionMatchesQuery(commission: Commission, query: string): boolean {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return true;

  const haystack = [
    commission.name,
    commission.customer_name,
    commission.customer_contact,
    commission.external_seller_name,
    commission.supplier_order_name,
    commission.notes,
    ...commission.items.flatMap((item) => [
      item.shirt_name,
      item.sizes,
      item.dorsal,
      item.description,
    ]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();

  return haystack.includes(normalized);
}
