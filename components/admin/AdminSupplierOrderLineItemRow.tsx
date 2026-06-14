"use client";

import Box from "@/components/layout/Box";
import Input from "@/components/ui/Input";
import FormField from "@/components/ui/FormField";
import Typography from "@/components/ui/Typography";
import Icon from "@/components/ui/Icons";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import type { SupplierOrderItemType } from "@/lib/api";
import { adminIconTriggerClassName } from "@/lib/admin-interactive-styles";
import { SUPPLIER_ORDER_ITEM_TYPE_OPTIONS } from "@/lib/supplier-order-display";
import { cn, formatPrice } from "@/lib/utils";

export type SupplierOrderLineItemDraft = {
  key: string;
  shirtName: string;
  quantity: string;
  type: SupplierOrderItemType;
  sizes: string;
  dorsal: string;
  description: string;
  link: string;
  downloaded: boolean;
  cleaned: boolean;
  price: string;
  ordered: boolean;
};

type AdminSupplierOrderLineItemRowProps = {
  item: SupplierOrderLineItemDraft;
  isSubmitting: boolean;
  onChange: (
    key: string,
    updates: Partial<Omit<SupplierOrderLineItemDraft, "key">>
  ) => void;
  onRemove: (key: string) => void;
};

const fieldLabelClassName = "w-full min-w-0";

function normalizeQuantityValue(value: string): string {
  if (value === "") return "";
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return "1";
  return String(Math.max(1, Math.floor(parsed)));
}

function normalizePriceValue(value: string): string {
  if (value === "") return "";
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return "0";
  return String(Math.max(0, parsed));
}

export function getSupplierOrderLineItemDraftTotal(item: SupplierOrderLineItemDraft): number {
  const quantity = Number(item.quantity);
  const price = Number(item.price);
  if (!Number.isFinite(quantity) || !Number.isFinite(price)) return 0;
  return Math.max(0, quantity) * Math.max(0, price);
}

export function createEmptySupplierOrderLineItemDraft(): SupplierOrderLineItemDraft {
  return {
    key: crypto.randomUUID(),
    shirtName: "",
    quantity: "1",
    type: "FAN",
    sizes: "",
    dorsal: "",
    description: "",
    link: "",
    downloaded: false,
    cleaned: false,
    price: "0",
    ordered: false,
  };
}

export default function AdminSupplierOrderLineItemRow({
  item,
  isSubmitting,
  onChange,
  onRemove,
}: AdminSupplierOrderLineItemRowProps) {
  const lineTotal = getSupplierOrderLineItemDraftTotal(item);

  return (
    <Box display="flex" direction="col" gap="3" align="stretch" className="relative w-full min-w-0 border border-border p-3 pr-10">
      <button
        type="button"
        onClick={() => onRemove(item.key)}
        disabled={isSubmitting}
        aria-label="Quitar ítem"
        className={cn(
          adminIconTriggerClassName,
          "absolute top-2 right-2 text-muted-foreground hover:text-destructive disabled:pointer-events-none disabled:opacity-50"
        )}
      >
        <Icon name="delete" className="size-5" />
      </button>

      <FormField htmlFor={`order-shirt-${item.key}`} label="Camiseta" required className={fieldLabelClassName}>
        <Input
          id={`order-shirt-${item.key}`}
          value={item.shirtName}
          onChange={(event) => onChange(item.key, { shirtName: event.target.value })}
          disabled={isSubmitting}
          required
        />
      </FormField>

      <Box display="grid" cols={4} gap={4} className="w-full min-w-0">
        <FormField htmlFor={`order-quantity-${item.key}`} label="Cantidad" required className={fieldLabelClassName}>
          <Input
            id={`order-quantity-${item.key}`}
            type="number"
            min={1}
            value={item.quantity}
            onChange={(event) =>
              onChange(item.key, { quantity: normalizeQuantityValue(event.target.value) })
            }
            onBlur={() => {
              if (item.quantity === "") {
                onChange(item.key, { quantity: "1" });
              }
            }}
            disabled={isSubmitting}
            required
          />
        </FormField>

        <FormField htmlFor={`order-type-${item.key}`} label="Tipo" required className={fieldLabelClassName}>
          <Select
            id={`order-type-${item.key}`}
            value={item.type}
            onChange={(event) =>
              onChange(item.key, { type: event.target.value as SupplierOrderItemType })
            }
            disabled={isSubmitting}
            required
          >
            {SUPPLIER_ORDER_ITEM_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField htmlFor={`order-sizes-${item.key}`} label="Talles" required className={fieldLabelClassName}>
          <Input
            id={`order-sizes-${item.key}`}
            value={item.sizes}
            onChange={(event) => onChange(item.key, { sizes: event.target.value })}
            disabled={isSubmitting}
            placeholder="M, L, XL..."
            required
          />
        </FormField>

        <FormField htmlFor={`order-price-${item.key}`} label="Precio" required className={fieldLabelClassName}>
          <Input
            id={`order-price-${item.key}`}
            type="number"
            min={0}
            value={item.price}
            onChange={(event) =>
              onChange(item.key, { price: normalizePriceValue(event.target.value) })
            }
            onBlur={() => {
              if (item.price === "") {
                onChange(item.key, { price: "0" });
              }
            }}
            disabled={isSubmitting}
            required
          />
        </FormField>
      </Box>

      <Box display="grid" cols={2} gap={4} className="w-full min-w-0">
        <FormField htmlFor={`order-dorsal-${item.key}`} label="Dorsal" className={fieldLabelClassName}>
          <Input
            id={`order-dorsal-${item.key}`}
            value={item.dorsal}
            onChange={(event) => onChange(item.key, { dorsal: event.target.value })}
            disabled={isSubmitting}
          />
        </FormField>

        <FormField htmlFor={`order-link-${item.key}`} label="Link" className={fieldLabelClassName}>
          <Input
            id={`order-link-${item.key}`}
            type="url"
            value={item.link}
            onChange={(event) => onChange(item.key, { link: event.target.value })}
            disabled={isSubmitting}
            placeholder="https://..."
          />
        </FormField>
      </Box>

      <FormField htmlFor={`order-description-${item.key}`} label="Descripción" className={fieldLabelClassName}>
        <Textarea
          id={`order-description-${item.key}`}
          value={item.description}
          onChange={(event) => onChange(item.key, { description: event.target.value })}
          disabled={isSubmitting}
          rows={2}
        />
      </FormField>

      <Box display="flex" gap="4" className="flex-wrap">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={item.downloaded}
            onChange={(event) => onChange(item.key, { downloaded: event.target.checked })}
            disabled={isSubmitting}
          />
          Descargada
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={item.cleaned}
            onChange={(event) => onChange(item.key, { cleaned: event.target.checked })}
            disabled={isSubmitting}
          />
          Limpieza
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={item.ordered}
            onChange={(event) => onChange(item.key, { ordered: event.target.checked })}
            disabled={isSubmitting}
          />
          Pedida
        </label>
      </Box>

      <Typography variant="body2" className="text-right">
        Subtotal: {formatPrice(lineTotal)}
      </Typography>
    </Box>
  );
}
