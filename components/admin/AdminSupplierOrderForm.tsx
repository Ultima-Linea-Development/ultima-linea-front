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
  CreateSupplierOrderRequest,
  Supplier,
  SupplierOrderStatus,
} from "@/lib/api";
import {
  createDefaultSupplierValue,
  supplierValueToPayload,
  validateSupplierValue,
} from "@/lib/supplier-field";
import { SUPPLIER_ORDER_STATUS_OPTIONS } from "@/lib/supplier-order-display";
import { formatPrice } from "@/lib/utils";

const fieldLabelClassName = "w-full min-w-0";

type AdminSupplierOrderFormProps = {
  suppliers: Supplier[];
  isSubmitting: boolean;
  onCreate: (payload: CreateSupplierOrderRequest) => Promise<boolean>;
  onError: (message: string) => void;
  onCancel?: () => void;
};

function draftToRequestItem(item: SupplierOrderLineItemDraft) {
  return {
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

export default function AdminSupplierOrderForm({
  suppliers,
  isSubmitting,
  onCreate,
  onError,
  onCancel,
}: AdminSupplierOrderFormProps) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<SupplierOrderStatus>("draft");
  const [notes, setNotes] = useState("");
  const [supplierValue, setSupplierValue] = useState(createDefaultSupplierValue);
  const [lineItems, setLineItems] = useState<SupplierOrderLineItemDraft[]>([
    createEmptySupplierOrderLineItemDraft(),
  ]);

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

    const success = await onCreate({
      name: trimmedName,
      status,
      notes: notes.trim() || undefined,
      ...supplierValueToPayload(supplierValue),
      items: lineItems.map(draftToRequestItem),
    });

    if (success) {
      setName("");
      setStatus("draft");
      setNotes("");
      setSupplierValue(createDefaultSupplierValue());
      setLineItems([createEmptySupplierOrderLineItemDraft()]);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Box display="flex" direction="col" gap="4" align="stretch" className="w-full min-w-0">
        <div className="grid w-full min-w-0 grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          <div className="min-w-0 w-full">
            <FormField htmlFor="order-name" label="Nombre del pedido" required className={fieldLabelClassName}>
            <Input
              id="order-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isSubmitting}
              required
            />
          </FormField>
          </div>

          <div className="min-w-0 w-full">
            <FormField htmlFor="order-status" label="Estado" required className={fieldLabelClassName}>
            <Select
              id="order-status"
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

        <FormField htmlFor="order-notes" label="Notas del pedido" className={fieldLabelClassName}>
          <Textarea
            id="order-notes"
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
            {isSubmitting ? "Guardando..." : "Crear pedido"}
          </Button>
        </Box>
      </Box>
    </Form>
  );
}
