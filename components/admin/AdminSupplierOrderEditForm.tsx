"use client";

import { FormEvent, useMemo, useState } from "react";
import Box from "@/components/layout/Box";
import Form from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import FormField from "@/components/ui/FormField";
import Textarea from "@/components/ui/Textarea";
import Typography from "@/components/ui/Typography";
import Select from "@/components/ui/Select";
import { Button } from "@/components/ui/button";
import AdminSupplierField from "@/components/admin/AdminSupplierField";
import AdminSupplierOrderLineItemRow, {
  createEmptySupplierOrderLineItemDraft,
  getSupplierOrderLineItemDraftTotal,
  type SupplierOrderLineItemDraft,
} from "@/components/admin/AdminSupplierOrderLineItemRow";
import type {
  Supplier,
  SupplierOrder,
  SupplierOrderStatus,
  UpdateSupplierOrderRequest,
} from "@/lib/api";
import {
  supplierToFormValue,
  supplierValueToPayload,
  validateSupplierValue,
} from "@/lib/supplier-field";
import { SUPPLIER_ORDER_STATUS_OPTIONS } from "@/lib/supplier-order-display";
import { formatPrice } from "@/lib/utils";

type AdminSupplierOrderEditFormProps = {
  order: SupplierOrder;
  suppliers: Supplier[];
  isSubmitting: boolean;
  onSave: (payload: UpdateSupplierOrderRequest) => Promise<boolean>;
  onError: (message: string) => void;
  onCancel?: () => void;
};

const fieldLabelClassName = "w-full min-w-0";

function orderItemToDraft(item: SupplierOrder["items"][number]): SupplierOrderLineItemDraft {
  return {
    key: item.id,
    shirtName: item.shirt_name,
    quantity: String(item.quantity),
    type: item.type,
    sizes: item.sizes,
    dorsal: item.dorsal ?? "",
    description: item.description ?? "",
    link: item.link ?? "",
    downloaded: item.downloaded,
    cleaned: item.cleaned,
    price: String(item.price),
    ordered: item.ordered,
  };
}

function draftToRequestItem(item: SupplierOrderLineItemDraft) {
  return {
    id: item.key,
    shirt_name: item.shirtName.trim(),
    quantity: Number(item.quantity),
    type: item.type,
    sizes: item.sizes.trim(),
    dorsal: item.dorsal.trim() || undefined,
    description: item.description.trim() || undefined,
    link: item.link.trim() || undefined,
    downloaded: item.downloaded,
    cleaned: item.cleaned,
    price: Number(item.price),
    ordered: item.ordered,
  };
}

function validateLineItems(lineItems: SupplierOrderLineItemDraft[]): string | null {
  if (lineItems.length === 0) {
    return "Agregá al menos un ítem.";
  }

  for (const item of lineItems) {
    if (!item.shirtName.trim()) {
      return "Cada ítem necesita un nombre de camiseta.";
    }

    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return `Cantidad inválida para ${item.shirtName || "un ítem"}.`;
    }

    if (!item.sizes.trim()) {
      return `Indicá el talle para ${item.shirtName}.`;
    }

    const price = Number(item.price);
    if (!Number.isFinite(price) || price < 0) {
      return `Precio inválido para ${item.shirtName}.`;
    }
  }

  return null;
}

export default function AdminSupplierOrderEditForm({
  order,
  suppliers,
  isSubmitting,
  onSave,
  onError,
  onCancel,
}: AdminSupplierOrderEditFormProps) {
  const initialSupplier = useMemo(
    () =>
      suppliers.find((supplier) => supplier.id === order.supplier_id) ??
      (order.supplier_name
        ? {
            id: order.supplier_id ?? "",
            name: order.supplier_name,
            created_at: order.created_at,
            updated_at: order.updated_at,
          }
        : null),
    [order, suppliers]
  );

  const [name, setName] = useState(order.name);
  const [status, setStatus] = useState<SupplierOrderStatus>(order.status);
  const [notes, setNotes] = useState(order.notes ?? "");
  const [supplierValue, setSupplierValue] = useState(() => supplierToFormValue(initialSupplier));
  const [lineItems, setLineItems] = useState<SupplierOrderLineItemDraft[]>(() =>
    order.items.map(orderItemToDraft)
  );

  const orderTotal = useMemo(
    () => lineItems.reduce((sum, item) => sum + getSupplierOrderLineItemDraftTotal(item), 0),
    [lineItems]
  );

  const updateLineItem = (
    key: string,
    updates: Partial<Omit<SupplierOrderLineItemDraft, "key">>
  ) => {
    setLineItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, ...updates } : item))
    );
  };

  const removeLineItem = (key: string) => {
    setLineItems((prev) => prev.filter((item) => item.key !== key));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      onError("El nombre del pedido es obligatorio.");
      return;
    }

    const supplierError = validateSupplierValue(supplierValue);
    if (supplierError) {
      onError(supplierError);
      return;
    }

    const itemsError = validateLineItems(lineItems);
    if (itemsError) {
      onError(itemsError);
      return;
    }

    await onSave({
      name: trimmedName,
      status,
      notes: notes.trim() || undefined,
      ...supplierValueToPayload(supplierValue),
      items: lineItems.map(draftToRequestItem),
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Box display="flex" direction="col" gap="4" align="stretch" className="w-full min-w-0">
        <div className="grid w-full min-w-0 grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          <div className="min-w-0 w-full">
            <FormField htmlFor="edit-order-name" label="Nombre del pedido" required className={fieldLabelClassName}>
            <Input
              id="edit-order-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isSubmitting}
              required
            />
          </FormField>
          </div>

          <div className="min-w-0 w-full">
            <FormField htmlFor="edit-order-status" label="Estado" required className={fieldLabelClassName}>
            <Select
              id="edit-order-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as SupplierOrderStatus)}
              disabled={isSubmitting}
              required
            >
              {SUPPLIER_ORDER_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormField>
          </div>
        </div>

        <AdminSupplierField
          value={supplierValue}
          onChange={setSupplierValue}
          suppliers={suppliers}
          disabled={isSubmitting}
        />

        <FormField htmlFor="edit-order-notes" label="Notas del pedido" className={fieldLabelClassName}>
          <Textarea
            id="edit-order-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            disabled={isSubmitting}
            rows={2}
          />
        </FormField>

        <Box display="flex" direction="col" gap="3" align="stretch" className="w-full min-w-0">
          <Box display="flex" className="items-center justify-between gap-4">
            <Typography variant="h3">Ítems</Typography>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setLineItems((prev) => [...prev, createEmptySupplierOrderLineItemDraft()])
              }
              disabled={isSubmitting}
            >
              Agregar ítem
            </Button>
          </Box>

          {lineItems.map((item) => (
            <AdminSupplierOrderLineItemRow
              key={item.key}
              item={item}
              isSubmitting={isSubmitting}
              onChange={updateLineItem}
              onRemove={removeLineItem}
            />
          ))}
        </Box>

        <Typography variant="body" className="text-right">
          Total estimado: {formatPrice(orderTotal)}
        </Typography>

        <Box display="flex" gap="3" className="justify-end flex-wrap">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </Box>
      </Box>
    </Form>
  );
}
