import type { SupplierOrder } from "@/lib/api";
import { saleDateInputToApiValue, saleDateIsoToDisplayValue } from "@/lib/sale-date";

export type SupplierOrderMilestoneDates = {
  paidAt: string;
  sentAt: string;
  receivedAt: string;
};

export const EMPTY_SUPPLIER_ORDER_MILESTONE_DATES: SupplierOrderMilestoneDates = {
  paidAt: "",
  sentAt: "",
  receivedAt: "",
};

export function orderMilestoneDatesFromOrder(
  order: Pick<SupplierOrder, "paid_at" | "sent_at" | "received_at">
): SupplierOrderMilestoneDates {
  return {
    paidAt: order.paid_at ? saleDateIsoToDisplayValue(order.paid_at) : "",
    sentAt: order.sent_at ? saleDateIsoToDisplayValue(order.sent_at) : "",
    receivedAt: order.received_at ? saleDateIsoToDisplayValue(order.received_at) : "",
  };
}

export function validateSupplierOrderMilestoneDates(
  dates: SupplierOrderMilestoneDates
): string | null {
  if (dates.paidAt.trim() && !saleDateInputToApiValue(dates.paidAt)) {
    return "Fecha de pago inválida.";
  }

  if (dates.sentAt.trim() && !saleDateInputToApiValue(dates.sentAt)) {
    return "Fecha de envío inválida.";
  }

  if (dates.receivedAt.trim() && !saleDateInputToApiValue(dates.receivedAt)) {
    return "Fecha de recepción inválida.";
  }

  return null;
}

export function supplierOrderMilestoneDatesToCreatePayload(
  dates: SupplierOrderMilestoneDates
): Partial<Pick<SupplierOrder, "paid_at" | "sent_at" | "received_at">> {
  const paidAt = dates.paidAt.trim();
  const sentAt = dates.sentAt.trim();
  const receivedAt = dates.receivedAt.trim();

  return {
    ...(paidAt ? { paid_at: saleDateInputToApiValue(paidAt)! } : {}),
    ...(sentAt ? { sent_at: saleDateInputToApiValue(sentAt)! } : {}),
    ...(receivedAt ? { received_at: saleDateInputToApiValue(receivedAt)! } : {}),
  };
}

export function supplierOrderMilestoneDatesToUpdatePayload(
  dates: SupplierOrderMilestoneDates
): Pick<SupplierOrder, "paid_at" | "sent_at" | "received_at"> {
  const paidAt = dates.paidAt.trim();
  const sentAt = dates.sentAt.trim();
  const receivedAt = dates.receivedAt.trim();

  return {
    paid_at: paidAt ? saleDateInputToApiValue(paidAt)! : "",
    sent_at: sentAt ? saleDateInputToApiValue(sentAt)! : "",
    received_at: receivedAt ? saleDateInputToApiValue(receivedAt)! : "",
  };
}
