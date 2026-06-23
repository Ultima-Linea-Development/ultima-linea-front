"use client";

import { useMemo, useState } from "react";
import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/Icons";
import ProductOptionSelect from "@/components/admin/ProductOptionSelect";
import { adminIconTriggerClassName } from "@/lib/admin-interactive-styles";
import {
  emptySupplierOrderSizeRow,
  type SupplierOrderSizeQuantityRow,
} from "@/lib/supplier-order-sizes";
import { sortSizeLabels } from "@/lib/product-inventory";
import { cn } from "@/lib/utils";

type SupplierOrderSizeQuantityFieldsProps = {
  rows: SupplierOrderSizeQuantityRow[];
  onRowsChange: (rows: SupplierOrderSizeQuantityRow[]) => void;
  disabled?: boolean;
  idPrefix?: string;
  sizeOptions?: string[];
  required?: boolean;
  minRows?: number;
};

function normalizeQuantityValue(value: string): string {
  if (value === "") return "";
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return "1";
  return String(Math.max(1, Math.floor(parsed)));
}

export default function SupplierOrderSizeQuantityFields({
  rows,
  onRowsChange,
  disabled = false,
  idPrefix = "supplier-order-size",
  sizeOptions = [],
  required = false,
  minRows = 1,
}: SupplierOrderSizeQuantityFieldsProps) {
  const [customSizeRowIds, setCustomSizeRowIds] = useState<Set<string>>(() => new Set());

  const normalizedSizeOptions = useMemo(() => {
    const seen = new Set<string>();

    return sortSizeLabels(
      sizeOptions
        .map((option) => option.trim())
        .filter(Boolean)
        .filter((option) => {
          const key = option.toLocaleLowerCase();
          if (seen.has(key)) return false;

          seen.add(key);
          return true;
        })
    );
  }, [sizeOptions]);

  const addRow = () => onRowsChange([...rows, emptySupplierOrderSizeRow()]);

  const removeRow = (index: number) => {
    if (rows.length <= minRows) return;
    const rowId = rows[index].id;
    setCustomSizeRowIds((prev) => {
      const next = new Set(prev);
      next.delete(rowId);
      return next;
    });
    onRowsChange(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof SupplierOrderSizeQuantityRow, value: string) => {
    const next = [...rows];
    next[index] = { ...next[index], [field]: value };
    onRowsChange(next);
  };

  const updateCustomSizeRow = (rowId: string, isCustom: boolean) => {
    setCustomSizeRowIds((prev) => {
      const next = new Set(prev);

      if (isCustom) {
        next.add(rowId);
      } else {
        next.delete(rowId);
      }

      return next;
    });
  };

  const isCustomSizeRow = (row: SupplierOrderSizeQuantityRow) => {
    const size = row.size.trim();
    if (customSizeRowIds.has(row.id)) return true;
    if (!size) return false;

    return !normalizedSizeOptions.some(
      (option) => option.toLocaleLowerCase() === size.toLocaleLowerCase()
    );
  };

  const sizeFields = (
    <Box display="flex" direction="col" gap="4" className="min-w-0">
      {rows.length === 0 && (
        <Typography variant="body2" color="muted">
          Sin talles cargados.
        </Typography>
      )}
      {rows.map((row, index) => (
        <div key={row.id} className="flex w-full min-w-0 items-end gap-2">
          <div className="min-w-0 flex-1">
            <ProductOptionSelect
              id={`${idPrefix}-size-${index}`}
              label="Talle"
              value={row.size}
              options={normalizedSizeOptions}
              isCustom={isCustomSizeRow(row)}
              onChange={(value) => updateRow(index, "size", value)}
              onCustomChange={(isCustom) => updateCustomSizeRow(row.id, isCustom)}
              customPlaceholder="Ingresá el talle"
              disabled={disabled}
              required={required}
            />
          </div>
          <div className="w-[100px] shrink-0">
            <FormField htmlFor={`${idPrefix}-quantity-${index}`} label="Cantidad" required={required}>
              <Input
                id={`${idPrefix}-quantity-${index}`}
                type="number"
                min={1}
                value={row.quantity}
                onChange={(event) =>
                  updateRow(index, "quantity", normalizeQuantityValue(event.target.value))
                }
                onBlur={() => {
                  if (row.quantity === "") {
                    updateRow(index, "quantity", "1");
                  }
                }}
                disabled={disabled}
                placeholder="1"
                required={required}
              />
            </FormField>
          </div>
          <button
            type="button"
            onClick={() => removeRow(index)}
            disabled={disabled || rows.length <= minRows}
            aria-label={`Quitar talle ${index + 1}`}
            className={cn(
              adminIconTriggerClassName,
              "mb-0.5 shrink-0 text-muted-foreground hover:text-destructive disabled:pointer-events-none disabled:opacity-50"
            )}
          >
            <Icon name="delete" className="size-5" />
          </button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        disabled={disabled}
        onClick={addRow}
      >
        Agregar talle
      </Button>
    </Box>
  );

  return (
    <FormField label="Talles" required={required}>
      {sizeFields}
    </FormField>
  );
}
